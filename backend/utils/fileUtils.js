const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const readTodos = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeTodos = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
  readTodos,
  writeTodos
};
