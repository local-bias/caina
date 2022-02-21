import { useRouter } from 'next/router';
import React, { VFC, VFCX } from 'react';
import { DeepReadonly } from 'utility-types';

type ContainerProps = DeepReadonly<{}>;
type Props = ContainerProps & DeepReadonly<{ slug: string[] }>;

const Component: VFCX<Props> = ({ className, slug }) => (
  <header {...{ className }}>{slug.join('/')}</header>
);

const Container: VFC<ContainerProps> = (props) => {
  const router = useRouter();

  const slug = (router.query.slug as string[]) || [];

  return <Component {...{ slug }} />;
};

export default Container;
