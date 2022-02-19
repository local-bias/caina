import { FCX } from 'react';

import GlobalStyle from './global-style';

const Component: FCX = ({ children, className }) => (
  <>
    <GlobalStyle />
    <div {...{ className }}>
      <main>{children}</main>
    </div>
  </>
);

export default Component;
