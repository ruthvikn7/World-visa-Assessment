import express from 'express';
import { getBooks, getBookById, createBook, searchBooks } from '../Controller/bookController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);
router.post('/', authenticate, createBook);

export default router;
