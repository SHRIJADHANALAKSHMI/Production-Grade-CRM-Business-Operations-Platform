import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";

// @desc    Get tasks for a project
// @route   GET /api/tasks?projectId=
// @access  Private
export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.query;
        if (!projectId) return res.status(400).json({ success: false, message: "projectId is required", data: null });

        // Ensure user has access to project
        const filter = { $or: [{ project: projectId }, { projectId: projectId }] };
        const tasks = await Task.find(filter)
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "Tasks retrieved successfully", data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        const { title, project, projectId, assignedTo, priority, dueDate, status } = req.body;

        const finalProject = project || projectId;

        if (!finalProject) {
            return res.status(400).json({ message: "Project ID required" });
        }

        const task = await Task.create({
            title, project: finalProject, assignedTo, priority, dueDate, status
        });

        await Project.findByIdAndUpdate(finalProject, { $push: { tasks: task._id } });

        await Activity.create({
            projectId: finalProject,
            action: "task_created",
            description: `Added task: "${title}"`,
            createdBy: req.user.id
        });

        if (assignedTo && assignedTo.toString() !== req.user.id) {
            const notif = await Notification.create({
                userId: assignedTo,
                type: "task_assigned",
                message: `You have been assigned a new task: "${title}"`,
                link: `/projects/${finalProject}`
            });
            const io = req.app.get("io");
            if (io) io.to(assignedTo.toString()).emit("new_notification", notif);
        }

        await updateProjectProgress(project || projectId);

        res.status(201).json({ success: true, message: "Task created", data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Update task status/details
// @route   PATCH /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        const originalTask = await Task.findById(req.params.id);
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        const projectId = task.project || task.projectId;

        // Notify if assigned to a new user
        if (req.body.assignedTo && req.body.assignedTo.toString() !== originalTask.assignedTo?.toString() && req.body.assignedTo.toString() !== req.user.id) {
            const notif = await Notification.create({
                userId: req.body.assignedTo,
                type: "task_assigned",
                message: `You were reassigned to task: "${task.title}"`,
                link: `/projects/${projectId}`
            });
            const io = req.app.get("io");
            if (io) io.to(req.body.assignedTo.toString()).emit("new_notification", notif);
        }

        if (req.body.status) {
            await Activity.create({
                projectId: task.project || task.projectId,
                action: "task_updated",
                description: `Moved task "${task.title}" to ${req.body.status}`,
                createdBy: req.user.id
            });
        }

        await updateProjectProgress(task.project || task.projectId);

        res.status(200).json({ success: true, message: "Task updated", data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        const projectId = task.project || task.projectId;
        await Task.deleteOne({ _id: task._id });

        await Project.findByIdAndUpdate(projectId, { $pull: { tasks: task._id } });

        await Activity.create({
            projectId: projectId,
            action: "task_deleted",
            description: `Deleted task "${task.title}"`,
            createdBy: req.user.id
        });

        await updateProjectProgress(projectId);

        res.status(200).json({ success: true, message: "Task removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// Helper: Auto-recalculate project progress based on tasks
const updateProjectProgress = async (projectId) => {
    const allTasks = await Task.find({ $or: [{ project: projectId }, { projectId: projectId }] });
    if (allTasks.length === 0) return;

    const completedTasks = allTasks.filter(t => t.status === "done").length;
    const progress = Math.round((completedTasks / allTasks.length) * 100);

    let statusUpdate = {};
    if (progress === 100) statusUpdate.status = "completed";
    else if (progress > 0 && progress < 100) statusUpdate.status = "active";

    await Project.findByIdAndUpdate(projectId, { progress, ...statusUpdate });
};
