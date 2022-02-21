import { FC } from 'react';

import Header from './header';
import Footer from './footer';

const Component: FC = ({ children }) => (
  <div id='grid'>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Component;
