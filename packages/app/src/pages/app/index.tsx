import { NextPage } from 'next';
import { useState, useRef, useCallback, useEffect } from 'react';

const AppPage: NextPage = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [padding, setPadding] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((src: string, pad: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const maxDim = Math.max(w, h);
      const paddingPx = Math.round((pad / 100) * maxDim);
      const size = maxDim + paddingPx * 2;

      canvas.width = size;
      canvas.height = size;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Center image
      const x = Math.round((size - w) / 2);
      const y = Math.round((size - h) / 2);
      ctx.drawImage(img, x, y, w, h);

      setOutputUrl(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = src;
  }, []);

  useEffect(() => {
    if (imageSrc) {
      setIsProcessing(true);
      processImage(imageSrc, padding);
    }
  }, [imageSrc, padding, processImage]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setOutputUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = 'instasize.png';
    a.click();
  };

  return (
    <div className="bg-base-100 min-h-screen font-sans">
      {/* Header */}
      <header className="border-base-200 border-b">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-5">
          <div className="bg-neutral flex h-8 w-8 items-center justify-center rounded-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="1"
                y="1"
                width="14"
                height="14"
                rx="2"
                stroke="white"
                strokeWidth="1.5"
              />
              <rect
                x="4"
                y="5"
                width="8"
                height="6"
                rx="1"
                fill="white"
                opacity="0.7"
              />
            </svg>
          </div>
          <span className="text-base-content text-xl font-bold tracking-tight">
            InstaSize
          </span>
          <span className="badge badge-ghost badge-sm ml-1 font-normal">
            Square Fit
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {!imageSrc ? (
          /* Upload Zone */
          <div
            className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-base-300 hover:border-base-400 hover:bg-base-200/50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}>
            <div className="flex flex-col items-center justify-center gap-5 px-8 py-24 select-none">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-200 ${isDragging ? 'bg-primary/10' : 'bg-base-200'}`}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-colors duration-200 ${isDragging ? 'text-primary' : 'text-base-content/40'}`}
                  stroke="currentColor"
                  strokeWidth="1.5">
                  <path d="M4 16l4-4 4 4 4-8 4 8" />
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-base-content text-lg font-semibold">
                  {isDragging ? 'Drop your image here' : 'Upload an image'}
                </p>
                <p className="text-base-content/50 mt-1 text-sm">
                  Drag & drop, or click to browse — PNG, JPG, WEBP
                </p>
              </div>

              <button className="btn btn-primary btn-sm pointer-events-none rounded-full px-6">
                Choose File
              </button>
            </div>
          </div>
        ) : (
          /* Editor */
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base-content/60 text-sm font-semibold tracking-widest uppercase">
                  Preview
                </h2>
                <button
                  className="btn btn-ghost btn-xs text-base-content/40 hover:text-base-content"
                  onClick={() => {
                    setImageSrc(null);
                    setOutputUrl(null);
                    setPadding(10);
                  }}>
                  ✕ Clear
                </button>
              </div>

              <div className="bg-base-200 relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl shadow-inner">
                {isProcessing && (
                  <div className="bg-base-100/60 absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                    <span className="loading loading-spinner loading-md text-primary" />
                  </div>
                )}
                {outputUrl ? (
                  <img
                    src={outputUrl}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-contain"
                    style={{ imageRendering: 'auto' }}
                  />
                ) : (
                  <span className="loading loading-spinner loading-md text-primary" />
                )}
              </div>

              {/* Checkerboard note */}
              <p className="text-base-content/40 text-center text-xs">
                White fill shown — your download will be pure white
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-8">
              <div>
                <h2 className="text-base-content/60 mb-5 text-sm font-semibold tracking-widest uppercase">
                  Adjust Padding
                </h2>

                <div className="card bg-base-200/60 space-y-6 rounded-2xl p-6">
                  {/* Padding value display */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-base-content text-4xl font-bold tabular-nums">
                        {padding}
                        <span className="text-base-content/40 ml-1 text-xl font-normal">
                          %
                        </span>
                      </p>
                      <p className="text-base-content/40 mt-1 text-xs">
                        white border padding
                      </p>
                    </div>
                    <div className="text-base-content/40 space-y-0.5 text-right text-xs">
                      <p>0% → tight fit</p>
                      <p>50% → max space</p>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={padding}
                      onChange={(e) => setPadding(Number(e.target.value))}
                      className="range range-primary range-sm w-full"
                    />
                    <div className="text-base-content/30 flex justify-between px-0.5 text-xs">
                      <span>0</span>
                      <span>10</span>
                      <span>20</span>
                      <span>30</span>
                      <span>40</span>
                      <span>50</span>
                    </div>
                  </div>

                  {/* Quick presets */}
                  <div className="flex flex-wrap gap-2">
                    {[0, 5, 10, 20, 30].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPadding(p)}
                        className={`btn btn-xs rounded-full px-3 transition-all ${
                          padding === p
                            ? 'btn-primary'
                            : 'btn-ghost border-base-300 border'
                        }`}>
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download */}
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  disabled={!outputUrl || isProcessing}
                  className="btn btn-neutral h-12 w-full gap-2 rounded-xl text-sm font-semibold">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8">
                    <path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
                  </svg>
                  Download Square PNG
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-ghost text-base-content/50 h-10 w-full rounded-xl text-sm">
                  Upload different image
                </button>
              </div>

              {/* Info */}
              <div className="bg-base-200/40 border-base-300/50 space-y-2 rounded-xl border p-4">
                <p className="text-base-content/50 text-xs font-semibold tracking-wider uppercase">
                  Output info
                </p>
                <div className="text-base-content/40 space-y-1 text-xs">
                  <p>Format: PNG (lossless)</p>
                  <p>Background: Pure white (#FFFFFF)</p>
                  <p>Aspect ratio: 1:1 square</p>
                  <p>Dimensions: original longest edge + padding</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default AppPage;
