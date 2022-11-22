import { getDatabase, onValue, ref, remove, set } from 'firebase/database';
import { deleteObject, getStorage } from 'firebase/storage';
import { createContext, useEffect, useState } from 'react';
import './App.scss';
import CreateTodo from './components/CreateTodo';
import ListTodo from './components/ListTodo';
import { app } from './firebase';

export const Context = createContext(null)

export default function App() {
  const [add, setAdd] = useState(true);
  const [todos, setTodos] = useState([]);
  const [item, setItem] = useState(null);

  function addTodo(todo) {
    console.log('add todo');
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

  function deleteTodo(item) {
    if (item.file) {
      removeFileStorage(item.id, item.file);
    };
    removeItemDb(item.id);
  };

  async function removeFileStorage(id, name) {
    const { ref } = require('firebase/storage');
    const storage = getStorage(app);
    const path = `todo-files/${id}/${name}`;
    const fileRef = ref(storage, path);
    deleteObject(fileRef);
  };

  async function removeItemDb(id) {
    const { ref } = require('firebase/database');
    const db = getDatabase(app);
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
  };

  useEffect(() => {
    const db = getDatabase(app);
    const valueDb = ref(db, 'todos/');
    onValue(valueDb, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = [];
        for (const [key, value] of Object.entries(data)) {
          arr.push(value);
        }
        setTodos([...arr])
      } else {
        setTodos([]);
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
