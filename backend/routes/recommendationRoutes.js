const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getPopularBooks,
  downloadBook
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getRecommendations);
router.get('/popular', getPopularBooks);
router.post('/download/:id', protect, downloadBook);

module.exports = router;