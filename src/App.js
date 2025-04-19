// src/App.js
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';  // 注意這裡改成命名導入

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // 讀取待辦事項
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data);
    }
  };

  // 新增待辦事項
  const addTodo = async () => {
    if (!input.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ text: input, isComplete: false }])
      .single();

    if (error) {
      console.error('Error adding todo:', error);
    } else {
      setTodos([data, ...todos]);
      setInput('');
    }
  };

  // 更新待辦事項的完成狀態
  const toggleTodo = async (id, isComplete) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ isComplete: !isComplete })
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error updating todo:', error);
    } else {
      setTodos(todos.map(todo => (todo.id === id ? data : todo)));
    }
  };

  // 刪除待辦事項
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // 使用 useEffect 初始化時讀取待辦事項
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>📝 我的待辦清單</h1>

      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="輸入任務..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 12px', marginLeft: '8px' }}>
          新增
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id, todo.isComplete)}
            style={{
              padding: '8px',
              marginBottom: '4px',
              cursor: 'pointer',
              textDecoration: todo.isComplete ? 'line-through' : 'none',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
            }}
          >
            {todo.text}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
              }}
              style={{
                marginLeft: '10px',
                padding: '5px 8px',
                backgroundColor: '#ff4747',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
