function parseCSV(csvString) {
  return csvString.split('\n').map(line => line.split(','));
}

function convertToJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function mergeObjects(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

function extractKeys(obj) {
  return Object.keys(obj);
}

function extractValues(obj) {
  return Object.values(obj);
}

module.exports = { parseCSV, convertToJSON, parseJSON, mergeObjects, extractKeys, extractValues };
