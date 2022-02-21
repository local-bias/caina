import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
// @ts-ignore
import outputcss from '!!raw-loader!src/styles/global.css';
// @ts-ignore
import highlightCss from '!!raw-loader!highlight.js/styles/atom-one-light.css';
// @ts-ignore
import sanitizeCss from '!!raw-loader!sanitize.css';

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            dangerouslySetInnerHTML={{
              __html: `${sanitizeCss}\n${highlightCss}\n${outputcss}`,
            }}
          />
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            async
            custom-element='amp-analytics'
            src='https://cdn.ampproject.org/v0/amp-analytics-0.1.js'
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
