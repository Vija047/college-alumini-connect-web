import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componets/navbar';
import RegisterPage from './componets/pages/register';
import LoginPage from './componets/pages/login';
import Home from './componets/pages/home';
import ProfilePage from './componets/pages/Profilepage';
import AlumniDirectory from './componets/alumindirectory';
import CommunityFeed from './componets/Community';
import AddAchievement from './achivements';
import EventList from './componets/events';
function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
       <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      <Route path="/Register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path='/aluminidirectory' element={< AlumniDirectory/>} />
      <Route path='/community' element={< CommunityFeed/>} />
      <Route path='/achievements' element={< AddAchievement/>} />
      <Route path='/events' element={< EventList/>} />
      </Routes>
    </Router>
  );
}

export default App;
