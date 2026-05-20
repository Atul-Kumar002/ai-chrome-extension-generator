import { useEffect, useMemo, useState } from "react";
import "../styles/dashboard.css";
import ProjectCard from "../components/ProjectCard";
import { getProjects, deleteProject as removeProject, exportProjectZip, updateProject } from "../services/storage";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = () => {
      setIsLoading(true);
      setProjects(getProjects());
      setTimeout(() => setIsLoading(false), 200);
    };

    loadProjects();
    window.addEventListener("extensio:projects-updated", loadProjects);
    return () => window.removeEventListener("extensio:projects-updated", loadProjects);
  }, []);

  const filtered = useMemo(() => {
    let res = projects.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(p => (p.title || "").toLowerCase().includes(q) || (p.prompt || "").toLowerCase().includes(q));
    }
    if (sort === "latest") res.sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt));
    if (sort === "oldest") res.sort((a,b)=> new Date(a.updatedAt) - new Date(b.updatedAt));
    if (sort === "type") res.sort((a,b)=> (a.projectType||"").localeCompare(b.projectType||""));
    return res;
  }, [projects, query, sort]);

  const handleDelete = (projectId) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    removeProject(projectId);
    setProjects(getProjects());
  };

  const handleDownload = async (project) => {
    await exportProjectZip(project);
  };

  const handleOpen = (project) => {
    if (onNavigate) onNavigate("home");
    localStorage.setItem("extensio_last_opened", project.id);
  };

  const handleEditRequest = async (project, newPrompt) => {
    const updated = { ...project, prompt: newPrompt, updatedAt: new Date().toISOString() };
    updateProject(updated);
    setProjects(getProjects());
  };

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div>
          <h1>Projects</h1>
          <p className="muted">Manage and revisit your generated Chrome extensions</p>
        </div>

        <div className="dashboard-controls">
          <input className="search" placeholder="Search projects or prompts..." value={query} onChange={e=>setQuery(e.target.value)} />
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="type">Sort: Project Type</option>
          </select>
        </div>
      </header>

      <main className="dashboard-main">
        {isLoading ? (
          <div className="loading-state">
            <LoadingSpinner status="Loading projects..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h2>No extension projects available yet.</h2>
            <p>Create your first extension from the Home page — it will appear here.</p>
            <button className="cta" onClick={()=>onNavigate && onNavigate("home")}>Create New Extension</button>
          </div>
        ) : (
          <div className="project-grid">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onOpen={() => handleOpen(p)}
                onDownload={() => handleDownload(p)}
                onEdit={(newPrompt) => handleEditRequest(p, newPrompt)}
                onDelete={() => handleDelete(p.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
