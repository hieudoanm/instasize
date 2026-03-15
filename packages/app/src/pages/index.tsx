import { Divider } from '@ig/components/Divider';
import { Navbar } from '@ig/components/Navbar';
import { NextPage } from 'next';
import Link from 'next/link';

const HomePage: NextPage = () => {
  return (
    <div className="h-screen w-screen">
      <div className="flex h-screen w-screen flex-col">
        <Navbar />
        <Divider />
        <div className="flex h-full grow items-center justify-center">
          <div className="flex flex-col gap-4">
            {[
              { id: 'filter', href: '/filter', name: 'Filter' },
              { id: 'ocr', href: '/ocr', name: 'OCR' },
              { id: 'size', href: '/size', name: 'Size' },
            ].map(({ id, href, name }) => {
              return (
                <Link key={id} href={href}>
                  <button className="btn btn-primary w-full" type="button">
                    {name}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
