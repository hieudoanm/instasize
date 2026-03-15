import { Divider } from '@ig/components/Divider';
import { Navbar } from '@ig/components/Navbar';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const OCR = dynamic(() => import('@ig/components/OCR'), {
  ssr: false,
});

const ImagesOCRPage: NextPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Divider />
      <OCR />
    </div>
  );
};

export default ImagesOCRPage;
