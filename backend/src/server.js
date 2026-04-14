import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import healthRouter from './routes/health.js';
import zonesRouter from './routes/zones.js';
import analyticsRouter from './routes/analytics.js';
import createAlertsRouter from './routes/alerts.js';
import { registerSocketHandlers } from './socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'SmartCrowd backend is running',
    docs: {
      health: '/api/health',
      zones: '/api/zones',
      alerts: '/api/alerts',
      summary: '/api/analytics/summary',
      attendees: '/api/analytics/attendees'
    }
  });
});

app.use('/api/health', healthRouter);
app.use('/api/zones', zonesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/alerts', createAlertsRouter(io));

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`SmartCrowd backend listening on http://localhost:${PORT}`);
});
