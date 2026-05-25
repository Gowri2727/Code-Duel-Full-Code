import { useState, createContext, useContext } from 'react';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Submit from './Components/Submit';
import Home from './Components/Home';
import RandomBox from './Components/RandomBox';
import RoomBox from './Components/RoomBox';
import SoloBox from './Components/SoloBox';
import Profile from './Components/Profile';
import DuelRoom from './Components/DuelRoom';
import RoomWaitingRoom from './Components/RoomWaitingRoom';

const AppContext = createContext(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState('login');
  const [signupData, setSignupData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const [duelSettings, setDuelSettings] = useState({
    difficulty: '',
    questionType: '',
    mode: '',
    language: '',
    languagePreference: ''
  });

  const contextValue = {
    page,
    setPage,
    signupData,
    setSignupData,
    currentUser,
    setCurrentUser,
    duelSettings,
    setDuelSettings
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

function App() {
  const { page } = useAppContext();

  return (
    <>
      {page === 'login' && <Login />}
      {page === 'signup' && <Signup />}
      {page === 'submit' && <Submit />}
      {page === 'home' && <Home />}
      {page === 'random' && <RandomBox />}
      {page === 'room' && <RoomBox />}
      {page === 'solo' && <SoloBox />}
      {page === 'profile' && <Profile />}
      {page === 'duel' && <DuelRoom />}
      {page === 'waiting-room' && <RoomWaitingRoom />}
    </>
  );
}

export default App;
