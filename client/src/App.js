import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';


import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import BookingRequests from './pages/BookingRequests'
import Listing from './pages/Listing'
import Calendar from './Calendar';

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
          <Route 
              path="/list"
              element={<Listing/>}
            />
          <Route 
              path="/requests"
              element={user ? <BookingRequests /> : <Navigate to="/login "/>}
            />
            <Route 
              path="/login"
              element={!user ? <Login /> : <Navigate to="/requests" />}
            />
            <Route 
              path="/signup"
              element={!user ? <Signup/> : <Navigate to="/requests" />}
            />            
          </Routes>
          <Calendar/>
        </div>
      </BrowserRouter>
    </div>
  );
}


export default App;
