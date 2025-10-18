import { useParams } from 'react-router-dom';
import { StageDisplay } from '../stages/StageDisplay';
import { Stages } from '../stages/Stages';
import { useEffect, useState } from 'react';
import { SummTextBox } from '../summaries/SummTextBox';
import { Eye, EyeOff } from 'lucide-react';
import { Summaries } from '../summaries/Summaries';
import { Modal } from '../Modal';


export function ProjectDisplay() {
  const { username, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [showSumm, setShowSumm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProject();
    setLastVisiTime();
    console.log("🧩 ProjectDisplay mounted!");
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:3333/${username}/projects/single/${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Failed to fetch project");

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const setLastVisiTime = async () => {
    try {
      const response = await fetch(`http://localhost:3333/${username}/projects/visit/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Failed to fetch project");
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  }

  if (!project) return <p>Loading project...</p>;

  return (
    <>
      {selectedStageId === null ? (
        <Stages
          projectId={projectId}
          username={username}
          onStageSelect={setSelectedStageId}
        />
      ) : (
        <>
          <button onClick={() => setSelectedStageId(null)}>Back to stage list</button>
          <StageDisplay
            username={username}
            projectId={projectId}
            stageId={selectedStageId}
          />
        </>
      )}

      <SummTextBox projectId={project.project_id} username={username} />
      <div className='show-summaries'>
        {!showSumm ? (
          <div className='not-showing'>
            <Eye onClick={() => {
              setShowSumm(true);
              setShowModal(true);  
              console.log('in setShowSumm');
            }} />
          </div>
        ) : (
          <div className='showing'>
            <EyeOff onClick={() => {
              setShowSumm(false);
              setShowModal(false);  
            }} />
          </div>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => {
          setShowModal(false);
          setShowSumm(false);
        }}>
          <Summaries projectId={project.project_id} username={username}/>
        </Modal>
      )}
    </>
  );
}
