import express from "express";
import { getProjects, getProjectById, updateProject } from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getProjects);

router.route("/:id")
    .get(protect, getProjectById)
    .put(protect, updateProject);

export default router;
