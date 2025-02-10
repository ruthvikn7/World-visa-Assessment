import express from 'express';
import { 
  getPersonalizedRecommendations,
  getPopularBooks
} from '../Controller/recommendationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/personalized/:userId', authenticate, getPersonalizedRecommendations);
router.get('/popular', getPopularBooks);

export default router;