import User from '../Models/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      preferences: {
        favoriteGenres: [],
        favoriteAuthors: [],
        readingLevel: 'beginner'
      }
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const updatePreferences = async (req, res) => {
  try {
    const { favoriteGenres, favoriteAuthors, readingLevel } = req.body;
    const { userId } = req.params;


    const user = await User.findByIdAndUpdate(
      userId,
      {
        preferences: {
          favoriteGenres: favoriteGenres || [],
          favoriteAuthors: favoriteAuthors || [],
          readingLevel: readingLevel || 'beginner'
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addToReadingList = async (req, res) => {
  try {
    const { bookId, listType } = req.body;

    if (!['readBooks', 'wishlist'].includes(listType)) {
      return res.status(400).json({ message: 'Invalid list type' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { [listType]: bookId } },
      { new: true }
    ).select('-password')
      .populate(listType, 'title author');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeFromReadingList = async (req, res) => {
  try {
    const { bookId, listType } = req.params;

    if (!['readBooks', 'wishlist'].includes(listType)) {
      return res.status(400).json({ message: 'Invalid list type' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { [listType]: bookId } },
      { new: true }
    ).select('-password')
      .populate(listType, 'title author');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('preferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("wishlist").populate("readBooks");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const wishlistWithReadStatus = user.wishlist.map(book => ({
            ...book.toObject(),
            read: user.readBooks.some(readBook => readBook._id.equals(book._id))
        }));

        res.json(wishlistWithReadStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





