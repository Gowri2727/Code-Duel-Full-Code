// const analyzeComplexity = require('../utils/analyzeComplexity');

// exports.analyzeCodeComplexity = (req, res) => {
//   try {
//     const { code, language } = req.body;

//     if (!code || !language) {
//       return res.status(400).json({ error: 'Code and language are required.' });
//     }

//     const result = analyzeComplexity(code, language);
//     res.json(result);
//   } catch (err) {
//     console.error('Complexity analysis failed:', err.message);
//     res.status(500).json({ error: 'Complexity analysis failed.' });
//   }
// };
const analyzeComplexity = require('../utils/analyzeComplexity');

exports.analyzeComplexity = async (req, res) => {
  const { code, language } = req.body;
  try {
    const result = await analyzeComplexity(code, language);
    res.json(result);
  } catch (err) {
    console.error('Complexity error:', err);
    res.status(500).json({ error: 'Complexity analysis failed' });
  }
};
