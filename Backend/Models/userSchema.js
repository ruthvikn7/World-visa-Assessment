import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    favoriteGenres: [String],
    favoriteAuthors: [String],
    readingLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
  },
  readBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
