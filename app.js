const express = require('express');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Product Review API is running',
    docs: '/api/v1/users'
  });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: 'Invalid MongoDB ID' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
    return res.status(409).json({ status: 'error', message: `${field} already exists` });
  }

  console.error(err);
  return res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.statusCode ? err.message : 'Internal server error'
  });
});

module.exports = app;
