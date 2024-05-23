const FuzzySet = require('fuzzyset');

// Function to check similarity
const checkSimilarity = (data1, data2) => {
  const keys = Object.keys(data1);
  let score = 0;
  keys.forEach((key) => {
    if (typeof data1[key] === 'string' && typeof data2[key] === 'string') {
      const fuzzy = FuzzySet([data1[key]]);
      const match = fuzzy.get(data2[key]);
      if (match && match[0][0] >= 0.6) {
        score += 1;
      }
    }
  });
  return score / keys.length >= 0.3;
};

module.exports = checkSimilarity;
