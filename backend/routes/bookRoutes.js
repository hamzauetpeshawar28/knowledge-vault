const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {
  getAllBooks, getBookById,
  addBook, updateBook, deleteBook
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Cover Image Storage
const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'knowledge-vault/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// PDF Storage
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'knowledge-vault/pdfs',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  }),
});

// Dono files ek saath upload
const uploadBoth = multer({
  storage: multer.diskStorage({}),
}).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadBoth(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      if (req.files && req.files.coverImage) {
        const result = await cloudinary.uploader.upload(
          req.files.coverImage[0].path,
          { folder: 'knowledge-vault/covers' }
        );
        req.coverImageUrl = result.secure_url;
      }

      if (req.files && req.files.pdfFile) {
        const result = await cloudinary.uploader.upload(
          req.files.pdfFile[0].path,
          { folder: 'knowledge-vault/pdfs', resource_type: 'raw' }
        );
        req.pdfFileUrl = result.secure_url;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', protect, adminOnly, handleUpload, addBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;