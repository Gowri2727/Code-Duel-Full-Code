import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { useAppContext } from '../App';
import '../Styles/DuelRoom.css';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-python';

const DuelRoom = () => {
  const { currentUser, duelSettings, setPage } = useAppContext();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHiddenInputs, setShowHiddenInputs] = useState(false);
  const [failedSubmitCount, setFailedSubmitCount] = useState(0);

  const language = 'python'; 

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const { difficulty, questionType } = duelSettings;
        const res = await axios.post('http://localhost:5002/api/ai/question', {
          difficulty,
          questionType,
          language
        });
        setQuestion(res.data);
      } catch (err) {
        console.error('Error fetching question:', err);
        alert('❌ Failed to load question');
      }
    };
    fetchQuestion();
  }, [duelSettings]);
const fetchComplexity = async (userCode) => {
  try {
    const res = await axios.post('http://localhost:5002/api/ai/complexity', {
      userCode,
      language
    });
    setComplexity(res.data);
  } catch (err) {
    console.error('Error fetching complexity:', err.message);
    setComplexity({ time: 'N/A', space: 'N/A' });
  }
};

  const formatDisplay = (val) => {
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val).trim();
  };

  const runCode = async () => {
    setLoading(true);
    setErrorMsg('');
    setOutput('');
    setTestResults([]);
    setComplexity(null);
    setShowHiddenInputs(false);

    try {
      const res = await axios.post('http://localhost:5002/api/code/run', {
        code,
        language,
        input: question.input,
        expectedOutput: question.output
      });

      const { passed, output } = res.data;
      setOutput(passed ? '✅ Sample output passed' : '❌ Sample output failed');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };
const submitCode = async () => {
  setErrorMsg('');
  setOutput('');
  setTestResults([]);
  setComplexity(null);
  try {
    const res = await axios.post('http://localhost:5002/api/code/submit', {
      code,
      language,
      input: question.input,
      expectedOutput: question.output
    });

    if (res.data.passed) {
      setOutput('✅ Code passed sample test');
      await fetchComplexity(code);  // 🔥 Use AI-based complexity
    } else {
      setOutput(res.data.message || '❌ Code did not pass');
    }
  } catch (err) {
    console.error("Submit error:", err.message);
    setErrorMsg("Submit failed: " + (err.response?.data?.error || err.message));
  }
};
  if (!question) return <div className="duel-room"><h2>Loading Question...</h2></div>;

  return (
    <div className="duel-room">
      <h2>💻 Code Duel</h2>
      <div><strong>Mode:</strong> {duelSettings.mode} | <strong>Difficulty:</strong> {duelSettings.difficulty} | <strong>Type:</strong> {duelSettings.questionType}</div>

      <div className="duel-container">
        <div className="question-panel" onCopy={(e) => e.preventDefault()}
  onPaste={(e) => e.preventDefault()}
  onCut={(e) => e.preventDefault()}>
          <h3>{question.title}</h3>
          <p>{question.description}</p>
          <p><strong>Sample Input:</strong></p>
          <pre>{formatDisplay(question.input)}</pre>
          <p><strong>Expected Output:</strong></p>
          <pre>{formatDisplay(question.output)}</pre>
          {question.hint && <p><strong>💡 Hint:</strong> {question.hint}</p>}
          {failedSubmitCount >= 2 && (
            <>
              <h4>🔒 Hidden Test Inputs:</h4>
              <pre>{formatDisplay(question.hidden.map(t => t.input))}</pre>
            </>
          )}
        </div>

        <div className="code-panel">
          <AceEditor
  mode="python"
  theme="monokai"
  onChange={setCode}
  value={code}
  width="100%"
  height="300px"
  fontSize={16}
  onCopy={(e) => e.preventDefault()}   // 🚫 disable copy
  onPaste={(e) => e.preventDefault()}  // 🚫 disable paste
/>

          <div className="button-group">
            <button onClick={runCode} disabled={loading}>{loading ? 'Running...' : 'Run Code'}</button>
            <button onClick={submitCode} disabled={loading} style={{ marginLeft: '10px' }}>Submit Code</button>
            <button onClick={() => setPage('home')} style={{ marginLeft: '10px' }}>Back</button>
          </div>

          {output && (
            <div className="output-section">
              <h4>🟢 Output:</h4>
              <pre>{output}</pre>
            </div>
          )}

          {errorMsg && (
            <div className="error-section">
              <h4>❌ Error:</h4>
              <pre>{errorMsg}</pre>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="test-case-section">
              <h4>🧪 Hidden Test Case Results:</h4>
              {testResults.map((t, i) => (
                <div key={i} style={{ color: t.passed ? 'green' : 'red' }}>
                  Test {i + 1}: {t.passed ? '✅ Passed' : '❌ Failed'}
                </div>
              ))}
            </div>
          )}

          {complexity && (
            <div className="complexity-section">
              <h4>⚙️ Time & Space Complexity:</h4>
              <p><strong>Time:</strong> {complexity.time}</p>
              <p><strong>Space:</strong> {complexity.space}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuelRoom;