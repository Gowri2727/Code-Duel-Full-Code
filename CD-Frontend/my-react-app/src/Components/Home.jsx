import React from 'react';
import '../Styles/Home.css';
import { useAppContext } from '../App';

const Home = () => {
  const { setPage } = useAppContext();

  const handleProfileClick = () => {
    setPage('profile');
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">🔥 Code-Duel</div>
        <button className="profile-btn" onClick={handleProfileClick}>Profile</button>
      </div>

      <div className="home-container">
        <div onClick={() => setPage('room')} className="box" style={{ cursor: 'pointer' }}>
          <h3>Room Match</h3>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3477/3477412.png"
            alt="room"
            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
          />

          <button
            style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setPage('room');
            }}
          >
            Enter Room
          </button>
        </div>

        <div onClick={() => setPage('random')} className="box" style={{ cursor: 'pointer' }}>
          <h3>Random Match</h3>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1534/1534134.png"
            alt="random"
            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <button
            style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setPage('random');
            }}
          >
            Enter Random Match
          </button>
        </div>

        <div onClick={() => setPage('solo')} className="box" style={{ cursor: 'pointer' }}>
          <h3>Solo Practice</h3>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
            alt="solo"
            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <button
            style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setPage('solo');
            }}
          >
            Start Solo Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;