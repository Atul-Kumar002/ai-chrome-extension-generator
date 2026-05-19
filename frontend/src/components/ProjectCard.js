import { useState } from "react";

function ProjectCard({ project, onOpen, onDownload, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project.prompt || "");

  return (
    <div className="project-card" title={project.title}>
      <div className="project-card-top">
        <div className="project-title">{project.title || "Untitled Extension"}</div>
        <div className="project-meta">{new Date(project.createdAt).toLocaleString()}</div>
      </div>

      <div className="project-prompt">{project.prompt ? project.prompt.slice(0,200) : "-"}{project.prompt && project.prompt.length>200?"...":""}</div>

      <div className="project-footer">
        <div className="timestamps">Updated: {new Date(project.updatedAt).toLocaleString()}</div>

        <div className="actions">
          <button className="btn small" onClick={onOpen}>Open Project</button>
          <button className="btn small" onClick={onDownload}>Download ZIP</button>
          <button className="btn small" onClick={()=>setEditing(!editing)}>{editing?"Cancel":"Edit Request"}</button>
          <button className="btn small danger" onClick={onDelete}>Delete</button>
        </div>
      </div>

      {editing && (
        <div className="edit-panel">
          <textarea value={draft} onChange={e=>setDraft(e.target.value)} />
          <div className="edit-actions">
            <button className="btn" onClick={()=>{ onEdit(draft); setEditing(false); }}>Save</button>
            <button className="btn muted" onClick={()=>{ setDraft(project.prompt || ""); setEditing(false); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
