import Project from "../models/Project.js";


// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, prompt, generatedFiles } = req.body;

    const project = await Project.create({
      title,
      prompt,
      generatedFiles,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create project",
    });
  }
};


// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch projects",
    });
  }
};


// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch project",
    });
  }
};


// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete project",
    });
  }
};