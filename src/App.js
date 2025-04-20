import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Supabase 配置
const supabaseUrl = 'https://niufliollslbmirwkdom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdWZsaW9sbHNsYm1pcndrZG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTE1MzIsImV4cCI6MjA2MDYyNzUzMn0.gfVadPg08NnvhvUU_B8ZEhZ_x3peQvRncyrdQl-xlcA';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState(null);
  const [useTableLayout, setUseTableLayout] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // 獲取所有待辦事項
  const fetchTodos = async () => {
    try {
      console.log('正在獲取待辦事項...');
      const { data, error } = await supabase
        .from('todos')
        .select('*');
      if (error) throw error;
      console.log('待辦事項數據:', data);
      setTodos(data || []);
    } catch (error) {
      console.error('獲取待辦事項失敗:', error);
      setError(`無法載入待辦事項：${error.message}`);
      setTodos([]);
    }
  };

  // 新增待辦事項
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      console.log('正在新增待辦事項:', newTodo);
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text: newTodo, completed: false }])
        .select();
      if (error) throw error;
      console.log('新增成功:', data);
      setTodos([data[0], ...todos]);
      setNewTodo('');
      setError(null);
    } catch (error) {
      console.error('新增待辦事項失敗:', error);
      setError(`無法新增待辦事項：${error.message}`);
    }
  };

  // 更新待辦事項完成狀態
  const toggleTodo = async (id, completed) => {
    try {
      console.log('正在切換待辦事項狀態:', { id, completed });
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);
      if (error) throw error;
      setTodos(todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
      console.log('切換成功:', { id, newCompleted: !completed });
      setError(null);
    } catch (error) {
      console.error('更新待辦事項失敗:', error);
      setError(`無法更新待辦事項：${error.message}`);
    }
  };

  // 編輯待辦事項
  const updateTodo = async (id, newText) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ text: newText })
        .eq('id', id);
      if (error) throw error;
      setTodos(todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      ));
      setError(null);
    } catch (error) {
      console.error('編輯待辦事項失敗:', error);
      setError(`無法編輯待辦事項：${error.message}`);
    }
  };

  // 刪除待辦事項
  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (error) {
      console.error('刪除待辦事項失敗:', error);
      setError(`無法刪除待辦事項：${error.message}`);
    }
  };

  // 篩選待辦事項
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // 初始化時獲取待辦事項
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container">
      <h1 className="app-title">待辦事項</h1>

      {/* 錯誤訊息 */}
      {error && (
        <div className="error-message animate-fade-in">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="error-close"
          >
            ✕
          </button>
        </div>
      )}

      {/* 新增待辦事項表單 */}
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="輸入新的待辦事項"
          className="todo-input"
        />
        <button
          type="submit"
          className="add-button"
        >
          新增
        </button>
      </form>

      {/* 控制面板 */}
      <div className="control-panel">
        <div className="filter-buttons">
          <button 
            onClick={() => setFilter('all')}
            className={`control-button ${filter === 'all' ? 'control-button-active' : 'control-button-default'}`}
          >
            全部
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`control-button ${filter === 'active' ? 'control-button-active' : 'control-button-default'}`}
          >
            未完成
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`control-button ${filter === 'completed' ? 'control-button-active' : 'control-button-default'}`}
          >
            已完成
          </button>
        </div>
        <div className="layout-buttons">
          <span className="layout-label">佈局:</span>
          <button 
            onClick={() => setUseTableLayout(false)}
            className={`control-button ${!useTableLayout ? 'control-button-active' : 'control-button-default'}`}
          >
            卡片
          </button>
          <button 
            onClick={() => setUseTableLayout(true)}
            className={`control-button ${useTableLayout ? 'control-button-active' : 'control-button-default'}`}
          >
            表格
          </button>
        </div>
      </div>

      {/* 待辦事項列表 */}
      {useTableLayout ? (
        <div className="todo-table-container">
          <table className="todo-table">
            <thead>
              <tr className="table-header">
                <th>完成</th>
                <th>任務</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-message">
                    {filter === 'all' ? '暫無待辦事項' : 
                     filter === 'active' ? '暫無未完成事項' : 
                     '暫無已完成事項'}
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    isTableLayout={true}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards-container">
          {filteredTodos.length === 0 ? (
            <div className="empty-message">
              {filter === 'all' ? '暫無待辦事項' : 
               filter === 'active' ? '暫無未完成事項' : 
               '暫無已完成事項'}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
                isTableLayout={false}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// 單個待辦事項組件（支援卡片和表格排版）
function TodoItem({ todo, onToggle, onUpdate, onDelete, isTableLayout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  if (isTableLayout) {
    return (
      <tr className="table-row">
        <td className="table-cell">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id, todo.completed)}
            className="card-checkbox"
          />
        </td>
        <td className="table-cell">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="edit-input"
            />
          ) : (
            <span className={todo.completed ? 'completed-task' : 'card-text'}>
              {todo.text}
            </span>
          )}
        </td>
        <td className="table-cell">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="save-button"
              >
                儲存
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(todo.text);
                }}
                className="cancel-button"
              >
                取消
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                編輯
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="delete-button"
              >
                刪除
              </button>
            </>
          )}
        </td>
      </tr>
    );
  }

  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
        className="card-checkbox"
      />
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="edit-input"
          />
          <button
            onClick={handleUpdate}
            className="save-button"
          >
            儲存
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditText(todo.text);
            }}
            className="cancel-button"
          >
            取消
          </button>
        </div>
      ) : (
        <div className="card-content">
          <span className={todo.completed ? 'completed-task' : 'card-text'}>
            {todo.text}
          </span>
          <div className="card-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              編輯
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-button"
            >
              刪除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;