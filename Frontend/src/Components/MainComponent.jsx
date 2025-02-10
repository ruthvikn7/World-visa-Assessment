import React, { useState } from "react";
import BookList from "./BookList";
import AddBookForm from "./AddBookForm";
import logo from "../assets/logo image.png";
import BookRecommendations from "./BookRecommendations";
import PopularBooks from "./PopularBooks";
import WishlistComponent from "./WishlistComponent";

const Navbar = ({ setActiveComponent }) => {
  return (
    <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
      
      <img src={logo} alt="Logo" className="h-10" />
      
    
      <ul className="flex space-x-6 font-semibold text-lg">
        <li className="cursor-pointer hover:text-gray-300" onClick={() => setActiveComponent("all-books")}>All Books</li>
        <li className="cursor-pointer hover:text-gray-300" onClick={() => setActiveComponent("top-recommendations")}>Recommendations</li>
        <li className="cursor-pointer hover:text-gray-300" onClick={() => setActiveComponent("popular")}>Popular</li>
        <li className="cursor-pointer hover:text-gray-300" onClick={() => setActiveComponent("my-wishlist")}>My Wishlist</li>
      </ul>

      
      <button
        onClick={() => setActiveComponent("add-book")}
        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100"
      >
        Add Book
      </button>
    </nav>
  );
};

const MainComponent = () => {
  const [activeComponent, setActiveComponent] = useState("all-books");
  
  return (
    <div>
      <Navbar setActiveComponent={setActiveComponent} />
      <div className="p-6">
        {activeComponent === "all-books" && <div><BookList/></div>}
        {activeComponent === "top-recommendations" && <div><BookRecommendations/></div>}
        {activeComponent === "popular" && <div><PopularBooks/></div>}
        {activeComponent === "my-wishlist" && <div><WishlistComponent/></div>}
        {activeComponent === "add-book" && <div><AddBookForm/></div>}
      </div>
    </div>
  );
};

export default MainComponent;