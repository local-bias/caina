import type { InferGetStaticPropsType, NextPage, NextPageWithStyle, PageConfig } from 'next';
import { getAllDocuments } from 'src/lib/source';
import styled from '@emotion/styled';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const allPosts = getAllDocuments();

  return {
    props: { allPosts },
  };
};

const Component: NextPageWithStyle<Props> = ({ className, allPosts }) => (
  <div {...{ className }}>
    <h1>Next.js Playground</h1>
    <h1>記事一覧</h1>
    {allPosts.map((post, i) => (
      <a key={i} href={`/doc/${post.slug}`}>
        <h2>{post.title}</h2>
        <p>{post.date}</p>
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

export const config: PageConfig = { amp: true };
