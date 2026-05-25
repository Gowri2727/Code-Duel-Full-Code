const analyzeCorrectness = require('../utils/analyzeCorrectness');
const analyzeComplexity = require('../utils/analyzeComplexity');

// 🔹 Run: Check sample output using AI
exports.runUserCode = async (req, res) => {
  const { code, language = 'python', input, expectedOutput } = req.body;

  if (!code || !input || !expectedOutput) {
    return res.status(400).json({ error: 'Missing required fields (code, input, expectedOutput)' });
  }

  try {
    const result = await analyzeCorrectness(code, input, expectedOutput);

    if (result?.passed) {
      return res.json({ passed: true, message: '✅ Sample output passed' });
    } else {
      return res.json({ passed: false, message: '❌ Sample output failed' });
    }
  } catch (err) {
    console.error('❌ AI validation error:', err.message);
    return res.status(500).json({ error: 'AI validation failed' });
  }
};

// 🔹 Submit: Optionally analyze complexity (shown only after passing run)
exports.submitCode = async (req, res) => {
  const { code, language = 'python', input, expectedOutput } = req.body;

  if (!code || !input || !expectedOutput) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const check = await analyzeCorrectness(code, input, expectedOutput);

    if (!check?.passed) {
      return res.status(200).json({
        passed: false,
        message: '❌ Code is incorrect. Sample output failed.'
      });
    }

    // ✅ Sample test passed → Analyze complexity
    const complexity = await analyzeComplexity(code, expectedOutput);

    return res.json({
      passed: true,
      complexity,
      message: '✅ Code passed. Complexity analyzed.'
    });
  } catch (err) {
    console.error('⚠️ Submit error:', err.message);
    return res.status(500).json({ error: 'Submission failed' });
  }
};
