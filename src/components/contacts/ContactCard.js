import { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';
import { ContactForm } from './ContactForm';
import '../../css/ContactOrUser.css';

export function ContactCard({ contact, username, onUpdated, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3333/${username}/contacts/${contact.contact_type}s/delete/${contact.contact_name}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      onDeleted(contact.contact_id);
    } else {
      const error = await res.text();
      console.error("Delete failed:", error);
    }
  };

  const handleUpdate = async (updatedData) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3333/${username}/contacts/${contact.contact_type}/update/${contact.contact_name}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      setIsEditing(false);
      onUpdated();
    } else {
      const error = await res.text();
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="component-1">
      <Trash onClick={handleDelete} />
      <Pencil onClick={() => setIsEditing(true)} />
      {isEditing && (
        <ContactForm
          contact={contact}
          onSave={handleUpdate}
          onClose={() => setIsEditing(false)}
          type={contact.contact_type}
        />
      )}
      <div className="ellipse-19"></div>
      <div className="david-shalom">{contact.contact_name}</div>
      <div className="frame-50">
        <div className="frame-47">
          <div className="company">Tel:</div>
          <div className="ivory">{contact.contact_phone}</div>
        </div>
        <div className="frame-48">
          <div className="company">Mail:</div>
          <div className="ivory">{contact.contact_email}</div>
        </div>
        <div className="frame-49">
          <div className="company">Adress:</div>
          <div className="ivory">{contact.address}</div>
        </div>

      </div>
    </div>
  );
}
