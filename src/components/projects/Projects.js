import { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { AddOrEditProject } from "./AddOrEditProject";
import { Project } from "./Project";
import '../../css/Projects.css';
import { useParams } from "react-router-dom";
import { CirclePlus } from "lucide-react";


export function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { username, agentName, projectStatus } = useParams();
  console.log("Username:", username, "Agent Name:", agentName, "Project Status:", projectStatus);


  useEffect(() => {
    console.log(typeof agentName);
    if (typeof agentName !== 'undefined') {
      fetchAagentProjects();
    } else {
      fetchProjects();
    }
  }, [username, projectStatus, agentName]);

  const fetchAagentProjects = async () => {
    try {
      const res = await fetch(`http://localhost:3333/${username}/projects/${agentName}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`http://localhost:3333/${username}/projects/${projectStatus}/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };


  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`http://localhost:3333/${username}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) throw new Error("Failed to delete project");
      console.log(`deleted successfully`);

      setProjects(prev => prev.filter(p => p.project_id !== projectId));
    } catch (error) {
      alert("Error deleting project: " + error.message);
    }
  };

  const onHoldProject = async (projectId, status) => {
    if (!window.confirm("Are you sure you want to move this project to 'on hold'?")) return;


    try {
      const res = await fetch(`http://localhost:3333/${username}/projects/onHold/${projectId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }) // ← כאן העדכון בפועל
      });


      if (!res.ok) throw new Error("Failed to update project status");


      console.log(`Project ${projectId} set to 'on hold'`);
      fetchProjects();


      // עדכון הסטייט - מסיר את הפרויקט מהרשימה הפעילה
    } catch (error) {
      alert("Error setting project to 'on hold': " + error.message);
    }
  };


  const handleUpdated = () => {
    fetchProjects();
    setShowForm(false);
    setEditingProject(null);
  };

  const openAddForm = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };


  return (
    <div className="projects-page">
      <CirclePlus className="btn-add" onClick={openAddForm} />
      {showForm && (
        <Modal onClose={closeForm}>
          <AddOrEditProject
            project={editingProject}
            onSuccess={handleUpdated}
          />
        </Modal>
      )}

      <div className="projects-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.project_id} className="project-card-wrapper">
              <Project
                project={project}
                onEdit={() => openEditForm(project)}
                onHold={onHoldProject} 
              />
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>

    </div>
  );
}

