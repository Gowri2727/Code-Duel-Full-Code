
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');

dotenv.config();
const app = express();

// ✅ CORS (must be BEFORE routes and sessions)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// ✅ Handle preflight requests (OPTIONS)
app.options('*', cors());

// ✅ Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Express JSON (safe with body-parser above)
app.use(express.json());

// ✅ Session Setup (after CORS, before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set true in production with HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ✅ Routes (all after middleware)
const matchmakingRoutes = require('./routes/matchmakingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/matchRoutes');
const randomRoutes = require('./routes/randomRoutes');
const soloRoutes = require('./routes/soloRoutes');
const questionRoutes = require('./routes/questionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const complexityRoutes = require('./routes/complexityRoutes');
const codeRoutes = require('./routes/codeRoutes');

app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/code', codeRoutes);
app.use('/api', authRoutes);
app.use('/api', complexityRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/random', randomRoutes);
app.use('/api/solo', soloRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analyze-complexity', complexityRoutes);

// ✅ Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      huggingface: process.env.HUGGINGFACE_API_KEY ? 'configured' : 'not configured'
    }
  });
});

// ✅ Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// ✅ 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation Error', details: errors });
  }
  if (err.code === 11000) return res.status(400).json({ error: 'Duplicate entry found' });
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' });

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ✅ Graceful Shutdown
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, () => {
    console.log(`🔄 ${signal} received, shutting down gracefully`);
    mongoose.connection.close(() => {
      console.log('📦 MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
