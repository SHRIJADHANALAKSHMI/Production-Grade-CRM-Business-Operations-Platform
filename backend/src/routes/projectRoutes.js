import express from "express";
import { getProjects, getProjectById, createProject, updateProject, deleteProject, getProjectTasks } from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, authorize("Admin", "Manager", "Sales"), getProjects)
    .post(protect, authorize("Admin", "Manager"), createProject);

router.route("/:id")
    .get(protect, authorize("Admin", "Manager", "Sales"), getProjectById)
    .put(protect, authorize("Admin", "Manager"), updateProject)
    .delete(protect, authorize("Admin", "Manager"), deleteProject);

router.route("/:id/tasks")
    .get(protect, authorize("Admin", "Manager", "Sales"), getProjectTasks);

export default router;
