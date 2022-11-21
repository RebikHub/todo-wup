import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../App';

export default function Todo({item}) {
  const [desc, setDesc] = useState(false);
  const [done, setDone] = useState(false);
  const context = useContext(Context);

  useEffect(() => {
    const nowDate = new Date().getTime();
    const targetDate = new Date(item.date).getTime();
    if (nowDate > targetDate) {
      setDone(true);
    }
  }, [item.date]);

  return (
    <div className={done ? 'Todo-done' : 'Todo'}>
      <div className={done ? 'Todo-img-done' : 'Todo-img'} onClick={() => setDone(!done)}/>
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
        <button>Delete</button>
      </div>
    </div>
  )
}
