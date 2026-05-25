import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/ResultScreen.css';
import { useAppContext } from '../App';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ResultScreen = ({ myData, opponentData }) => {
  const { currentUser } = useAppContext();
  const [winner, setWinner] = useState('');
  const [showEnemyCode, setShowEnemyCode] = useState(false);

  useEffect(() => {
    const decide = async () => {
      try {
        const res = await axios.post('http://localhost:5002/api/match/decide-winner', {
          userA: myData,
          userB: opponentData
        });
        setWinner(res.data.winner);
      } catch (err) {
        console.error('Error determining winner:', err);
        setWinner('error');
      }
    };
    decide();
  }, []);

  return (
    <div className="result-screen">
      <h2>🏁 Match Result</h2>

      {winner === 'draw' && <h3>🤝 It's a Draw!</h3>}
      {winner === 'userA' && <h3>🏆 You Won!</h3>}
      {winner === 'userB' && <h3>😓 You Lost!</h3>}

      <div className="complexity-comparison">
        <h4>⚙️ Time & Space Complexity</h4>
        <div className="comparison-table">
          <div><strong>You</strong></div>
          <div><strong>Opponent</strong></div>
          <div>Time: {myData.complexity.time}</div>
          <div>Time: {opponentData.complexity.time}</div>
          <div>Space: {myData.complexity.space}</div>
          <div>Space: {opponentData.complexity.space}</div>
        </div>
      </div>

      <div className="code-view">
        <h4>📜 Your Code</h4>
        <SyntaxHighlighter language="python" style={oneDark}>
          {myData.code}
        </SyntaxHighlighter>
      </div>

      <button className="view-opponent-btn" onClick={() => setShowEnemyCode(!showEnemyCode)}>
        {showEnemyCode ? 'Hide Opponent Code' : "👀 View Opponent's Code"}
      </button>

      {showEnemyCode && (
        <div className="code-view">
          <h4>🧠 Opponent's Code</h4>
          <div
            className="no-copy"
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
          >
            <SyntaxHighlighter language="python" style={oneDark}>
              {opponentData.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
