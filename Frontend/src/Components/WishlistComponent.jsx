import React, { useState, useEffect } from 'react';
import api from '../../baseurl';
import book from '../assets/book.jpg';

const WishlistComponent = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(
        `/users/getWishlist/${userId}`
      );
      setWishlist(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  const removeFromList = async (bookId, listType) => {
    try {
      await api.delete(
        `/users/reading-list/${listType}/${bookId}`
      );
      fetchWishlist();
    } catch (error) {
      console.error(`Error removing from ${listType}:`, error);
    }
  };

  const submitReview = async (bookId, rating, comment) => {
    try {
      await api.post(
        `/reviews/books/${bookId}/reviews`, 
        { rating, comment }
      );
      setReviewModalOpen(null);
      fetchWishlist();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const toggleReadStatus = async (bookId) => {
    try {
      await api.post(
        '/users/reading-list', 
        { bookId, listType: 'readBooks' }
      );
      fetchWishlist();
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  const ReviewModal = ({ book, onClose, onSubmit }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Review {book.title}</h2>
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Comment</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>
          <div className="flex justify-between">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSubmit(rating, comment)} 
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((bookItem) => (
          <div key={bookItem._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={book} alt="Book Cover" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{bookItem.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{bookItem.author}</p>
              
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => removeFromList(bookItem._id, 'wishlist')}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove from Wishlist
                </button>
                <button 
                  onClick={() => toggleReadStatus(bookItem._id)}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    bookItem.read 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white'
                  }`}
                >
                  {bookItem.read ? 'Read' : 'Mark as Read'}
                </button>
              </div>

              {bookItem.read && (
                <button 
                  onClick={() => setReviewModalOpen(bookItem)}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-md"
                >
                  Write Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {reviewModalOpen && (
        <ReviewModal 
          book={reviewModalOpen}
          onClose={() => setReviewModalOpen(null)}
          onSubmit={(rating, comment) => submitReview(reviewModalOpen._id, rating, comment)}
        />
      )}
    </div>
  );
};

export default WishlistComponent;