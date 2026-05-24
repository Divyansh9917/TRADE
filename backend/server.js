import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import Trade from './models/Trade.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Enterprise Security Hardening (Helmet configures strict HTTP Headers)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Performance & Request Profiler Logging
app.use(morgan('dev'));
app.use(express.json());

// 3. Strict Cross-Origin Configuration Control
const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_LIVE_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Rejected by Architectural CORS Policy Security Level 4'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

// 4. Rate Limiting Protection (Prevents High-Frequency API Abuse / DDoS attacks)
const apiSecurityLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 Minute Window
  max: 60, // Limit each client IP to 60 requests per window
  message: { error: "Rate limit breached. Network ingress throttled for security." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiSecurityLimiter);

// --- ENTERPRISE ENDPOINTS ---

/**
 * @route   POST /api/trades
 * @desc    Injest trade orders via asynchronous database persistence layer
 * @access  Protected via Frontend Gateway Middleware
 */
app.post('/api/trades', async (req, res) => {
  const { userEmail, symbol, side, orderType, quantity, price } = req.body;

  // Strict Validation Constraint Layer
  if (!userEmail || !symbol || !side || !quantity || !price) {
    return res.status(400).json({ error: "Ingress validation failed: Missing packet parameters." });
  }

  if (quantity <= 0 || price <= 0) {
    return res.status(422).json({ error: "Ingress validation failed: Arithmetic bounds error." });
  }

  try {
    const tradeOrderPacket = new Trade({
      userEmail,
      symbol,
      side,
      orderType,
      quantity,
      price,
      status: 'EXECUTED'
    });

    const executionReceipt = await tradeOrderPacket.save();
    return res.status(201).json(executionReceipt);

  } catch (dbWriteException) {
    console.error("Critical System DB Write Exception:", dbWriteException.message);
    return res.status(500).json({ error: "Internal Storage Cluster Error. Write Aborted." });
  }
});

/**
 * @route   GET /api/trades/:email
 * @desc    Fetch indexed customer historical telemetry ledgers
 */
app.get('/api/trades/:email', async (req, res) => {
  try {
    const indexedTelemetryLedger = await Trade.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .lean(); // .lean() optimizes retrieval speed by returning lightweight plain JSON objects instead of heavy Mongoose instances
      
    return res.status(200).json(indexedTelemetryLedger);
  } catch (dbReadException) {
    console.error("Critical System DB Read Exception:", dbReadException.message);
    return res.status(500).json({ error: "Internal Storage Cluster Read Timeout." });
  }
});

// Global Fallback Error Interceptor Route
app.use((err, req, res, next) => {
  console.error("Unhandled Thread Crash Exception:", err.stack);
  res.status(500).json({ error: "Global System Exception Intercepted safely." });
});

// Asynchronous Atomic Connection Bootstrap Protocol
const bootstrapServerSystem = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50, // Maintain high concurrent connection pools for parallel threads
      wtimeoutMS: 2500, // Database acknowledgement write operations timeout boundary
    });
    console.log('DB Storage Layer Connected to MongoDB Atlas Cluster with Pool Allocation.');
    
    app.listen(PORT, () => {
      console.log(`Distributed Engine Stack Operational on Ingress Port: ${PORT}`);
    });
  } catch (bootstrapFatalFault) {
    console.error('Critical System Boot Fault Aborted:', bootstrapFatalFault.message);
    process.exit(1);
  }
};

bootstrapServerSystem();