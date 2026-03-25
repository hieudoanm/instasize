'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const download_service_1 = require('./services/download.service');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.post('/download', async (req, res) => {
  try {
    const { url, base64 } = req.body;
    if (!url || !url.includes('instagram.com')) {
      return res.status(400).json({ error: 'Invalid Instagram URL' });
    }
    const { images } = await (0, download_service_1.getImages)(url);
    if (!images.length) {
      return res.status(404).json({ error: 'No images found' });
    }
    // Convert to Base64 (optional)
    if (base64 === true) {
      const converted = await Promise.all(
        images.map((img) => (0, download_service_1.imageUrlToBase64)(img)),
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
