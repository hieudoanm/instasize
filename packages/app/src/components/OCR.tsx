import { tryCatch } from '@ig/utils/try-catch';
import { FC, useState } from 'react';
import Tesseract from 'tesseract.js';

export const OCR: FC = () => {
  const [{ loading = false, text = '' }, setState] = useState<{
    loading: boolean;
    text: string;
  }>({
    loading: false,
    text: '',
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((previous) => ({ ...previous, loading: true }));
    const file = e.target.files?.item(0);
    if (file) {
      const langs = 'eng';
      const options: Partial<Tesseract.WorkerOptions> = {
        logger: (message: Tesseract.LoggerMessage) => console.log(message),
      };
      const { data = { data: { text: '' } }, error } = await tryCatch(
        Tesseract.recognize(file, langs, options)
      );
      if (error) {
        setState((previous) => ({
          ...previous,
          text: error.message,
          loading: false,
        }));
        return;
      }
      if (!data?.data?.text) {
        setState((previous) => ({
          ...previous,
          text: 'No text found',
          loading: false,
        }));
        return;
      }
      const text = data.data.text.trim();
      if (!text) {
        setState((previous) => ({
          ...previous,
          text: 'No text found',
          loading: false,
        }));
        return;
      }
      setState((previous) => ({ ...previous, text, loading: false }));
    } else {
      setState((previous) => ({ ...previous, loading: false }));
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col gap-y-8">
        <label className="btn btn-primary w-full cursor-pointer">
          <span>{loading ? 'Loading' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={loading}
          />
        </label>
        <textarea
          className="textarea w-full"
          rows={12}
          value={text}
          placeholder="Extracted text will appear here..."
          readOnly
        />
      </div>
    </div>
  );
};

export default OCR;
