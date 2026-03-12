const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/todos', todoRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
