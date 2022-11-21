import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import React, { useContext, useRef, useState } from 'react';
import { Context } from '../App';
import { db, storage } from '../firebase';

export default function CreateTodo({closeCreate}) {
  const context = useContext(Context);
  const fileInput = useRef();
  const [todo, setTodo] = useState({
    id: nanoid(),
    title: '',
    description: '',
    date: '',
    file: null,
    fileRef: null
  });

  async function saveTodo() {
    const storage = getStorage();
    const path = `todos/${todo.id}/${fileInput.current.files[0].name}`;
    const fileRef = ref(storage, path)
    uploadBytes(fileRef, fileInput.current.files[0]).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
      getDownloadURL(ref(storage, path))
      .then((url) => {
        console.log(url)
        context.addTodo({
          ...todo,
          file: fileInput.current.files[0].name,
          fileRef: url
        });
        closeCreate();
      });
    });


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
