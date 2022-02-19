import { GetStaticPaths, GetStaticProps, NextPage, NextPageWithStyle, PageConfig } from 'next';
import styled from '@emotion/styled';
import { DeepReadonly } from 'utility-types';
import { getAllDocuments, getDocument } from 'src/lib/source';
import { markdownToHtml } from 'src/lib/markdown';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';
import marked from 'marked';

type ContextProps = DeepReadonly<Pick<site.document.Props, 'slug'>>;
type StaticProps = DeepReadonly<site.document.Props & { html: string }>;
type Props = StaticProps & DeepReadonly<{}>;

export const getStaticPaths: GetStaticPaths<ContextProps> = () => {
  const documents = getAllDocuments();

  return {
    paths: documents.map((document) => ({ params: { slug: document.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<StaticProps, ContextProps> = async (context) => {
  if (!context.params) {
    console.error('ページパラメータが取得できませんでした');
    return { notFound: true };
  }

  const document = getDocument(context.params.slug);

  const html = await markdownToHtml(document.content);

  return {
    props: { ...document, html },
  };
};

const Component: NextPageWithStyle<Props> = ({ className, html, content, ...others }) => (
  <div {...{ className }}>
    <div>content</div>
    <div>
      {Object.entries(others).map(([key, value], i) => (
        <div key={i}>
          {key}: {value}
        </div>
      ))}
    </div>
    <div>html</div>
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </div>
);

const StyledComponent = styled(Component)``;

const Container: NextPage<StaticProps> = (props) => {
  return <StyledComponent {...props} />;
};

export default Container;

export const config: PageConfig = { amp: true };
