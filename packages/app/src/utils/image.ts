import init, {
  open_image,
  grayscale,
  golden,
  firenze,
  lofi,
  obsidian,
  pastel_pink,
  filter,
} from '@silvia-odwyer/photon';

export const base64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const { result } = reader;
      if (!result) {
        resolve('');
      } else if (typeof result === 'string') {
        resolve(result);
      } else {
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(result);
        resolve(text);
      }
    };
    reader.onerror = (event) => reject(new Error(event.type));
  });
};

export const png2ico = (base64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64;
    image.onload = async () => {
      // Canvas
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      // Context
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(image, 0, 0, 32, 32);
      // To Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          resolve(URL.createObjectURL(blob));
          canvas.remove();
        },
        'image/vnd.microsoft.icon',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        '-moz-parse-options:format=bmp;bpp=512' as any
      );
    };

    image.onerror = () => {
      reject(new Error('error'));
    };
  });
};

export const png2jpg = (base64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64;
    image.onload = async () => {
      // Canvas
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      // Context
      const context = canvas.getContext('2d');
      if (!context) return;
      // Optional: set white background (since JPG has no transparency)
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(image, 0, 0, 32, 32);

      // To Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          resolve(URL.createObjectURL(blob));
          canvas.remove();
        },
        'image/jpeg',
        1
      );
    };

    image.onerror = () => {
      reject(new Error('error'));
    };
  });
};

export const png = (base64: string) => {
  return { ico: () => png2ico(base64), jpg: () => png2jpg(base64) };
};

export const svg2png = (base64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64;
    image.onload = async () => {
      // Canvas
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = image.width || 512;
      canvas.height = image.height || 512;
      // Context
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(image, 0, 0);
      // To Blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
        canvas.remove();
      }, 'image/png');
    };

    image.onerror = () => {
      reject(new Error('error'));
    };
  });
};

export const svg = (base64: string) => {
  return { svg: () => svg2png(base64) };
};

export const getMimeType = (base64: string): string | null => {
  const regexp: RegExp = /^data:(.*?);base64,/;
  const match = regexp.exec(base64);
  console.info('match', match);
  return match ? match[1] : null;
};

export const mimeToExtension: Record<string, 'gif' | 'ico' | 'jpg' | 'png'> = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/x-icon': 'ico',
};

export type FilterMask =
  | 'bluechrome'
  | 'diamante'
  | 'firenze'
  | 'flagblue'
  | 'golden'
  | 'grayscale'
  | 'islands'
  | 'liquid'
  | 'lofi'
  | 'marine'
  | 'mauve'
  | 'obsidian'
  | 'oceanic'
  | 'pastel_pink'
  | 'perfume'
  | 'radio'
  | 'rosetint'
  | 'seagreen'
  | 'serenity'
  | 'twenties'
  | 'vintage';

const rustFilter = async (
  mask: FilterMask,
  image: HTMLImageElement
): Promise<string> => {
  await init();

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  if (context === null) return '';
  context.drawImage(image, 0, 0);

  const photonImage = open_image(canvas, context);
  canvas.remove();

  if (mask === 'golden') {
    golden(photonImage);
  } else if (mask === 'grayscale') {
    grayscale(photonImage);
  } else if (mask === 'firenze') {
    firenze(photonImage);
  } else if (mask === 'lofi') {
    lofi(photonImage);
  } else if (mask === 'obsidian') {
    obsidian(photonImage);
  } else if (mask === 'pastel_pink') {
    pastel_pink(photonImage);
  } else {
    filter(photonImage, mask);
  }

  const base64: string = photonImage.get_base64();
  return base64;
};

export const filterAsync = (
  mask: FilterMask,
  base64: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64;

    image.onload = async () => {
      const base64: string = await rustFilter(mask, image);
      resolve(base64);
    };

    image.onerror = () => {
      reject(new Error('Error'));
    };
  });
};
