function filterByProperty(arr, prop, value) {
  return arr.filter(item => item[prop] === value);
}

function filterByRange(arr, min, max) {
  return arr.filter(item => item >= min && item <= max);
}

function filterByCondition(arr, condition) {
  return arr.filter(condition);
}

function sortByProperty(arr, prop, order = 'asc') {
  return arr.sort((a, b) => {
    if (order === 'asc') {
      return a[prop] > b[prop] ? 1 : -1;
    }
    return a[prop] < b[prop] ? 1 : -1;
  });
}

function groupByProperty(arr, prop) {
  return arr.reduce((acc, item) => {
    const key = item[prop];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

module.exports = { filterByProperty, filterByRange, filterByCondition, sortByProperty, groupByProperty };
