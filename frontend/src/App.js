// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/Navbar'; 
import Sidebar from './Components/Sidebar'; 
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import SignIn from './Components/Signin';
import SignUp from './Components/Signup';
//new
const App = () => {
  return (
    
    
    <Router>
    <Routes>
        <Route path="/" element={<Sidebar />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/signIn" element={<SignIn/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/signUp" element={<SignUp/>} />
        <Route path="/navbar" element={<NavBar/>} />

    </Routes>
</Router>
  );
};

export default App;
