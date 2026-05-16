function findMax(arr) {
  return Math.max(...arr);
}

function findMin(arr) {
  return Math.min(...arr);
}

function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}

function average(arr) {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

module.exports = { findMax, findMin, sum, average, removeDuplicates };
