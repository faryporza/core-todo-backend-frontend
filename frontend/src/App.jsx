import { useState, useEffect } from 'react'

// Import ฟังก์ชันที่เราแยกไฟล์ไว้
import { getTodos, createTodo, updateTodoStatus, deleteTodo, updateTodo } from './services/todoApi'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  
  // เพิ่ม State สำหรับการแก้ไข
  const [editingId, setEditingId] = useState(null) // เก็บ ID ของรายการที่กำลังแก้ไข
  const [editValue, setEditValue] = useState('')   // เก็บข้อความใหม่ที่กำลังพิมพ์

  useEffect(() => {
    let ignore = false;
    // เรียกใช้ฟังก์ชันจากไฟล์ api
    getTodos().then(data => {
      if (!ignore) setTodos(data);
    }).catch(err => console.error(err));
    
    return () => { ignore = true }
  }, [])

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newTodo = { id: Date.now().toString(), title: inputValue, completed: false }
    try {
      // เรียกใช้ API createTodo ที่เราสร้างไว้
      const addedData = await createTodo(newTodo)
      setTodos([...todos, addedData])
      setInputValue('')
    } catch (error) { console.error(error) }
  }

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await updateTodoStatus(id, currentStatus)
      setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !currentStatus } : todo))
    } catch (error) { console.error(error) }
  }

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) { console.error(error) }
  }

  const handleEditClick = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  }

  const handleEditTodo = async (id, value) => {
    try {
      await updateTodo(id, { title: value })
      setTodos(todos.map(todo => todo.id === id ? { ...todo, title: value } : todo))
      setEditingId(null)
      setEditValue('')
    } catch (error) { console.error(error) }
  }

  // --- ส่วนของ UI ---
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-center text-slate-800 mb-6 tracking-tight">
          รายการสิ่งที่ต้องทำ (Todo List) 
        </h1>
        
        {/* ฟอร์มสำหรับเพิ่มข้อมูล */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="อะไรที่ต้องทำ?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // เวลากดพิมพ์ ให้เก็บค่าลง State
          />
          <button 
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Add
          </button>
        </form>
        
        {/* รายการ Todo */}
        <ul className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center text-slate-500 py-4">ไม่มีงานที่ต้องทำ</p>
          ) : (
            todos.map((todo) => (
              <li 
                key={todo.id} 
                className={`p-4 border rounded-xl flex gap-3 items-center transition-all ${
                  todo.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* กล่องติ๊กถูก */}
                <input 
                  type="checkbox" 
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
                
                {/* ข้อความ Todo และ ปุ่มแก้ไข */}
                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="แก้ไขข้อความ"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEditTodo(todo.id, editValue)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditTodo(todo.id, editValue)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditValue('');
                      }}
                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`flex-1 text-lg ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {todo.title}
                    </span>

                    {/* ปุ่มแก้ไข */}
                    <button
                      onClick={() => handleEditClick(todo)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    {/* ปุ่มลบ */}
                    <button 
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>

      </div>
    </div>
  )
}

export default App