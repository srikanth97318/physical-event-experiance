import { Router } from 'express';
import { state } from '../store/state.js';

const router = Router();

router.get('/summary', (_req, res) => {
  res.json(state.getSummary());
});

router.get('/attendees', (_req, res) => {
  res.json(state.getAttendeePayload());
});

export default router;
