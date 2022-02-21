import React, { VFC } from 'react';
import Head from 'next/head';

const Component: VFC = () => (
  <Head>
    <meta name='robots' content='noindex' />
    <meta name='googlebot' content='noindex' />
  </Head>
);

export const Noindex = Component;
