import React, { VFC, VFCX } from 'react';
import { DeepReadonly } from 'utility-types';

type ContainerProps = DeepReadonly<{}>;
type Props = ContainerProps & DeepReadonly<{}>;

const Component: VFCX = () => (
  <footer>
    <div>Copyright © 2022 All Rights Reserved.</div>
  </footer>
);

const Container: VFC<ContainerProps> = (props) => {
  return <Component {...props} />;
};

export default Container;
