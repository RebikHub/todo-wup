import React, { useContext } from 'react'
import { Context } from '../App';
import Todo from './Todo';

export default function ListTodo() {
  const context = useContext(Context);
  return (
    <ul>
      {context.todos.map((e, i) => (
        <li key={e.id}>
          <Todo item={e}/>
        </li>
      ))}
    </ul>
  );
};
