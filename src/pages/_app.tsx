import type { AppProps } from 'next/app';
import 'highlight.js/styles/github.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
