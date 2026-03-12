const Book = require('../models/Book');

// @GET /api/books
const getAllBooks = async (req, res) => {
  try {
    const { genre, category, search } = req.query;
    let filter = {};

    if (genre) filter.genre = genre;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, books });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/books
const addBook = async (req, res) => {
  try {
    const {
      title, author, description,
      genre, category, isPremium,
      language, pages
    } = req.body;

    const coverImage = req.coverImageUrl || '';
    const pdfFile = req.pdfFileUrl || '';

    const book = await Book.create({
      title, author, description,
      genre, category, isPremium,
      language, pages,
      coverImage,
      pdfFile,
      addedBy: req.user._id
    });

    res.status(201).json({ success: true, book });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/books/:id
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }
    res.status(200).json({ success: true, message: 'Book deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };