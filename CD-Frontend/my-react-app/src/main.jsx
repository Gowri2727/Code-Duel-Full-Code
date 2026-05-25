import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App, { AppProvider } from './App.jsx';
import Signup from './Components/Signup.jsx';
import Login from './Components/Login.jsx';
import Submit from './Components/Submit.jsx';
import Home from './Components/Home.jsx';
import RandomBox from './Components/RandomBox.jsx';
import RoomBox from './Components/RoomBox.jsx';
import SoloBox from './Components/SoloBox.jsx';
import Profile from './Components/Profile.jsx';
import DuelRoom from './Components/DuelRoom.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/random" element={<RandomBox />} />
          <Route path="/room" element={<RoomBox />} />
          <Route path="/solo" element={<SoloBox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/duel" element={<DuelRoom />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>
);
