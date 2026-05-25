module.exports = (code, language) => {
  const lowerCode = code.toLowerCase();

  // Count loop usage
  const loopKeywords = language === 'java'
    ? ['for', 'while', 'foreach']
    : ['for', 'while'];

  const loopCount = loopKeywords.reduce((count, keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    const matches = lowerCode.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  // Detect recursion
  const hasRecursion = (() => {
    const functionNames = [];
    const defRegex = language === 'java'
      ? /void\s+(\w+)\s*\(/g
      : /def\s+(\w+)\s*\(/g;
    let match;
    while ((match = defRegex.exec(lowerCode)) !== null) {
      functionNames.push(match[1]);
    }
    return functionNames.some(fn => lowerCode.includes(`${fn}(`));
  })();

  // Estimate complexity
  let time = 'O(1)';
  let space = 'O(1)';

  if (hasRecursion) {
    time = 'O(n)';
  } else if (loopCount >= 2) {
    time = 'O(n^2)';
  } else if (loopCount === 1) {
    time = 'O(n)';
  }

  // Estimate space complexity based on lists/arrays usage
  if (lowerCode.includes('[') || lowerCode.includes('list') || lowerCode.includes('array') || lowerCode.includes('new int')) {
    space = 'O(n)';
  }

  return { time, space };
};
