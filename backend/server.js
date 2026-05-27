import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';

// Import Models
import Trade from './models/Trade.js';
import Post from './models/Post.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
// 1. HTTP Server wrap for Express (Required for Socket.io)
const server = http.createServer(app);

// 2. Enterprise Security Hardening
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 3. Performance & Request Profiler Logging
app.use(morgan('dev'));
app.use(express.json());

// 4. Strict Cross-Origin Configuration Control
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

// 5. Initialize Socket.io (with unified security rules)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Real-Time Global Chat Event Engine
io.on("connection", (socket) => {
  console.log(`[WebSocket] Secure Connection Established: ${socket.id}`);

  socket.on("send_message", (data) => {
    // Broadcast message to all connected clients
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`[WebSocket] Connection Terminated: ${socket.id}`);
  });
});

// 6. Rate Limiting Protection (Applied ONLY to API routes)
const apiSecurityLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { error: "Rate limit breached. Network ingress throttled for security." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiSecurityLimiter);


app.post('/api/trades', async (req, res) => {
  const { userEmail, symbol, side, orderType, quantity, price } = req.body;

  if (!userEmail || !symbol || !side || !quantity || !price) {
    return res.status(400).json({ error: "Ingress validation failed: Missing packet parameters." });
  }

  if (quantity <= 0 || price <= 0) {
    return res.status(422).json({ error: "Ingress validation failed: Arithmetic bounds error." });
  }

  try {
    const tradeOrderPacket = new Trade({
      userEmail, symbol, side, orderType, quantity, price, status: 'EXECUTED'
    });

    const executionReceipt = await tradeOrderPacket.save();
    return res.status(201).json(executionReceipt);
  } catch (dbWriteException) {
    console.error("Critical System DB Write Exception:", dbWriteException.message);
    return res.status(500).json({ error: "Internal Storage Cluster Error. Write Aborted." });
  }
});

app.get('/api/trades/:email', async (req, res) => {
  try {
    const indexedTelemetryLedger = await Trade.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(indexedTelemetryLedger);
  } catch (dbReadException) {
    console.error("Critical System DB Read Exception:", dbReadException.message);
    return res.status(500).json({ error: "Internal Storage Cluster Read Timeout." });
  }
});

app.post('/api/posts', async (req, res) => {
  const { title, content, authorName, authorEmail, tag } = req.body;

  if (!title || !content || !authorName || !authorEmail) {
    return res.status(400).json({ error: "Missing required blog fields." });
  }

  try {
    const newPost = new Post({ title, content, authorName, authorEmail, tag: tag || 'ANALYSIS' });
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (err) {
    console.error("Blog Publish Error:", err.message);
    return res.status(500).json({ error: "Failed to publish the post." });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(posts);
  } catch (err) {
    console.error("Blog Fetch Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch posts." });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }
    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Delete Post Error:", err.message);
    return res.status(500).json({ error: "Failed to delete post." });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled Thread Crash Exception:", err.stack);
  res.status(500).json({ error: "Global System Exception Intercepted safely." });
});

const bootstrapServerSystem = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50,
      wtimeoutMS: 2500,
    });
    console.log('DB Storage Layer Connected to MongoDB Atlas Cluster with Pool Allocation.');
    
    server.listen(PORT, () => {
      console.log(`Distributed Engine Stack & Socket.io Operational on Ingress Port: ${PORT}`);
    });
  } catch (bootstrapFatalFault) {
    console.error('Critical System Boot Fault Aborted:', bootstrapFatalFault.message);
    process.exit(1);
  }
};

bootstrapServerSystem();