import { useState, useEffect } from 'react';
import api from '../../baseurl';
import book from '../assets/book.jpg';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [wishlistedBooks, setWishlistedBooks] = useState([]);

  useEffect(() => {
    loadBooks();
    fetchWishlist();
  }, [page]);

  const fetchWishlist = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'));

      const response = await api.get(`/users/getWishlist/${userId}`);
      setWishlistedBooks(response.data.map(book => book._id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/books?page=${page}&limit=10`
      );
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.get(
        `/books/search?query=${encodeURIComponent(searchQuery)}`
      );
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (bookId) => {
    try {
      await api.post(
        '/users/reading-list', 
        { bookId, listType: 'wishlist' }
      );
      // Update local wishlist state
      setWishlistedBooks(prev => [...prev, bookId]);
      alert('Book added to wishlist!');
    } catch (error) {
      console.error('Error adding book to wishlist:', error);
      alert('Failed to add book to wishlist');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((bookItem) => (
            <div key={bookItem._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={book} alt="Book Cover" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{bookItem.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{bookItem.author}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{bookItem.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {bookItem.genre.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Rating: {bookItem.averageRating.toFixed(1)} ({bookItem.totalRatings} reviews)
                </div>
                <button
                  onClick={() => addToWishlist(bookItem._id)}
                  disabled={wishlistedBooks.includes(bookItem._id)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {wishlistedBooks.includes(bookItem._id) ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;