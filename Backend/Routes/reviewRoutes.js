import express from 'express';
import {
  createReview,
  updateReview,
  getBookReviews,
} from '../Controller/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/books/:bookId/reviews', authenticate, createReview);
router.get('/books/:bookId/reviews', getBookReviews);
router.put('/reviews/:reviewId', authenticate, updateReview);

export default router;