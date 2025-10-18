import { useState, useEffect } from 'react';
import { Stage } from './Stage';
import '../../css/Stages.css';

export function Stages({ projectId, username, onStageSelect }) {

    const [projectStages, setProjectStages] = useState([]);

    useEffect(() => {
        fetchProjectStages();
    }, []);

    const fetchProjectStages = async () => {
        try {
            const res = await fetch(`http://localhost:3333/${username}/stages/${projectId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error("Failed to fetch project stages");
            const data = await res.json();
            setProjectStages(data);
            console.log(data);
            
        } catch (error) {
            console.error("Error fetching project stages:", error);
        }
    };

    return (
        <>
            {projectStages.map((stage) => (
                <div
                    key={stage.stage_id}
                    onClick={() => onStageSelect(stage.stage_id)} 
                    style={{ cursor: 'pointer' }}
                    className='stages-container'
                >
                    <Stage
                        stageNum={stage.stage_number}
                        stageStat={stage.completed}
                        stageName={stage.stage_name}
                    />
                </div>
            ))}
        </>
    );
}
