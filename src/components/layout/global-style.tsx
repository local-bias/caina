import React, { VFC } from 'react';
import { Global, css } from '@emotion/react';

const Container: VFC = () => {
  const styles = css`
    body {
      color: #40536a;
    }

    h1 {
      opacity: 0.6;
    }
    h2 {
      opacity: 0.7;
    }
    h3 {
      opacity: 0.8;
    }
    h4 {
      opacity: 0.9;
    }
  `;

  return <Global {...{ styles }} />;
};

export default Container;
