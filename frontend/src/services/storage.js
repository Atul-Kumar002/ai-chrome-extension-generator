import JSZip from "jszip";

const LS_KEY = "extensio_projects";
const LEGACY_LS_KEY = "extensio_projects_v1";

function read() {
  try {
    const raw = localStorage.getItem(LS_KEY) || localStorage.getItem(LEGACY_LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read projects from localStorage", e);
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LEGACY_LS_KEY);
    return [];
  }
}

function write(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function getProjects() {
  return read();
}

export function saveProject(project) {
  const list = read();
  const now = new Date().toISOString();
  const p = {
    id: project.id || Date.now(),
    title: project.title || "Untitled Extension",
    prompt: project.prompt || "",
    files: project.files || {},
    createdAt: project.createdAt || now,
    updatedAt: project.updatedAt || now,
  };
  const existing = list.findIndex(x=>x.id===p.id);
  if (existing >= 0) {
    list[existing] = { ...list[existing], ...p, updatedAt: now };
  } else {
    list.unshift(p);
  }
  write(list);
  return p;
}

export function updateProject(project) {
  const list = read();
  const idx = list.findIndex(x=>x.id===project.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...project, updatedAt: new Date().toISOString() };
    write(list);
    return list[idx];
  }
  return null;
}

export function deleteProject(projectId) {
  const list = read().filter(p=>p.id!==projectId);
  write(list);
}

export async function exportProjectZip(project) {
  try {
    const zip = new JSZip();
    const files = project.files || {};
    Object.keys(files).forEach(name => {
      zip.file(name, files[name]);
    });

    // include metadata
    zip.file("manifest.json", JSON.stringify({
      id: project.id,
      title: project.title,
      prompt: project.prompt,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }, null, 2));

    const content = await zip.generateAsync({ type: "blob" });
    const name = `${(project.title||"extension").replace(/[^a-z0-9]/gi,"_").toLowerCase()}_${project.id || Date.now()}.zip`;
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Failed to export zip", e);
    alert("Failed to create ZIP: " + e.message);
  }
}
