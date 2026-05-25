// import React, { useState } from 'react';
// import axios from 'axios';
// import '../Styles/Box.css';
// import { useAppContext } from '../App';

// const RandomBox = () => {
//   const [difficulty, setDifficulty] = useState('');
//   const [questionType, setQuestionType] = useState('');
//   const [ready, setReady] = useState(false);
//   const { setPage, setDuelSettings } = useAppContext();
// const [isMatching, setIsMatching] = useState(false);
//   const handleBack = () => setPage('home');

//   const checkReady = (type, diff) => {
//     if (type && diff) setReady(true);
//   };

//   const handleDifficultyChange = (e) => {
//     setDifficulty(e.target.value);
//     checkReady(questionType, e.target.value);
//   };

//   const handleQuestionTypeChange = (e) => {
//     setQuestionType(e.target.value);
//     checkReady(e.target.value, difficulty);
//   };
// const handleFindOpponent = async () => {
//   setIsMatching(true);

//   try {
//     const res = await axios.post('http://localhost:5002/api/matchmaking/find-opponent', {
//       difficulty,
//       questionType
//     });

//     if (res.data.matchFound) {
//       alert('🎯 Opponent found! Your match is starting...');
//       setDuelSettings({
//         difficulty,
//         questionType,
//         language: 'python',
//         mode: 'random',
//         roomId: res.data.roomId
//       });
//       setPage('duel');
//     } else {
//       alert('⚠️ No opponent found. Please try again later.');
//     }
//   } catch (err) {
//     console.error('Matchmaking error:', err.message);
//     alert('❌ Error finding opponent');
//   } finally {
//     setIsMatching(false);
//   }
// };

//   return (
//     <div className="box" style={{ margin: '40px auto', maxWidth: '400px' }}>
//       <h3>Random Match</h3>

//       <label>Question Type:</label>
//       <select value={questionType} onChange={handleQuestionTypeChange}>
//         <option value="">Select</option>
//         <option value="DSA">DSA Questions</option>
//         <option value="Normal">Normal Questions</option>
//       </select>

//       <label>Select Difficulty:</label>
//       <select value={difficulty} onChange={handleDifficultyChange}>
//         <option value="">Select</option>
//         <option value="Easy">Easy</option>
//         <option value="Medium">Medium</option>
//         <option value="Hard">Hard</option>
//       </select>

//      {isMatching && (
//   <div className="match-overlay">
//     <div className="match-box">
//       <div className="match-loader">🧠</div>
//       <p className="match-text">Looking for a worthy challenger...</p>
//     </div>
//   </div>
// )}
// {ready && (
//   <button
//     onClick={handleFindOpponent}
//     style={{ marginTop: '20px' }}
//     disabled={isMatching}
//   >
//     🎮 Start Match
//   </button>
// )}

// {isMatching && (
//   <div className="match-overlay">
//     <div className="match-box">
//       <div className="match-loader">🧠</div>
//       <p className="match-text">Looking for a worthy challenger...</p>
//     </div>
//   </div>
// )}
//       <button onClick={handleBack} className="back-btn" style={{ marginTop: '10px' }}>
//         Back to Home
//       </button>
//     </div>
//   );
// };

// export default RandomBox;
import React from 'react';
import { useAppContext } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/ModeBox.css';

const RandomBox = () => {
  const { duelSettings, setDuelSettings } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDuelSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleStart = async () => {
    try {
      const response = await axios.post('http://localhost:5002/api/matchmaking/find-opponent', {
        difficulty: duelSettings.difficulty,
        questionType: duelSettings.questionType
        // language: 'python' // optional if you later re-enable multi-language
      });

      if (response.data.matchFound) {
        navigate(`/duel/${response.data.roomId}`);
      } else {
        alert("⏳ Waiting for opponent to join...");
      }
    } catch (err) {
      console.error('❌ Matchmaking error:', err.message);
      alert('Failed to start match.');
    }
  };

  return (
    <div className="mode-box">
      <h2>🤝 Random Match</h2>

      <div className="form-group">
        <label>Select Difficulty:</label>
        <select name="difficulty" value={duelSettings.difficulty} onChange={handleChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select Question Type:</label>
        <select name="questionType" value={duelSettings.questionType} onChange={handleChange}>
          <option value="Normal">Normal</option>
          <option value="DSA">DSA</option>
          <option value="AI">AI</option>
        </select>
      </div>

      <button onClick={handleStart} className="start-btn">Start</button>
    </div>
  );
};

export default RandomBox;
