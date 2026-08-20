import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

// Diagnostic endpoint — returns whether Cloudinary env vars are present
// (never reveals actual values, no auth required)
router.get('/check', (_req, res) => {
  res.json({
    CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    cloud_name_preview: process.env.CLOUDINARY_CLOUD_NAME || '(not set)',
  });
});

router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  async (req, res) => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        message:
          'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your Render environment variables, then redeploy.',
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    // Configure on every request so env var changes take effect without restart
    configureCloudinary();

    try {
      // Convert buffer to base64 data URI — works reliably across all cloudinary SDK versions
      const b64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'builtbywho',
        resource_type: 'image',
      });

      res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      res.status(500).json({
        message: `Image upload failed: ${err.message || 'Unknown error'}`,
        http_code: err.http_code,
      });
    }
  }
);

export default router;
