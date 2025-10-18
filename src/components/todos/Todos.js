import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Todo } from "./Todo";
import { AddOrEditTodoForm } from "./AddOrEditTodoForm";
import { Modal } from "../Modal";
import '../../css/Todos.css';
import { PlusCircle } from "lucide-react";
export function Todos() {
  const { username } = useParams();
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3333/${username}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdated = () => {
    fetchTodos();
    setShowForm(false);
    setEditingTodo(null);
  };

  const openAddForm = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const openEditForm = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  return (
    <div>

      <PlusCircle color="green" onClick={openAddForm}/>

      {showForm && (
        <Modal onClose={closeForm}>
          <AddOrEditTodoForm
            todo={editingTodo}
            onSuccess={handleUpdated}
          />
        </Modal>
      )}

      <div className="todos-container">
        {todos.map((todo) => (
          <div key={todo.todo_id} className="todo-container">
            <Todo
              key={todo.todo_id}
              todo={todo}
              onUpdate={handleUpdated}
              onEdit={() => openEditForm(todo)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
