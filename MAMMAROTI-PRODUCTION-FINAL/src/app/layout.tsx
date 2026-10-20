import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const poppins = localFont({
  src: [
    { path: '../../public/fonts/poppins-latin-400-normal.woff2', weight: '400' },
    { path: '../../public/fonts/poppins-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});
const bebas = localFont({
  src: '../../public/fonts/bebas-neue-latin-400-normal.woff2',
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MammaRoti',
  description: 'Your everyday coffebun',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className={`${poppins.variable} ${bebas.variable}`}><body>{children}</body></html>;
}
