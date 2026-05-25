const axios = require('axios');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const analyzeCorrectness = async (code, input, expectedOutput) => {
  const prompt = `
You are an AI coding assistant. Given a Python function and a problem's sample input and expected output, decide whether the code is correct.

Return true if the code produces the correct output, else false.

Respond only in JSON like: { "passed": true }

Code:
${code}

Input:
${input}

Expected Output:
${expectedOutput}
`;

  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const raw = res.data.choices[0].message.content;
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}') + 1;
    const parsed = JSON.parse(raw.substring(jsonStart, jsonEnd));
    return parsed;
  } catch (err) {
    console.error('❌ AI validation error:', err.message);
    return { passed: false, error: err.message };
  }
};

module.exports = analyzeCorrectness;
