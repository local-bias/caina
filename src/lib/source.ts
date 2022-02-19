import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const documentRoot = path.join(process.cwd(), 'documents');

export const getDocumentFolders = () => {
  const allDirents = fs.readdirSync(documentRoot, { withFileTypes: true });

  const folders = allDirents.filter((dirent) => dirent.isDirectory());

  return folders.map(({ name }) => name);
};

export const getDocumentFileNames = () => {
  const allDirents = fs.readdirSync(documentRoot, { withFileTypes: true });
  return allDirents.map(({ name }) => name);
};

const getSlug = (fileName: string) => {
  return fileName.replace(/\.mdx?$/, '');
};

export const getDocument = (slug: string): site.document.Props => {
  const mdxPath = path.join(documentRoot, `${slug}.mdx`);
  const mdPath = path.join(documentRoot, `${slug}.md`);
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8');

  const { data, content } = matter(source);

  return {
    slug,
    content,
    ...data,
  };
};

export const getAllDocuments = () => {
  const fileNames = getDocumentFileNames();

  const slugs = fileNames.map((f) => getSlug(f));

  const documents = slugs.map((slug) => getDocument(slug));

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
