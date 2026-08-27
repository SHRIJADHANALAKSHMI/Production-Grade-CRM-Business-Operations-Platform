import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, authorize('Admin', 'Manager', 'Sales'), createTask);

router.route('/:id')
    .patch(protect, authorize('Admin', 'Manager', 'Sales'), updateTask)
    .delete(protect, authorize('Admin', 'Manager'), deleteTask); // Sales cannot delete tasks

export default router;
