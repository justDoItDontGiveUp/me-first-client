import { useState } from 'react';
import '../../css/Todos.css';
import { useParams } from "react-router-dom";

export function Todo({ todo, onUpdate, onEdit }) {
  const { username } = useParams();

  const toggleComplete = async () => {

    try {
      const res = await fetch(`http://localhost:3333/${username}/todos/${todo.todo_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("Failed to toggle complete");
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3333/${username}/todos/${todo.todo_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete");
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="todo-item">
      <h4>{todo.title}</h4>
      <p>{todo.description}</p>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
        />
        הושלם
      </label>
      <p>{new Date(todo.sent_time).toLocaleString()}</p>
      <button onClick={onEdit}>ערוך</button>
      <button onClick={handleDelete}>מחק</button>
    </div>
  );
}
