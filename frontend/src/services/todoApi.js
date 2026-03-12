const API_URL = 'http://localhost:3000/todos';

export const getTodos = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createTodo = async (todoData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todoData)
  });
  return response.json();
};

export const updateTodoStatus = async (id, currentStatus) => {
  const response = await fetch(`${API_URL}/${id}/completed`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !currentStatus })
  });
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const updateTodo = async (id, updatedData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  return response.json();
};