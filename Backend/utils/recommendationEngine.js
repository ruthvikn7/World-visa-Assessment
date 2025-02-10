import Book from "../Models/bookSchema.js";

export const calculateRecommendations = async (userPreferences, excludeBooks = []) => {
    const { favoriteGenres } = userPreferences;
    
    const recommendations = await Book.aggregate([
      {
        $match: {
          _id: { $nin: excludeBooks },
          genre: { $in: favoriteGenres }
        }
      },
      {
        $addFields: {
          relevanceScore: {
            $multiply: [
              { $size: { $setIntersection: ["$genre", favoriteGenres] } },
              2
            ]
          }
        }
      },
      { $sort: { relevanceScore: -1 } },
      { $limit: 10 }
    ]);

    if (favoriteGenres.length === 0) {
      return await Book.find({ _id: { $nin: excludeBooks } }).limit(10);
    }

    return recommendations;
};
