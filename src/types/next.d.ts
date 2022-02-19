import { NextPage } from 'next';

declare module 'next' {
  type NextPageWithStyle<P = {}> = NextPage<P & { className?: string }>;
}
