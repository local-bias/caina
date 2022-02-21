import { GetStaticPaths, GetStaticProps, NextPage, PageConfig } from 'next';
import { DeepReadonly } from 'utility-types';
import { getAllDocuments, getDocument, getDocumentSlugs, sortDocuments } from 'src/lib/source';
import { markdownToHtml } from 'src/lib/markdown';
import { Noindex } from 'src/components/seo-noindex';

type ContextProps = Readonly<{ slug: string[] }>;

type DocumentProps = DeepReadonly<{ document: site.document.Props; html: string }>;
type CategoryProps = DeepReadonly<{ documents: site.document.Props[] }>;

type StaticProps = DeepReadonly<
  | ({ type: 'document' } & DocumentProps)
  | ({
      type: 'category';
    } & CategoryProps)
>;

export const getStaticPaths: GetStaticPaths<ContextProps> = () => {
  const slugs = getDocumentSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<StaticProps, ContextProps> = async (context) => {
  if (!context.params) {
    console.error('ページパラメータが取得できませんでした');
    return { notFound: true };
  }

  const { slug } = context.params;

  const document = getDocument(slug);

  // マークダウンが取得できた場合は、記事ページとして出力
  if (document) {
    const html = await markdownToHtml(document.content);
    return { props: { type: 'document', document, html } };
  }

  // マークダウンが取得できなかった場合は、カテゴリーページとして記事一覧を出力
  const documents = getAllDocuments(slug);

  const sorted = sortDocuments(documents);

  return {
    props: { type: 'category', documents: sorted },
  };
};

const Document: NextPage<DocumentProps> = ({ document, html }) => (
  <div>
    <h1>Document</h1>
    <article>
      {!!document.title && <h1 className='title'>{document.title}</h1>}
      {!!document.date && <div className='date'>{document.date}</div>}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  </div>
);
const Category: NextPage<CategoryProps> = ({ documents }) => (
  <div>
    <h1>Category</h1>
    {documents.map((document, i) => (
      <a key={i} href={`/doc/${document.slug.join('/')}`}>
        <div>
          <div>{document.title}</div>
          <div>{document.date}</div>
        </div>
      </a>
    ))}
  </div>
);

const Container: NextPage<StaticProps> = (props) => {
  if (props.type === 'document') {
    return <Document {...props} />;
  }
  return (
    <>
      <Noindex />
      <Category {...props} />
    </>
  );
};

export default Container;

export const config: PageConfig = { amp: true };
