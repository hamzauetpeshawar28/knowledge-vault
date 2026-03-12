const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  params: {
    folder: 'knowledge-vault/pdfs',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

const uploadCover = multer({ storage: coverStorage });
const uploadPDF = multer({ storage: pdfStorage });

module.exports = { cloudinary, uploadCover, uploadPDF };