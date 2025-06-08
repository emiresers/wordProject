const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const wordRoutes = require('./routes/words.routes');
app.use('/api/words', wordRoutes);

const quizRoutes = require('./routes/quiz.routes');
app.use('/api/quiz', quizRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Word Memorization API' });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 