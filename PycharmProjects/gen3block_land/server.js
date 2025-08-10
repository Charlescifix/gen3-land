const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https://images.unsplash.com", "data:"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"]
    }
  }
}));

// Compression middleware
app.use(compression());

// Serve static files
app.use(express.static(__dirname, {
  maxAge: '1d', // Cache static files for 1 day
  etag: true
}));

// Handle form submissions (basic logging)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submissions
app.post('/book-demo', (req, res) => {
  console.log('Demo booking request:', req.body);
  // In production, you'd want to integrate with a proper form handler
  res.redirect('/?message=demo-submitted');
});

app.post('/consultation', (req, res) => {
  console.log('Consultation request:', req.body);
  // In production, you'd want to integrate with a proper form handler
  res.redirect('/?message=consultation-submitted');
});

app.post('/subscribe', (req, res) => {
  console.log('Newsletter subscription:', req.body);
  // In production, you'd want to integrate with a proper email service
  res.redirect('/?message=subscribed');
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'gen3block-landing'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gen3block landing page server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;