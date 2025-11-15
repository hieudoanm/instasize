import { APP_NAME } from '@ig/constants/app';
import Link from 'next/link';
import { FC } from 'react';

export const Navbar: FC = () => {
  return (
    <nav className="container mx-auto px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link href="/">{APP_NAME}</Link>
        </div>
        <div className="hidden space-x-4 lg:flex">
          {[
            { id: 'filter', href: '/filter', name: 'Filter' },
            { id: 'ocr', href: '/ocr', name: 'OCR' },
            { id: 'size', href: '/size', name: 'Size' },
          ].map(({ id, href, name }) => {
            return (
              <Link key={id} href={href} className="hover:underline">
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
