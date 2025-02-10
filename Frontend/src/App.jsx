import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookList from './Components/BookList';
import AuthPage from './Components/AuthPage';
import ProtectedRoute from './Components/ProtectedRoute';
import AddBookForm from './Components/AddBookForm';
import MainComponent from './Components/MainComponent';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><MainComponent /></ProtectedRoute>}/>
        <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>}/>
        <Route path="/add-book" element={<ProtectedRoute><AddBookForm /></ProtectedRoute>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App