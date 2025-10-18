
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ContactCard } from "./ContactCard";
import { ContactForm } from "./ContactForm";
import { CirclePlus } from "lucide-react";
import '../../css/ContactOrUser.css';

export function Contacts({ type }) {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { username } = useParams();

  const endpoint = `http://localhost:3333/${username}/contacts/${type}s`;

  useEffect(() => {
    fetchContacts();
  }, [type]);

  const fetchContacts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setContacts(data);
  };



  const handleAdd = async (newData) => {
    const token = localStorage.getItem('token');
    const dataWithType = {
      ...newData,
      contact_type: type, // ← מוסיף contact_type לפי סוג הדף
    };
    const addUrl = `http://localhost:3333/${username}/contacts/${type}/add/${newData.contact_name}`;
    const res = await fetch(addUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWithType)
    });

    if (res.ok) {
      setShowForm(false);
      fetchContacts();
    } else {
      const err = await res.text();
      console.error("Add contact failed:", err);
      alert("שגיאה בהוספה: " + err);
    }
  };

  const handleDelete = (id) => {
    setContacts(prev => prev.filter(c => c.contact_id !== id));
  };

  return (
    <div className="contacts-container">
      <CirclePlus onClick={() => setShowForm(true)} />
      {showForm && (
        <ContactForm
          onSave={handleAdd}
          onClose={() => setShowForm(false)}
          type={type} // ← עובר מה-ContactsPage לפי סוג הדף
        />
      )}

      <div className="contact-container">
        {contacts.map((c) => (
          <ContactCard
            key={c.contact_id}
            contact={c}
            username={username}
            onUpdated={fetchContacts}
            onDeleted={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
