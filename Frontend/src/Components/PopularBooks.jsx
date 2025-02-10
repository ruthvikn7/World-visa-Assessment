import React, { useState, useEffect } from 'react';
import api from '../../baseurl';
import bookimg from '../assets/book.jpg';



const PopularBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([
    'Science Fiction', 'Mystery', 'Romance', 
    'Fantasy', 'Historical Fiction', 'Thriller', 
    'Non-Fiction', 'Biography', 'Horror', 'Adventure'
  ]);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await api.get('/recommendations/popular', {
          params: { genre: selectedGenre },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching popular books:', error);
      }
    };

    fetchPopularBooks();
  }, [selectedGenre]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Popular Books</h1>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div 
            key={book._id} 
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <img src={bookimg} alt="Book Cover" className="w-full h-48 object-cover" />
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-2">{book.author}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {book.genre.map((genre) => (
                <span 
                  key={genre} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {genre}
                </span>
              ))}
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Popular
              </span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-3">{book.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-yellow-600">
                ★ {book.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">
                {book.totalRatings} Ratings
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularBooks;