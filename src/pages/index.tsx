import type { InferGetStaticPropsType, NextPage, NextPageWithStyle, PageConfig } from 'next';
import { getAllDocuments } from 'src/lib/source';
import styled from '@emotion/styled';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const documents = getAllDocuments();

  return {
    props: { documents },
  };
};

const Component: NextPageWithStyle<Props> = ({ className, documents }) => (
  <div {...{ className }}>
    <h1>Next.js Playground</h1>
    <h1>記事一覧</h1>
    {documents.map((document, i) => (
      <a key={i} href={`/doc/${document.slug.join('/')}`}>
        <h2>{document.title}</h2>
        <small>{document.date}</small>
      </a>
    ))}
  </div>
);

const StyledComponent = styled(Component)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Container: NextPage<Props> = (props) => {
  return <StyledComponent {...props} />;
};

export default Container;
