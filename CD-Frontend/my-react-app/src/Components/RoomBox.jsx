// import React, { useState } from 'react';
// import '../Styles/RoomBox.css';
// import { useAppContext } from '../App';
// const RoomBox = () => {
//   const [mode, setMode] = useState('default');
//   const [language, setLanguage] = useState('');
//   const [difficulty, setDifficulty] = useState('');
//   const [players, setPlayers] = useState(2);
//   const [roomCode, setRoomCode] = useState('');
//   const [generatedCode, setGeneratedCode] = useState('');
//   const [languagePreference, setLanguagePreference] = useState('same');
// const [questionType, setQuestionType] = useState('');
//     const {  setPage } = useAppContext();
// const handleBack = () => {
//     setPage('home');
//   };
//   const generateRoomCode = () => {
//     return Math.random().toString(36).substr(2, 6).toUpperCase();
//   };

//   const handleCreateRoom = () => {
//     if (!language || !difficulty || !players) {
//       alert('Please select all fields');
//       return;
//     }
//     const code = generateRoomCode();
//     setGeneratedCode(code);
//     alert(`Room Created!\nCode: ${code}\nLanguage: ${language}\nQuestion Type: ${questionType}\nDifficulty: ${difficulty}\nLanguage Match: ${languagePreference}`);
//     setPage('duel');
//   };

//   const handleJoinRoom = () => {
//     if (!roomCode.trim()) {
//       alert('Please enter a valid room code.');
//       return;
//     }
//     alert(`Joining room: ${roomCode}`);
//       setPage('duel');
//   };

//   return (
//     <div className="room-box-container">
//       <h3>Room Match</h3>
//       {mode === 'default' && (
//         <>
//           <button onClick={() => setMode('create')}>Create Room</button>
//           <button onClick={() => setMode('join')}>Join Room</button>
//         </>
//       )}

//       {mode === 'create' && (
//         <>
//           <label>Language:</label>
//           <select value={language} onChange={(e) => setLanguage(e.target.value)}>
//             <option value="">Select</option>
//             <option value="Java">Java</option>
//             <option value="Python">Python</option>
//           </select>
// <label>Question Type:</label>
// <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
//   <option value="">Select</option>
//   <option value="DSA">DSA Questions</option>
//   <option value="Normal">Normal Questions</option>
// </select>

//           <label>Difficulty:</label>
//           <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
//             <option value="">Select</option>
//             <option>Easy</option>
//             <option>Medium</option>
//             <option>Hard</option>
//           </select>

//           <label>Players:</label>
//           <select value={players} onChange={(e) => setPlayers(parseInt(e.target.value))}>
//             <option value={2}>2</option>
//             <option value={6}>6</option>
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//           </select>

//           <label>Language Match Preference:</label>
//           <select value={languagePreference} onChange={(e) => setLanguagePreference(e.target.value)}>
//             <option value="same">Same Language Only</option>
//             <option value="different">Different Language</option>
//             <option value="both">Both</option>
//           </select>

//           <button onClick={handleCreateRoom}>Generate Room Code</button>

//           {generatedCode && (
//             <div className="room-code">
//               <p>Share this Room Code:</p>
//               <strong>{generatedCode}</strong>
//               <button onClick={() => navigator.clipboard.writeText(generatedCode)}>Copy</button>
//             </div>
//           )}
//         </>
//       )}

//       {mode === 'join' && (
//         <>
//           <label>Enter Room Code:</label>
//           <input
//             type="text"
//             placeholder="e.g., 3JH2KD"
//             value={roomCode}
//             onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
//           />
//           <button onClick={handleJoinRoom}>Join</button>
//         </>
//       )}
//             <button onClick={handleBack} className="back-btn">Back to Home</button>

//     </div>
//   );
// };

// export default RoomBox;


import React, { useState } from 'react';
import '../Styles/RoomBox.css';
import { useAppContext } from '../App';
import axios from 'axios';

const RoomBox = () => {
  const [mode, setMode] = useState('default');
  const [difficulty, setDifficulty] = useState('');
  const [players, setPlayers] = useState(2);
  const [roomCode, setRoomCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [questionType, setQuestionType] = useState('');
  const { currentUser, setPage, setDuelSettings } = useAppContext();

  const handleBack = () => setPage('home');

  const generateRoomCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();

  const handleCreateRoom = async () => {
    if (!difficulty || !players || !questionType) {
      alert('Please select all fields');
      return;
    }

    const code = generateRoomCode();

    try {
      const res = await axios.post('http://localhost:5002/api/room/create', {
        roomCode: code,
        user: { name: currentUser.fullName, email: currentUser.email },
        settings: {
          difficulty,
          questionType,
          language: 'Python',
          players,
          timeLimit: 60
        }
      });

      console.log("✅ Backend response:", res.data);

      const finalCode = res.data.roomCode || code;
      setGeneratedCode(finalCode);

      setDuelSettings({
        roomCode: finalCode,
        difficulty,
        questionType,
        language: 'Python',
        players,
        isAdmin: true,
        timeLimit: 60,
        mode: 'room'
      });

      alert(`Room Created!\nRoom Code: ${finalCode}`);
      setPage('waiting-room');
    } catch (err) {
      console.error(err);
      alert('Error creating room');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      alert('Please enter a valid room code.');
      return;
    }

    try {
      await axios.post('http://localhost:5002/api/room/join', {
        roomCode,
        user: { name: currentUser.fullName, email: currentUser.email }
      });

      setDuelSettings({
        roomCode,
        isAdmin: false,
        mode: 'room',
        language: 'Python'
      });

      setPage('waiting-room');
    } catch (err) {
      console.error(err);
      alert('Error joining room. Make sure the code is valid.');
    }
  };

  return (
    <div className="room-box-container">
      <h3>Room Match</h3>
      {mode === 'default' && (
        <>
          <button onClick={() => setMode('create')}>Create Room</button>
          <button onClick={() => setMode('join')}>Join Room</button>
        </>
      )}

      {mode === 'create' && (
        <>
          <label>Question Type:</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
            <option value="">Select</option>
            <option value="DSA">DSA Questions</option>
            <option value="Normal">Normal Questions</option>
          </select>

          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Select</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <label>Players:</label>
          <select value={players} onChange={(e) => setPlayers(parseInt(e.target.value))}>
            <option value={2}>2</option>
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>

          <button onClick={handleCreateRoom}>Generate Room Code</button>

          {generatedCode && (
            <div className="room-code">
              <p>Share this Room Code:</p>
              <strong>{generatedCode}</strong>
              <button onClick={() => navigator.clipboard.writeText(generatedCode)}>Copy</button>
            </div>
          )}
        </>
      )}

      {mode === 'join' && (
        <>
          <label>Enter Room Code:</label>
          <input
            type="text"
            placeholder="e.g., 3JH2KD"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <button onClick={handleJoinRoom}>Join</button>
        </>
      )}

      <button onClick={handleBack} className="back-btn">Back to Home</button>
    </div>
  );
};

export default RoomBox;
