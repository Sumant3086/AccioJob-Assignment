<<<<<<< HEAD
import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

=======
import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

>>>>>>> 89eac74 (initial push,still working on)
export default router;