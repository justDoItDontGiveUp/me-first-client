import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "../projects/Project";
import { Modal } from "../Modal";
import { AddOrEditProject } from "../projects/AddOrEditProject";
import { Eye } from "lucide-react";
import "../../css/Projects.css";
import { useParams } from "react-router-dom";

export function HomePage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    if (username) {
      fetchRecentProjects();
      console.log(username, 'is fetching recent');

    }
  }, [username]);
  const token = localStorage.getItem("token");
  const fetchRecentProjects = async () => {
    try {
      const res = await fetch(`http://localhost:3333/${username}/projects/recent`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch recent projects");

      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching recent projects:", error);
      setProjects([]);
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`http://localhost:3333/${username}/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete project");

      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
    } catch (error) {
      alert("Error deleting project: " + error.message);
    }
  };



  const openEditForm = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleUpdated = () => {
    fetchRecentProjects();
    closeForm();
  };



  return (
    <div className="projects-page">
      {showForm && (
        <Modal onClose={closeForm}>
          <AddOrEditProject project={editingProject} onSuccess={handleUpdated} />
        </Modal>
      )}

      <div className="projects-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.project_id}>
              <Project
                project={project}
                onEdit={() => openEditForm(project)}
                onDelete={() => deleteProject(project.project_id)}
              />
              {/* <div
                className="project-show-details"
                onClick={() => navigate(`/${username}/projects/projectDisplay/${project.project_id}`)}>
                <Eye className="eye-icon"/>
                Show details
              </div> */}
            </div>
          ))
        ) : (
          <p>No recent projects found.</p>
        )}
      </div>
    </div>
  );
}