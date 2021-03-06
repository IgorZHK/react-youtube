import React, { useState, useEffect, lazy, Suspense } from 'react';

import Context from './context';
import TodoList from './Todo/TodoList';
import Loader from './loader';
import Modal from './Modal/Modal';

const AddTodo = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(import('./Todo/AddTodo'));
      }, 3000);
    })
);

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https:/jsonplaceholder.typicode.com/todos?_limit=5')
      .then((res) => res.json())
      .then((todos) => {
        setTimeout(() => {
          setTodos(todos);
          setLoading(false);
        }, 2000);
      });
  }, []);

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function addTodo(title) {
    setTodos(todos.concat([{ title, id: Date.now(), completed: false }]));
  }

  return (
    <Context.Provider value={{ removeTodo }}>
      <div className='wrapper'>
        <h1>React tutorial</h1>

        <Modal />

        <Suspense fallback={<p>...loading</p>}>
          <AddTodo onCreate={addTodo} />
        </Suspense>

        {loading && <Loader />}

        {todos.length ? (
          <TodoList todos={todos} onToggle={toggleTodo} />
        ) : loading ? null : (
          <p>No todos</p>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
