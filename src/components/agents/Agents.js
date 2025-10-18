// Agents.jsx
import { useEffect, useState } from "react";
import { Agent } from "./Agent";
import { useParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Modal } from '../Modal';
import { AddOrEditAgentForm } from "./AddOrEditAgentForm";
import '../../css/ContactOrUser.css';

export function Agents() {
  const [agents, setAgents] = useState([]);
  const [addAgent, setAddAgent] = useState(false);
  const { username } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch(`http://localhost:3333/${username}/users/agents/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'authorizeRoles': 'admin',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (formData) => {
    const { password, ...userData } = formData;
    console.log("📦 Sending formData:", userData);
    try {
      const response = await fetch(`http://localhost:3333/${username}/users/addAgent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Failed to add agent');
      const addedUser = await response.json();
      console.log("🪵 addedUser from backend:", addedUser);
      console.log("✅ Sending password to /passwords/new' ", password, addedUser.user_id);
      const passwordResponse = await fetch(`http://localhost:3333/${username}/passwords/new`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: addedUser.user_id,
          password: `${password}`
        })
      });

      if (!passwordResponse.ok) throw new Error('Failed to save password');

      await fetchAgents(); // רענון רשימת המשתמשים
      setAddAgent(false);

    } catch (error) {
      console.error("🚨 Error adding agent:", error);
    }
  };


  return (
    <div>
      <PlusCircle
        className="text-green-600 w-10 h-10 fixed bottom-6 right-6 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => setAddAgent(true)}
      />

      {addAgent && (
        <Modal onClose={() => setAddAgent(false)}>
          <AddOrEditAgentForm
            mode="add"
            onSubmit={handleAdd}
            onClose={() => setAddAgent(false)}
          />
        </Modal>
      )}

      {agents.length > 0 ? (
        <div className="agents-container">
          {agents.map((agent) => (
            <div className="agent-container" key={agent.user_id}>
              <Agent agent={agent} />
            </div>
          ))}
        </div>
      ) : (
        <p>No agents found.</p>
      )}
    </div>
  );
}
