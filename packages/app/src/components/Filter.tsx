import { download } from '@ig/utils/download';
import {
  base64,
  filterAsync,
  FilterMask,
  getMimeType,
  png2ico,
  png2jpg,
  svg2png,
} from '@ig/utils/image';
import { FC, useState } from 'react';

const Home: FC = () => {
  const [{ originalBase64 = '', filteredBase64 = '', file = null }, setState] =
    useState<{
      originalBase64: string;
      filteredBase64: string;
      file: File | null;
    }>({
      originalBase64: '',
      filteredBase64: '',
      file: null,
    });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const originalBase64: string = await base64(file);
      setState((previous) => ({
        ...previous,
        originalBase64,
        filteredBase64: '',
        file,
      }));
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-center gap-4">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-2 font-semibold text-white shadow-lg shadow-black/30 backdrop-blur-lg transition duration-300 hover:bg-white/20 focus:ring-2 focus:ring-white/30 focus:outline-none">
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {getMimeType(filteredBase64 || originalBase64)?.includes('png') && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              const content = await png2ico(filteredBase64 || originalBase64);
              download({ content, format: 'ico', filename: 'favicon' }).image();
            }}>
            Export as ICO
          </button>
        )}
        {getMimeType(filteredBase64 || originalBase64)?.includes('png') && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              const content = await png2jpg(filteredBase64 || originalBase64);
              download({ content, format: 'jpg', filename: 'image' }).image();
            }}>
            Export as JPG
          </button>
        )}
        {getMimeType(filteredBase64 || originalBase64)?.includes('svg') && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              const content = await svg2png(filteredBase64 || originalBase64);
              download({ content, format: 'png', filename: 'image' }).image();
            }}>
            Export as PNG
          </button>
        )}
      </div>
      {file && (
        <div className="container mx-auto flex flex-col gap-y-8 p-8">
          <div
            className="h-64 border border-neutral-800 bg-contain bg-center bg-no-repeat md:h-128"
            style={{
              backgroundImage: `url(${filteredBase64 || originalBase64})`,
            }}
          />
          <div className="flex flex-col gap-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { mask: 'bluechrome' as FilterMask },
                { mask: 'diamante' as FilterMask },
                { mask: 'firenze' as FilterMask },
                { mask: 'flagblue' as FilterMask },
                { mask: 'golden' as FilterMask },
                { mask: 'grayscale' as FilterMask },
                { mask: 'islands' as FilterMask },
                { mask: 'liquid' as FilterMask },
                { mask: 'lofi' as FilterMask },
                { mask: 'marine' as FilterMask },
                { mask: 'mauve' as FilterMask },
                { mask: 'obsidian' as FilterMask },
                { mask: 'oceanic' as FilterMask },
                { mask: 'pastel_pink' as FilterMask },
                { mask: 'perfume' as FilterMask },
                { mask: 'radio' as FilterMask },
                { mask: 'rosetint' as FilterMask },
                { mask: 'seagreen' as FilterMask },
                { mask: 'serenity' as FilterMask },
                { mask: 'twenties' as FilterMask },
                { mask: 'vintage' as FilterMask },
              ].map(({ mask }) => {
                return (
                  <button
                    key={mask}
                    type="button"
                    className="btn btn-primary"
                    onClick={async () => {
                      const filteredBase64: string = await filterAsync(
                        mask,
                        originalBase64
                      );
                      setState((previous) => ({
                        ...previous,
                        filteredBase64: filteredBase64,
                      }));
                    }}>
                    Filter - {mask.charAt(0).toUpperCase() + mask.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
