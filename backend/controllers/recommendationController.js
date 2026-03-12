const Book = require('../models/Book');
const User = require('../models/User');

// AI Recommendation Engine
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('downloadHistory.book');
    const allBooks = await Book.find();

    let recommendedBooks = [];
    let scores = {};

    // Step 1: User ki download history se genres nikalo
    const downloadedGenres = {};
    const downloadedIds = new Set();

    if (user.downloadHistory && user.downloadHistory.length > 0) {
      user.downloadHistory.forEach((item) => {
        if (item.book) {
          downloadedIds.add(item.book._id.toString());
          const genre = item.book.genre;
          downloadedGenres[genre] = (downloadedGenres[genre] || 0) + 1;
        }
      });
    }

    // Step 2: Har book ko score do
    allBooks.forEach((book) => {
      const bookId = book._id.toString();

      // Pehle se downloaded books skip karo
      if (downloadedIds.has(bookId)) return;

      let score = 0;

      // Genre match score
      if (downloadedGenres[book.genre]) {
        score += downloadedGenres[book.genre] * 10;
      }

      // Popular books score (download count)
      score += book.downloadCount * 2;

      // Free books ko slight boost
      if (!book.isPremium) score += 5;

      scores[bookId] = { book, score };
    });

    // Step 3: Score ke hisaab se sort karo
    recommendedBooks = Object.values(scores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.book);

    // Agar history nahi hai toh popular books do
    if (recommendedBooks.length === 0) {
      recommendedBooks = await Book.find()
        .sort({ downloadCount: -1 })
        .limit(6);
    }

    res.status(200).json({
      success: true,
      recommendations: recommendedBooks,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Popular Books
const getPopularBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ downloadCount: -1 })
      .limit(6);

    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download Book + Count Update
const downloadBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }

    // Premium book check
    if (book.isPremium && req.user.subscription === 'free') {
      return res.status(403).json({
        message: 'Yeh premium book hai! Subscription upgrade karo!'
      });
    }

    // Download count update
    book.downloadCount += 1;
    await book.save();

    // User history mein add karo
    const user = await User.findById(req.user._id);
    const alreadyDownloaded = user.downloadHistory.some(
      (item) => item.book.toString() === req.params.id
    );

    if (!alreadyDownloaded) {
      user.downloadHistory.push({ book: req.params.id });
      await user.save();
    }

    res.status(200).json({
      success: true,
      pdfUrl: book.pdfFile,
      message: 'Download ready!'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendations, getPopularBooks, downloadBook };