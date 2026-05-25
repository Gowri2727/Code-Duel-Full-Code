
const axios = require('axios');
const crypto = require('crypto');
const Question = require('../models/Question');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

exports.generateAIQuestion = async (req, res) => {
  const { difficulty, questionType, language = 'python' } = req.body;
const prompt = `
You are a competitive coding platform like LeetCode or HackerRank.
Generate a unique ${difficulty} level ${questionType} question in ${language}.

🧠 Follow these rules strictly:
- Use a story-like description (at least 5 lines), no double quotes inside strings unless escaped.
- Input and output must be JSON-compatible.
- ❌ Do NOT include code like open("input.txt") or Python syntax like int, list(), etc.
- ❌ Do NOT include nested objects without keys inside arrays.
- 🎯 Output ONLY this JSON (no markdown or backticks):

{
  "title": "...",
  "description": "...",
  "input": "...",
  "output": "...",
  "hint": "..."
}
`;

  let question = null;
  let tries = 0;

  while (tries < 3) {
    try {
      const response = await axios.post(
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

      let raw = response.data.choices[0].message.content;

      // 🧼 Clean up malformed JSON
      raw = raw
        .replace(/```json|```/g, '')
        .replace(/\bNone\b/g, 'null')
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\/\/.*$/gm, '')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/[\x00-\x1F\x7F]/g, '')
        // .replace(/'([^']*)'/g, (_, val) => `"${val.replace(/"/g, '\\"')}"`)
        .replace(/:\s*"([^"]*?)"(?=\s*[,\}])/g, (_, val) => {
    const escaped = val.replace(/"/g, '\\"');
    return `: "${escaped}"`;
})
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .trim();
  // .replace(/\bint\b|\blist\b|\bopen\s*\([^)]*\)/g, '""');  // 🚫 Remove Python-only syntax

      // 🛡️ Extract valid JSON substring
      const jsonStart = raw.indexOf('{');
      const jsonEnd = raw.lastIndexOf('}') + 1;
      const rawJson = raw.substring(jsonStart, jsonEnd);

      // Escape inner quotes
      const safeJson = rawJson.replace(/:\s*"([^"]*?)"(?=\s*[,\}])/g, (_, val) => {
        const escaped = val.replace(/"/g, '\\"');
        return `: "${escaped}"`;
      });

      let parsed;
      try {
        parsed = JSON.parse(safeJson);
      } catch (err) {
        console.error('❌ JSON raw content:\n', safeJson);
        console.error('❌ JSON parse error:', err.message);
        return res.status(500).json({ error: 'Invalid JSON format from AI' });
      }

      // ✅ Validate only required fields
      if (
        !parsed.title ||
        !parsed.description ||
        !parsed.input ||
        !parsed.output ||
        !parsed.hint
      ) {
        console.error('❌ AIController error: Incomplete question fields');
        return res.status(500).json({ error: 'Incomplete question fields' });
      }

      // 🧠 Ensure no `hidden` key exists
      delete parsed.hidden;

      // 🔁 Check for duplicate
      const hash = crypto
        .createHash('md5')
        .update(parsed.title + parsed.description + JSON.stringify(parsed.input))
        .digest('hex');

      const exists = await Question.findOne({ hash });
      if (exists) {
        console.warn('⚠️ Duplicate question detected. Retrying...');
        tries++;
        continue;
      }

      // 💾 Save question
      await Question.create({ ...parsed, hash });
      req.session.failedAttempts = 0;
      question = parsed;
      break;
    } catch (err) {
      console.error('❌ AIController error:', err.message);
      return res.status(500).json({ error: 'Failed to generate question' });
    }
  }

  if (!question) {
    return res.status(500).json({ error: 'Unable to generate unique valid question.' });
  }

  res.json(question);
};
exports.getCodeComplexity = async (req, res) => {
  const { userCode, language = 'python' } = req.body;

  const complexityPrompt = `
You are an expert in algorithm analysis. Analyze the following ${language} code and return ONLY its time and space complexity using Big-O notation. Do NOT explain anything.

Code:
${userCode}

🎯 Return format in raw JSON:
{
  "time": "O(...)",
  "space": "O(...)"
}
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: complexityPrompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let raw = response.data.choices[0].message.content;

    raw = raw
      .replace(/```json|```/g, '')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .trim();

    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}') + 1;
    const rawJson = raw.substring(jsonStart, jsonEnd);

    const parsed = JSON.parse(rawJson);
    res.json(parsed);
  } catch (error) {
    console.error('❌ Complexity API error:', error.message);
    return res.status(500).json({ error: 'Failed to get complexity analysis' });
  }
};
