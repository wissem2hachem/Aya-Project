// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/Navbar'; 
import Sidebar from './Components/Sidebar'; 
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import SignIn from './Components/Signin';

const App = () => {
  return (
    
    
    <Router>
    <Routes>
        <Route path="/" element={<Sidebar />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/signIn" element={<SignIn/>} />

    </Routes>
</Router>
  );
};

export default App;
