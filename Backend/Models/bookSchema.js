import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  author: { type: String, required: true, index: true },
  genre: [{ 
    type: String, 
    required: true, 
    enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Biography'],
    index: true 
  }],
  description: { type: String, required: true },
  imageUrl: { type: String },
  publishedYear: { type: Number },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

const Book = mongoose.model('Book', bookSchema);
export default Book;