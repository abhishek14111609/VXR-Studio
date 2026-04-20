require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const leadRoutes = require('./routes/leadRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const companyRoutes = require('./routes/companyRoutes');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients and same-origin requests without an Origin header.
    if (!origin) return callback(null, true);

    if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/company', companyRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('VXR Studio API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
