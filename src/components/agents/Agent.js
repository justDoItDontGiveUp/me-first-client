import { AddOrEditAgentForm } from "./AddOrEditAgentForm";
import { useState } from 'react';
import '../../css/ContactOrUser.css';
import { UserPen } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";

export function Agent({ agent }) {

    const [isEditing, setIsEditing] = useState(false);
    const { username } = useParams();
    const navigate = useNavigate();

    const updateAgent = async (updatedData) => {
        try {
            const response = await fetch(`/update/${agent.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update agent');
            }
        }
        catch (error) {
            console.error("Error updating agent:", error);
        }
    }
    return (
        <>
            <div className="component-1">
                <UserPen onClick={() => setIsEditing(true)} />
                {isEditing && (
                    <AddOrEditAgentForm
                        agent={agent}
                        onUpdate={updateAgent}
                        onClose={() => setIsEditing(false)}
                    />
                )}
                <div className="ellipse-19">{agent.profile_picture}</div>
                <div className="david-shalom">{agent.username}</div>
                <div className="frame-50">
                    <div className="frame-47">
                        <div className="company">Tel:</div>
                        <div className="ivory">{agent.phone}</div>
                    </div>
                    <div className="frame-48">
                        <div className="company">Mail:</div>
                        <div className="ivory">{agent.email}</div>
                    </div>
                    <div className="frame-49">
                        <div className="company">Adress:</div>
                        <div className="ivory">{agent.address}</div>
                    </div>
                </div>
                <div className="frame-5" onClick={()=>navigate(`/${username}/users/${agent.username}/projects`)}>
                    Show projects
                </div>
            </div>
        </>
    );

}