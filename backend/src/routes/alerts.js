import { Router } from 'express';
import { state } from '../store/state.js';

const router = Router();

export default function createAlertsRouter(io) {
  router.get('/', (_req, res) => {
    res.json(state.alerts);
  });

  router.post('/', (req, res) => {
    const { message, severity, source, zoneId } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const alert = state.addAlert({ message, severity, source, zoneId });
    io.emit('alert:new', alert);
    return res.status(201).json(alert);
  });

  return router;
}
