import { Divider } from '@ig/components/Divider';
import { Navbar } from '@ig/components/Navbar';
import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import { base64 } from '@ig/utils/image';

const SizePage: NextPage = () => {
  const [{ padding = 0, base64String = '', file = null }, setState] = useState<{
    padding: number;
    base64String: string;
    file: File | null;
  }>({
    padding: 0,
    base64String: '',
    file: null,
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String: string = await base64(file);
      setState((previous) => ({
        ...previous,
        base64String,
        file,
      }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex h-full flex-col">
        <Navbar />
        <Divider />
        <div className="container mx-auto flex w-full max-w-md grow flex-col items-center justify-center gap-y-4 p-8 md:gap-y-8">
          <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-2 font-semibold text-white shadow-lg shadow-black/30 backdrop-blur-lg transition duration-300 hover:bg-white/20 focus:ring-2 focus:ring-white/30 focus:outline-none">
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          {file && (
            <div className="flex w-full flex-col gap-y-4 md:gap-y-8">
              <input
                type="range"
                min="0"
                max="100"
                value={padding}
                className="range w-full"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const newPadding = parseInt(event.target.value, 10);
                  setState((previous) => ({
                    ...previous,
                    padding: newPadding,
                  }));
                }}
              />
              <div
                className="aspect-square w-full border border-neutral-800 bg-white"
                style={{ padding: `${padding}px` }}>
                <div
                  className="h-full w-full bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${base64String})` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizePage;
