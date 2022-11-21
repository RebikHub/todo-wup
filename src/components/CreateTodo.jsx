import { getDatabase, update } from 'firebase/database';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { nanoid } from 'nanoid';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../App';
import { app } from '../firebase';

export default function CreateTodo({closeCreate, item = null}) {
  const context = useContext(Context);
  const fileInput = useRef();
  const [todo, setTodo] = useState({
    id: nanoid(),
    title: '',
    description: '',
    date: '',
    file: '',
    fileRef: '',
    done: false
  });
  const [load, setLoad] = useState(0);

  useEffect(() => {
    if (item) {
      setTodo(item);
    };
  }, [item]);

  function inputFile() {
    const storage = getStorage(app);
    const fileName = fileInput.current.files[0].name;
    const path = `todos/${todo.id}/${fileName}`;
    const fileRef = ref(storage, path)
    uploadBytesResumable(fileRef, fileInput.current.files[0])
      .on('state_changed', 
        (snapshot) => {
          setLoad((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        }, 
        (error) => {
          console.log(error);
        }, 
        () => {
          getDownloadURL(ref(storage, path))
            .then((url) => {
              setLoad(0);
              setTodo({
                ...todo,
                file: fileName,
                fileRef: url
              });
            });
        }
      );
  }

  function saveTodo() {
    if (item) {
      const {ref} = require('firebase/database');
      const db = getDatabase(app);
      const updates = {};
      updates['todos/' + item.id] = todo;   
      update(ref(db), updates);
    } else {
      context.addTodo(todo);
    };
    closeCreate();
  };

  if (load > 0) {
    return (
      <>
        <label htmlFor="file">Upload progress: </label>
        <progress id="file" max="100" value={load}/>
      </>
    )
  }

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
      {item ? null : <input type="file" placeholder='Add file' onChange={inputFile} ref={fileInput}/>}
      <button type='button'
        onClick={saveTodo}
      >Save todo</button>
    </div>
  )
}
