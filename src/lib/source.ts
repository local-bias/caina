import { existsSync, readdirSync, readFileSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dirTree, { DirectoryTree } from 'directory-tree';

const documentRoot = path.join(process.cwd(), 'documents');

/**
 * マークダウンを保存しているディレクトリから、階層情報を動的ルーティングのスラッグに変換した配列を返却します
 * @returns 動的ルーティングのスラッグ配列
 */
export const getDocumentSlugs = () => {
  const tree = dirTree(documentRoot);

  if (!tree.children?.length) {
    console.log(
      '😕 ドキュメントフォルダにデータが存在しないため、動的ルーティングは実行されません。'
    );
    return [[]];
  }

  const children = tree.children!;

  return children.map((child) => flatTree(child)).flat();
};

/**
 * ディレクトリツリーに再帰的にアクセスし、階層情報を配列として均したデータを返却します
 * @param tree 対象ディレクトリツリー
 * @param parent 親フォルダ
 * @returns
 */
const flatTree = (tree: DirectoryTree, parent: string[] = []): string[][] => {
  const slug = [...parent, getSlugFromFilename(tree.name)];

  if (tree.children?.length) {
    const childSlugs = tree.children.map((child) => flatTree(child, slug)).flat();
    return [slug, ...childSlugs];
  }
  return [slug];
};

export const getDocumentFolders = () => {
  const allDirents = readdirSync(documentRoot, { withFileTypes: true });

  const folders = allDirents.filter((dirent) => dirent.isDirectory());

  return folders.map(({ name }) => name);
};

export const getSlugFromFilename = (fileName: string) => {
  return fileName.replace(/\.mdx?$/, '');
};

export const getDocument = (slug: string[]): site.document.Props | null => {
  const [filename] = slug.slice(-1);
  const folders = slug.slice(0, -1);

  const mdxPath = path.join(documentRoot, ...folders, `${filename}.mdx`);
  const mdPath = path.join(documentRoot, ...folders, `${filename}.md`);

  const existsMdx = existsSync(mdxPath);
  const existsMd = existsSync(mdPath);

  if (!existsMd && !existsMdx) {
    return null;
  }

  const source = existsMdx ? readFileSync(mdxPath, 'utf8') : readFileSync(mdPath, 'utf8');

  const { data, content } = matter(source);

  return {
    slug,
    filename,
    content,
    ...data,
  };
};

export const getDocumentPath = (slug: string[] = []) => {
  return path.join(documentRoot, ...slug);
};

export const getAllDocuments = (slug: string[] = []): site.document.Props[] => {
  const fullPath = getDocumentPath(slug);
  const allDirents = readdirSync(fullPath, { withFileTypes: true });

  const folders = allDirents.filter((dirent) => dirent.isDirectory());
  const files = allDirents.filter((dirent) => !dirent.isDirectory());

  const result = [];

  if (files.length) {
    const documents = files.map((file) => {
      const fileSlug = getSlugFromFilename(file.name);
      const documentSlug = [...slug, fileSlug];

      return getDocument(documentSlug);
    });

    const filteredDocuments = documents.filter((document) => document) as site.document.Props[];

    result.push(...filteredDocuments);
  }

  if (folders.length) {
    const documents = folders
      .map((folder) => {
        return getAllDocuments([...slug, folder.name]);
      })
      .flat();

    result.push(...documents);
  }

  return result;
};

export const sortDocuments = (documents: site.document.Props[]) => {
  return documents.sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;

    if (!dateA && !dateB) {
      return a.slug > b.slug ? -1 : 1;
    }

    if (!dateA) {
      return 1;
    }
    if (!dateB) {
      return -1;
    }

    return dateA > dateB ? -1 : 1;
  });
};
