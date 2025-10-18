import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function AddOrEditTodoForm({ todo = null, onSuccess }) {
  const { username } = useParams();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    to_user_id: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        to_user_id: todo.to_user_id,
        title: todo.title,
        description: todo.description,
      });
    }
  }, [todo]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:3333/${username}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!todo;
    const url = isEdit
      ? `http://localhost:3333/${username}/todos/${todo.todo_id}`
      : `http://localhost:3333/${username}/todos`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSuccess();
    } else {
      alert("שגיאה בשמירת המשימה");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h3>{todo ? "עריכת משימה" : "משימה חדשה"}</h3>

      <select
        required
        value={formData.to_user_id}
        onChange={(e) =>
          setFormData({ ...formData, to_user_id: e.target.value })
        }
      >
        <option value="">בחר משתמש</option>
        {users.map((u) => (
          <option key={u.user_id} value={u.user_id}>
            {u.username}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="כותרת"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <textarea
        placeholder="תיאור"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <button type="submit">{todo ? "עדכן" : "שמור"}</button>
    </form>
  );
}
