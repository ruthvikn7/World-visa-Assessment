// routes/userRoutes.js
import express from 'express';
import { 
  register,
  login,
  updatePreferences,
  addToReadingList,
  removeFromReadingList,
  getUserPreferences,
  getWishlist
} from '../Controller/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

router.put('/preferences/:userId', authenticate, updatePreferences);
router.get('/preferences/:userId', authenticate, getUserPreferences);

// Reading list routes
router.post('/reading-list', authenticate, addToReadingList);
router.get('/getWishlist/:userId', authenticate,getWishlist);
router.delete('/reading-list/:listType/:bookId', authenticate, removeFromReadingList);

// Password management

export default router;

