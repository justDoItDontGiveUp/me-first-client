import { useState } from "react";

export function AddDocument({ stageId, projectId, docType, onSuccess }) {
  const [title, setTitle] = useState('');
  const [docVersion, setDocVersion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3333/documents/${stageId}/create`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          docType,
          projectId,
          docVersion,
          uploadedBy: JSON.parse(localStorage.getItem('user')).user_id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Error uploading document");
        return;
      }

      const data = await res.json();
      alert("Document created successfully!");
      onSuccess?.(data);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-doc-form">
      <h3>Add Document ({docType})</h3>
      <input
        type="text"
        placeholder="Title for Google Doc"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Version (e.g., v1.0)"
        value={docVersion}
        onChange={e => setDocVersion(e.target.value)}
      />
      <button onClick={handleAdd} disabled={loading}>
        {loading ? 'Creating...' : 'Add Document'}
      </button>
    </div>
  );
}

