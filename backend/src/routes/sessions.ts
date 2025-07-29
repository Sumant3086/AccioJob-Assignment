<<<<<<< HEAD
import express from 'express';
import {
  getSessions,
  getSession,
  createSession,
  sendMessage,
  updateSession,
  deleteSession
} from '../controllers/sessionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:sessionId', getSession);
router.put('/:sessionId', updateSession);
router.delete('/:sessionId', deleteSession);
router.post('/:sessionId/messages', sendMessage);

=======
import express from 'express';
import {
  getSessions,
  getSession,
  createSession,
  sendMessage,
  updateSession,
  deleteSession
} from '../controllers/sessionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:sessionId', getSession);
router.put('/:sessionId', updateSession);
router.delete('/:sessionId', deleteSession);
router.post('/:sessionId/messages', sendMessage);

>>>>>>> 89eac74 (initial push,still working on)
export default router;