import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(protect, getTasks)
    .post(protect, createTask);

router.route("/:id")
    .patch(protect, updateTask)
    .delete(protect, deleteTask);

export default router;
