import { getDatabase, ref, update } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../App';
import { app } from '../firebase';

export default function Todo({item}) {
  const [desc, setDesc] = useState(false);
  const [done, setDone] = useState(item.done);
  const context = useContext(Context);

  function doneTodo() {
    const db = getDatabase(app);
    const updates = {};
    updates['todos/' + item.id + '/done'] = !done;   
    update(ref(db), updates);
    setDone(!done);
  };

  useEffect(() => {
    const nowDate = new Date().getTime();
    const targetDate = new Date(item.date).getTime();
    if (nowDate > targetDate) {
      doneTodo();
    }
  }, [item.date]);

  return (
    <div className={item.done ? 'Todo-done' : 'Todo'}>
      <div className={item.done ? 'Todo-img-done' : 'Todo-img'} onClick={doneTodo}/>
      <div className='Todo-body'>
        <div className='Todo-item'>
          <h5 onClick={() => setDesc(!desc)}>{item.title}</h5>
          <p className={desc ? 'Todo-description' : 'none'}>{item.description}</p>
        <a href={item.fileRef} download={item.file} target='_blank' rel="noreferrer">{item.file}</a>
        </div>
        <span>Deadline: {item.date}</span>
      </div>
      <div className='Todo-buttons'>
        <button onClick={() => context.editTodo(item)} disabled={done}>Edit</button>
        <button onClick={() => context.deleteTodo(item)}>Delete</button>
      </div>
    </div>
  )
}
