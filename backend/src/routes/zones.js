import { Router } from 'express';
import { state } from '../store/state.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(state.getZonePayload());
});

export default router;
