import express from 'express';
import {
  getSessions,
  getSession,
  createSession,
  sendMessage,
  updateSession,
  deleteSession,
} from '../controllers/sessionController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getSessions);
router.get('/:sessionId', getSession);
router.post('/', createSession);
router.post('/:sessionId/messages', sendMessage);
router.put('/:sessionId', updateSession);
router.delete('/:sessionId', deleteSession);

export default router;