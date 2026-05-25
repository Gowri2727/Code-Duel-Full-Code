import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../App';

const RoomWaitingRoom = () => {
  const { duelSettings, currentUser, setPage } = useAppContext();
  const [users, setUsers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5002/api/room/users/${duelSettings.roomCode}`);
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const updateReadyStatus = async (ready) => {
    try {
      await axios.post(`http://localhost:5002/api/room/status`, {
        roomCode: duelSettings.roomCode,
        email: currentUser.email,
        isReady: ready
      });
      setIsReady(ready);
      fetchUsers();
    } catch (err) {
      console.error('Error updating ready status:', err);
    }
  };

  const handleStartMatch = async () => {
    try {
      const res = await axios.post(`http://localhost:5002/api/room/start`, {
        roomCode: duelSettings.roomCode
      });
      if (res.data.users) {
        startCountdown();
      }
    } catch (err) {
      alert('Not all players are ready!');
    }
  };

  const handleLeave = async () => {
    await axios.post(`http://localhost:5002/api/room/leave`, {
      roomCode: duelSettings.roomCode,
      email: currentUser.email
    });
    setPage('home');
  };

  const startCountdown = () => {
    let timeLeft = 10;
    setCountdown(timeLeft);

    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft === 0) {
        clearInterval(interval);
        setPage('duel');
      }
    }, 1000);
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="waiting-room">
      <h2>Room Code: {duelSettings.roomCode}</h2>
      <p>Question Type: {duelSettings.questionType} | Difficulty: {duelSettings.difficulty}</p>
      <p>Total Players: {duelSettings.players} | Language: Python</p>

      <div className="user-list">
        {users.map((user, i) => (
          <div key={user.email} className="user-card">
            <strong>Player {i + 1}</strong>: {user.name}
            <span style={{ color: user.isReady ? 'green' : 'red' }}>
              ({user.isReady ? 'Ready' : 'Not Ready'})
            </span>
          </div>
        ))}
      </div>

      {!countdown && (
        <>
          <div style={{ marginTop: '20px' }}>
            <button
              style={{ backgroundColor: isReady ? 'orangered' : 'green' }}
              onClick={() => updateReadyStatus(!isReady)}
            >
              {isReady ? 'Not Ready' : 'Ready'}
            </button>

            {duelSettings.isAdmin && (
              <button
                style={{ marginLeft: '15px' }}
                onClick={handleStartMatch}
                disabled={!users.length || users.some(u => !u.isReady)}
              >
                Start Match
              </button>
            )}
          </div>

          <button style={{ marginTop: '20px' }} onClick={handleLeave}>
            Leave Room
          </button>
        </>
      )}

      {countdown !== null && (
        <div className="countdown">
          <h3>Match starting in {countdown}...</h3>
        </div>
      )}
    </div>
  );
};

export default RoomWaitingRoom;
