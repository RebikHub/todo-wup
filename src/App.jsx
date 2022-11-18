import { createContext, useState } from 'react';
import './App.css';
import CreateTodo from './components/CreateTodo';
import ListTodo from './components/ListTodo';

export const Context = createContext(null)

export default function App() {
  const [add, setAdd] = useState(true);
  const [todos, setTodos] = useState([])

  function addTodo(todo) {
    setTodos([...todos, todo])
  };

  function closeCreate() {
    setAdd(!add);
  };

  return (
    <Context.Provider value={{todos, addTodo}}>
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
            <CreateTodo closeCreate={closeCreate}/>}
        </main>
      </div>
    </Context.Provider>
  );
}
