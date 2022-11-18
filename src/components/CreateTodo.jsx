import React, { useContext, useRef, useState } from 'react';
import { Context } from '../App';

export default function CreateTodo({closeCreate}) {
  const context = useContext(Context);
  const fileInput = useRef();
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    date: '',
    file: null
  });

  function saveTodo() {
    context.addTodo(todo);
    setTodo({
      title: '',
      description: '',
      date: '',
      file: fileInput.current.files[0]
    });
    closeCreate();
    console.log(fileInput.current.files[0]);
  };

  return (
    <div className='Create-todo'>
      <h5>Create To Do</h5>
      <input type="text" placeholder='Title todo'
        value={todo.title}
        onChange={(e) => setTodo({...todo, title: e.target.value})}
      />
      <textarea type="text" placeholder='Description todo'
        value={todo.description}
        onChange={(e) => setTodo({...todo, description: e.target.value})}
      />
      <input className='Create-date' type="date" placeholder='Date end todo'
        value={todo.date}
        onChange={(e) => setTodo({...todo, date: e.target.value})}
      />
      <input type="file" placeholder='Add file' ref={fileInput}/>
      <button type='button'
        onClick={saveTodo}
      >Save todo</button>
    </div>
  )
}
