
import React, { useState } from 'react';
import '../Styles/Box.css';
import { useAppContext } from '../App';

const SoloBox = () => {
  const [difficulty, setDifficulty] = useState('');
  const [ready, setReady] = useState(false);
  const [questionType, setQuestionType] = useState('');
  const { setPage, setDuelSettings, currentUser } = useAppContext();

  const handleBack = () => {
    setPage('home');
  };

  const handleDifficultyChange = (e) => {
    const selected = e.target.value;
    setDifficulty(selected);
    // Check if both difficulty and questionType are selected
    setReady(!!selected && !!questionType);
  };

  const handleQuestionTypeChange = (e) => {
    const selected = e.target.value;
    setQuestionType(selected);
    // Check if both difficulty and questionType are selected
    setReady(!!selected && !!difficulty);
  };

  const handleStart = () => {
    if (!difficulty || !questionType) {
      alert('Please select both Question Type and Difficulty');
      return;
    }
    
    // Store the settings in context before navigating to duel
    setDuelSettings({
      difficulty: difficulty,
      questionType: questionType,
      mode: 'solo',
      language: currentUser?.language || 'Python',
      languagePreference: 'same'
    });
    
    alert(`Starting with:\nDifficulty: ${difficulty}\nLanguage: ${currentUser?.language}\nQuestion Type: ${questionType}`);
    setPage('duel');
  };

  return (
    <div className="box" style={{ margin: '40px auto', maxWidth: '400px' }}>
      <h3>Solo Challenge</h3>
      <label>Question Type:</label>
      <select value={questionType} onChange={handleQuestionTypeChange}>
        <option value="">Select</option>
        <option value="DSA">DSA Questions</option>
        <option value="Normal">Normal Questions</option>
      </select>

      <label>Select Difficulty:</label>
      <select value={difficulty} onChange={handleDifficultyChange}>
        <option value="">Select</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <p>This mode lets you practice alone. Solve a problem under time pressure.</p>

      {ready && (
        <button onClick={handleStart}>Start Now</button>
      )}
      <button onClick={handleBack} className="back-btn">Back to Home</button>
    </div>
  );
};

export default SoloBox;