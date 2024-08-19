import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

const roboto = Roboto({ subsets: ['latin'], weight: '300' });

export const metadata: Metadata = {
  title: 'Web Scraper',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(roboto.className, 'py-8')}>{children}</body>
    </html>
  );
}
