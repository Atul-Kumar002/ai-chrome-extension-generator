import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();


// CREATE
router.post("/", createProject);


// GET ALL
router.get("/", getProjects);


// GET ONE
router.get("/:id", getProjectById);


// DELETE
router.delete("/:id", deleteProject);

export default router;