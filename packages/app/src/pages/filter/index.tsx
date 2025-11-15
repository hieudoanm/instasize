import { Divider } from '@ig/components/Divider';
import { Navbar } from '@ig/components/Navbar';
import dynamic from 'next/dynamic';

const Filter = dynamic(() => import('@ig/components/Filter'), {
  ssr: false,
});

const ImagesFilterPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Divider />
      <Filter />
    </div>
  );
};

export default ImagesFilterPage;
