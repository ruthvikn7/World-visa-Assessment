import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });
  
  reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });
  
  const Review = mongoose.model('Review', reviewSchema);
  export default Review;