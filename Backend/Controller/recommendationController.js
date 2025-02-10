import Book from '../Models/bookSchema.js';
import User from '../Models/userSchema.js';
// import { calculateRecommendations } from '../utils/recommendationEngine.js';

// export const getPersonalizedRecommendations = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId);
    
//     if (!user?.preferences) {
//       return res.status(400).json({ message: 'User preferences not set' });
//     }

//     const recommendations = await calculateRecommendations(user.preferences, user.readBooks);
//     res.json(recommendations);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const preferredGenres = user.preferences?.favoriteGenres || [];

    let books;
    if (preferredGenres.length > 0) {
      books = await Book.find({ genre: { $in: preferredGenres } });
    } else {
      books = await Book.find({});
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getPopularBooks = async (req, res) => {
  try {
    const { genre } = req.query;
    const match = genre ? { genre: genre } : {};

    const popularBooks = await Book.aggregate([
      { $match: match },
      {
        $match: {
          totalRatings: { $gte: 1 } 
        }
      },
      {
        $addFields: {
          popularityScore: {
            $multiply: [
              "$averageRating",
              { $ln: { $add: ["$totalRatings", 1] } }
            ]
          }
        }
      },
      { $sort: { popularityScore: -1 } },
      { $limit: 10 }
    ]);

    res.json(popularBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};