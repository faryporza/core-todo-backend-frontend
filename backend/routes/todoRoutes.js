const express = require('express');
const router = express.Router();
const { readTodos, writeTodos } = require('../utils/fileUtils');

// GET: ดึงข้อมูล todo ทั้งหมด
router.get('/', (req, res) => {
  try {
    const todos = readTodos();
    res.json(todos); 
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: ดึงข้อมูล todo ตาม id
router.get('/:id', (req, res) => {
  try {
    const todos = readTodos();
    const todo = todos.find(t => String(t.id) === req.params.id); 
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: เพิ่ม todo ใหม่
router.post('/', (req, res) => {
  try {
    const todos = readTodos();
    const newTodo = req.body;

    if (!newTodo.id || !newTodo.title) {
      return res.status(400).json({ error: 'Missing required fields: id and title' });
    }

    if (todos.some(t => t.id === newTodo.id)) {
      return res.status(400).json({ error: 'Todo with this id already exists' });
    }

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: ลบ todo ตาม id
router.delete('/:id', (req, res) => {
  try {
    const todos = readTodos();
    const id = req.params.id;

    const index = todos.findIndex(t => String(t.id) === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const deletedTodo = todos.splice(index, 1)[0];
    writeTodos(todos);

    res.json(deletedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT: อัพเดตข้อมูล todo ตาม id
router.put('/:id', (req, res) => {
  try {
    const todos = readTodos();
    const id = req.params.id;
    const updatedData = req.body;

    const index = todos.findIndex(t => String(t.id) === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos[index] = { ...todos[index], ...updatedData };
    writeTodos(todos);

    res.json(todos[index]);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT: อัพเดตสถานะ completed ของ todo ตาม id
router.put('/:id/completed', (req, res) => {
  try {
    const todos = readTodos();
    const id = req.params.id;
    const { completed } = req.body;

    const index = todos.findIndex(t => String(t.id) === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos[index].completed = completed;
    writeTodos(todos);

    res.json(todos[index]);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
