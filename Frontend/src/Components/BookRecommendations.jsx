import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import api from '../../baseurl';
import books from '../assets/book.jpg';


const BookRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    favoriteGenres: [],
    favoriteAuthors: [],
    readingLevel: 'beginner'
  });
  const userId = JSON.parse(localStorage.getItem('user'));


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [recsResponse, prefsResponse] = await Promise.all([
          api.get(`/recommendations/personalized/${userId}`),
          api.get(`/users/preferences/${userId}`)
        ]);
        setRecommendations(recsResponse.data);
        setPreferences(prefsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handlePreferenceUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/preferences/${userId}`, preferences);
      const [recsResponse] = await Promise.all([
        api.get(`/recommendations/personalized/${userId}`)
      ]);
      setRecommendations(recsResponse.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const PreferencesModal = () => {
    const genres = [
      'Fiction', 'Fantasy', 'Mystery', 'Science Fiction', 
      'Biography', 'History', 'Romance', 'Thriller', 
      'Non-Fiction', 'Adventure'
    ];
  
    const toggleGenre = (genre) => {
      setPreferences(prev => ({
        ...prev,
        favoriteGenres: prev.favoriteGenres.includes(genre)
          ? prev.favoriteGenres.filter(g => g !== genre)
          : [...prev.favoriteGenres, genre]
      }));
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[500px] relative max-h-[90vh] overflow-y-auto">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">Update Preferences</h2>
          
          <form onSubmit={handlePreferenceUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favorite Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    type="button"
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 rounded-full text-sm 
                      ${preferences.favoriteGenres.includes(genre) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700'}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Level
              </label>
              <select
                value={preferences.readingLevel}
                onChange={(e) => setPreferences({
                  ...preferences,
                  readingLevel: e.target.value
                })}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
  
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Update Preferences
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Recommendations</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((book) => (
          <div 
            key={book._id} 
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <img src={books} alt="Book Cover" className="w-full h-48 object-cover" />
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
              {book.totalRatings >= 10 && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Popular
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{book.description}</p>
          </div>
        ))}
      </div>

      {isModalOpen && <PreferencesModal />}
    </div>
  );
};

export default BookRecommendations;