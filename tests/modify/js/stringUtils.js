function reverseString(str) {
  return str.split('').reverse().join('');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function countWords(str) {
  return str.trim().split(/\s+/).length;
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/\s/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

module.exports = { reverseString, capitalize, countWords, isPalindrome };
