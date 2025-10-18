import { CircleCheckBig, LockKeyholeOpen, PencilLine, RefreshCwOff, Trash2 } from 'lucide-react';
import { Range } from './Range';
import '../../css/Projects.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Project({ project, onEdit, onHold }) {

    const [completedSteps, setCcompletedSteps] = useState();
    const token = localStorage.getItem('token');
    const { username } = useParams();
    const navigate = useNavigate();
    const allStatuses = ['on hold', 'live project', 'closed'];
    const availableTransitions = allStatuses.filter(s => s !== project.status);

    useEffect(() => {
        fetchCompletedStagesAmount();
    }, [project.project_id, username])

    const fetchCompletedStagesAmount = async () => {
        try {
            const res = await fetch(`http://localhost:3333/${username}/stages/completed/${project.project_id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error("Failed to fetch completed amount");
            const data = await res.json();
            setCcompletedSteps(data.completed);
        } catch (error) {
            console.error("Error fetching completed amount:", error);
        }
    }

    return (
        <div className="project-card">
            <div className="project-card-header">
                <PencilLine className="icon-edit" onClick={onEdit} />
                {project.status !== 'on hold' && (<RefreshCwOff className="icon-delete" onClick={() => onHold(project.project_id, 'on hold')} />)}
                {project.status !== 'closed' && (<CircleCheckBig className="icon-delete" onClick={() => onHold(project.project_id, 'closed')} />)}
                {project.status !== 'live project' && (<LockKeyholeOpen className="icon-delete" onClick={() => onHold(project.project_id, 'live project')} />)}
            </div>
            <div className="project-avatar" />
            <div className="project-title">{project.project_name}</div>

            <div className="project-details">
                <div className="project-detail-row">
                    <span className="label">Status:</span>
                    <span className="value">{project.status}</span>
                </div>
                <div className="project-detail-row">
                    <span className="label">Created on:</span>
                    <span className="value">{new Date(project.creation_date).toLocaleDateString()}</span>
                </div>
                <div className="project-detail-row">
                    <span className="label">Last Visit:</span>
                    <span className="value">{new Date(project.last_visit_time).toLocaleDateString()}</span>
                </div>
            </div>
            <div className='range'><Range completedSteps={completedSteps} /></div>

            <div className="project-show-details"
                onClick={() => navigate(`/${username}/projects/projectDisplay/${project.project_id}`)}>
                <Eye className="eye-icon" />
                Show details
            </div>
        </div>
    );
}

