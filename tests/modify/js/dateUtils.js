function getCurrentDate() {
  return new Date();
}

function formatDate(date, format = 'YYYY-MM-DD') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

function daysUntil(targetDate) {
  const today = new Date();
  const timeDiff = new Date(targetDate) - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

module.exports = { getCurrentDate, formatDate, daysUntil, addDays, isLeapYear };
