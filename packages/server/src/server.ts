import express, { Request, Response } from 'express';
import { getImages, imageUrlToBase64 } from './services/download.service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/download', async (req: Request, res: Response) => {
  try {
    const { url, base64 } = req.body;

    if (!url || !url.includes('instagram.com')) {
      return res.status(400).json({ error: 'Invalid Instagram URL' });
    }

    const { images } = await getImages(url);

    if (!images.length) {
      return res.status(404).json({ error: 'No images found' });
    }

    // Convert to Base64 (optional)
    if (base64 === true) {
      const converted = await Promise.all(
        images.map((img) => imageUrlToBase64(img)),
      );

      return res.json({
        images: converted.filter(Boolean),
      });
    }

    return res.json({ images });
  } catch (error) {
    console.error('instagram endpoint error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
