import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function AddOrEditProject({ project, onSuccess }) {
  const { username , projectStatus} = useParams();

  const [title, setTitle] = useState('');
  const [customer_id, setCustomerId] = useState('');
  const status = "live project"; // קבוע זמנית

  // אתחול בטוח – רץ רק פעם אחת
  useEffect(() => {
    if (project) {
      setTitle(project.project_name ?? '');
      setCustomerId(project.customer_id ?? '');
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = project ? 'PUT' : 'POST';
    const url = project
      ? `http://localhost:3333/projects/${project.project_id}` // ← עדכון
      : `http://localhost:3333/${username}/projects/${projectStatus}`; // ← יצירה

    const body = {
      project_name: title,
      status: status,
      customer_id: customer_id,
      supplier_id: null,
      owner_user_id: username
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'          
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save project");
      }

        const result = await res.json(); 

      onSuccess(); // ← הודעה לאב שהסתיים
      if (method == 'POST') createFolderForProjectDocs(result.project_id);
    } catch (err) {
      alert("שגיאה: " + err.message);
    }
  };

  const createFolderForProjectDocs = async (project_id) => {
    try {
      await fetch(`http://localhost:3333/${username}/documents/newFolder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${project_id}`,
          parentName: 'Projects'
        }),
      })
      console.log(`folder ${project_id} created`);      
    } catch (error) {
      console.error("Error creating a folder:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
      <input
        type="text"
        placeholder="Project name"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Customer ID"
        value={customer_id}
        onChange={e => setCustomerId(e.target.value)}
        required
      />

      <button type="submit">{project ? "Update Project" : "Add Project"}</button>
    </form>
  );
}
