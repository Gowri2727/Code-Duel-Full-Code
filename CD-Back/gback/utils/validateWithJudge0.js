
const axios = require('axios');
const validateCodeAgainstTestCases = require('./validateCodeAgainstTestCases');
require('dotenv').config();

const validateWithJudge0 = async (question, language) => {
  const languageId = language?.toLowerCase() === 'java' ? 62 : 71; // Java: 62, Python: 71
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const source_code = `# Solution template\nprint('test')`; // You can replace this with actual user-submitted code

  const stdin = typeof question.hidden === 'object'
    ? JSON.stringify(question.hidden)
    : String(question.hidden);

  try {
    const res = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        source_code,
        language_id: languageId,
        stdin
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      }
    );

    const token = res.data.token;

    let result = null;
    let retries = 0;

    while (retries < 10) {
      const poll = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      if (poll.data.status.id >= 3) {
        result = poll.data;
        break;
      }

      await new Promise((r) => setTimeout(r, 1000));
      retries++;
    }

    if (!result || !result.stdout) {
      return { success: false, message: 'No output from Judge0' };
    }

    return { success: true };

  } catch (err) {
    const code = err.response?.status;

    if (code === 401 || code === 429) {
      console.warn(`⚠️ Judge0 failed (${code}), falling back to local validation...`);
      try {
        const testCases = [
          {
            input: question.hidden,
            expected: question.output
          }
        ];

        const localResult = await validateCodeAgainstTestCases(
          source_code,
          language,
          testCases
        );

        if (!localResult.success) {
          return {
            success: false,
            message: localResult.error || 'Local validation failed'
          };
        }

        const allPassed = localResult.results.every((tc) => tc.passed);
        return {
          success: allPassed,
          message: allPassed ? 'All test cases passed locally' : 'Some test cases failed',
          details: localResult.results
        };
      } catch (localErr) {
        return {
          success: false,
          message: `Local fallback error: ${localErr.message}`
        };
      }
    }

    return {
      success: false,
      message: err.message
    };
  }
};

module.exports = validateWithJudge0;
