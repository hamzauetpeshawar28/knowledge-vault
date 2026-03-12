const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Knowledge Vault API is Running! 🚀' });
});

// Auth Routes   ← YEH NAYA ADD HUA
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// Book Routes
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('❌ DB Error:', err));
  const recommendationRoutes = require('./routes/recommendationRoutes');
app.use('/api/ai', recommendationRoutes);