// server/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests (for debugging)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt received!');
  console.log('📧 Email:', req.body.email);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }

  console.log('✅ Login successful!');
  res.json({
    success: true,
    token: 'fake-jwt-token-12345',
    user: {
      id: '1',
      email: email,
      name: email.split('@')[0] || 'User',
      role: 'user'
    }
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register attempt received!');
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ 
      error: 'All fields are required' 
    });
  }

  res.json({
    success: true,
    token: 'fake-jwt-token-12345',
    user: {
      id: '1',
      email: email,
      name: name,
      role: 'user'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: `Route not found: ${req.method} ${req.url}` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Login: POST http://localhost:${PORT}/api/auth/login`);
});