import { getDatabase, onValue, ref, remove, set } from 'firebase/database';
import { createContext, useEffect, useState } from 'react';
import './App.css';
import CreateTodo from './components/CreateTodo';
import ListTodo from './components/ListTodo';
import { app } from './firebase';

export const Context = createContext(null)

export default function App() {
  const [add, setAdd] = useState(true);
  const [todos, setTodos] = useState([]);
  const [item, setItem] = useState(null);

  function addTodo(todo) {
    setTodos([...todos, todo]);
    writeTodoToDB(todo);
  };

  function closeCreate() {
    setAdd(!add);
  };

  function editTodo(todo) {
    setAdd(false);
    setItem(todo);
  };

  function deleteTodo(id) {
    const db = getDatabase();
    const todoRef = ref(db, 'todos/' + id);
    remove(todoRef);
  };

  function writeTodoToDB(todo) {
    const db = getDatabase(app);
    set(ref(db, 'todos/' + todo.id), {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      date: todo.date,
      file: todo.file,
      fileRef: todo.fileRef,
      done: todo.done
    });
  }

  useEffect(() => {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'todos/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const arr = [];
        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(data)) {
          arr.push(value);
        }
        setTodos([...arr])
      }
    });
  }, []);

  return (
    <Context.Provider value={{todos, addTodo, editTodo, deleteTodo}}>
      <div className="App">
        <header className="App-header">
          Todo-WUP
          <button className='App-button' type='button' 
            onClick={() => setAdd(!add)}>Create</button>
        </header>
        <main>
          {add ?
            <ListTodo/>
          :
            <CreateTodo closeCreate={closeCreate} item={item}/>}
        </main>
      </div>
    </Context.Provider>
  );
}
