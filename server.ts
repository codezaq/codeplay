import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = '/tmp/server.log';

function log(message: string) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}\n`;
  console.log(formattedMessage.trim());
  try {
    fs.appendFileSync(logFile, formattedMessage);
  } catch (err) {
    try {
      fs.appendFileSync(path.join(__dirname, 'server.log'), formattedMessage);
    } catch (e) {}
  }
}

const app = express();
const PORT = 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  log(`${req.method} ${req.url}`);
  next();
});

process.on('uncaughtException', (err) => {
  log(`UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`UNHANDLED REJECTION at: ${promise} reason: ${reason}`);
});

// --- API Routes ---
// All logic moved to Firebase client-side. 
// Server remains for Vite serving and potential future SSR/Backend tasks.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'firebase' });
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
