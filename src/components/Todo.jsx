import React, { useState } from 'react'

export default function Todo({item}) {
  const [desc, setDesc] = useState(false);
  const [done, setDone] = useState(false);

  console.log(item);

  return (
    <div className={done ? 'Todo-done' : 'Todo'}>
      <div className={done ? 'Todo-img-done' : 'Todo-img'} onClick={() => setDone(!done)}/>
      <div className='Todo-body'>
        <h6 onClick={() => setDesc(!desc)}>{item.title}</h6>
        <p className={desc ? 'Todo-description' : 'none'}>{item.description}</p>
        <a href={item.fileRef} download={item.file} target='_blank' rel="noreferrer">{item.file}</a>
      </div>
      <div className='Todo-buttons'>
        <button disabled={done}>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  )
}
