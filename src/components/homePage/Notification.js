import { BellDot, BellMinus, BellPlus, BellRing } from 'lucide-react';
import { useState } from 'react';
import '../../css/Notification.css';

export function Notification({ userRole }) {
  const [notes, setNotes] = useState([
    { id: 1, text: "Welcome to the ERP system" }
  ]);
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newText, setNewText] = useState('');

  const handleDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleAddNote = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUsername.trim() && newText.trim()) {
      const id = Date.now();
      setNotes([...notes, { id, text: `${newUsername}: ${newText}` }]);
      setNewUsername('');
      setNewText('');
      setShowForm(false);
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={() => setOpen(!open)}>
        {notes.length > 1 ? <BellDot size={40}/> : <BellRing size={40}/>}
        {userRole === 'admin' && (
          <BellPlus size={40}
            className="notification-add"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNote();
            }}
          />
        )}
      </div>

      {/* טופס הוספה של התראה */}
      {showForm && (
        <div className="notification-form-popup" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Content"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancle</button>
          </form>
        </div>
      )}

      {/* תפריט ההתראות */}
      {open && (
        <div className="notification-popup">
          {notes.length === 0 ? (
            <div className="notification-empty">No notifications</div>
          ) : (
            notes.map(note => (

              <div
                key={note.id}
                className="notification-note"
                onClick={() => handleDelete(note.id)}
                title="Click to delete"
              ><BellMinus />
                {note.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
