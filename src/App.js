// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Login';
import Splash from './Pages/Splash';
import Registor from './Pages/Registor';
import UserDetail from './Pages/UserDetails';
import Home from './Pages/Home';
import Search from './Pages/Search';
import Phone from './Pages/Phone';
import Footer from './Pages/Footer';
import ImageUpload from './Pages/Image';
import Interest from './Pages/Interest'
import Member from './Pages/Member';
import Chat from './Pages/Chat';
import Profiles from './Pages/Profiles';
import EditProfile from './Pages/EditProfile';
function App() {
  return (
    <Router>
      {/* Navigation Bar - This is just for easy navigation between pages */}
      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Splash />} /> {/* Splash Screen as Home Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/ImageUpload" element={<ImageUpload />} />
        <Route path="/Interest" element={<Interest />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Register" element={<Registor />} />
        <Route path="/UserDetail" element={<UserDetail />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Phone" element={<Phone />} />
        <Route path="/Member" element={<Member />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Profiles" element={<Profiles />} />
        <Route path="/EditProfile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
