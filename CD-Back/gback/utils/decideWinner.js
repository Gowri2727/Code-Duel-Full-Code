const bigORank = {
  'O(1)': 1,
  'O(log n)': 2,
  'O(n)': 3,
  'O(n log n)': 4,
  'O(n^2)': 5,
  'O(n^3)': 6,
  'O(2^n)': 7,
  'O(n!)': 8,
  'N/A': 99
};

function decideWinner(userA, userB) {
  const rank = bigORank;

  const timeA = rank[userA.complexity.time] || 99;
  const timeB = rank[userB.complexity.time] || 99;

  if (timeA < timeB) return 'userA';
  if (timeA > timeB) return 'userB';

  const spaceA = rank[userA.complexity.space] || 99;
  const spaceB = rank[userB.complexity.space] || 99;

  if (spaceA < spaceB) return 'userA';
  if (spaceA > spaceB) return 'userB';

  const codeLenA = userA.code.length;
  const codeLenB = userB.code.length;

  if (codeLenA < codeLenB) return 'userA';
  if (codeLenA > codeLenB) return 'userB';

  const submitA = new Date(userA.submittedAt);
  const submitB = new Date(userB.submittedAt);

  if (submitA < submitB) return 'userA';
  if (submitA > submitB) return 'userB';

  return 'draw';
}

module.exports = decideWinner;
