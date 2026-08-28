import Project from "../models/Project.js";

// @desc    Get projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
    try {
        const { clientId } = req.query;
        let filter = {};
        if (clientId) filter.$or = [{ client: clientId }, { clientId: clientId }];
        if (req.user.role === "Sales") filter.$or = filter.$or ? filter.$or.concat([{ owner: req.user.id }, { assignedTo: req.user.id }]) : [{ owner: req.user.id }, { assignedTo: req.user.id }];

        const projects = await Project.find(filter)
            .populate("client", "name email phone")
            .populate("owner", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
    try {
        let filter = { _id: req.params.id };

        const project = await Project.findOne(filter)
            .populate("client", "name email phone")
            .populate("owner", "name email")
            .populate("team", "name email");

        if (!project) return res.status(404).json({ success: false, message: "Project not found or unauthorized", data: null });

        // Retrieve tasks and activity for the project workspace
        const [tasks, activities] = await Promise.all([
            import("../models/Task.js").then(m => m.default.find({ $or: [{ project: project._id }, { projectId: project._id }] }).populate("assignedTo", "name email").sort({ createdAt: -1 })),
            import("../models/Activity.js").then(m => m.default.find({ projectId: project._id }).populate("createdBy", "name").sort({ createdAt: -1 }))
        ]);

        res.status(200).json({ success: true, data: { project, tasks, activities } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
    try {
        const { status, progress } = req.body;

        let filter = { _id: req.params.id };

        let project = await Project.findOne(filter);
        if (!project) return res.status(404).json({ success: false, message: "Project not found", data: null });

        if (status) project.status = status;
        if (progress !== undefined) project.progress = progress;

        await project.save();

        res.status(200).json({ success: true, message: "Project updated", data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
    try {
        const { client, name, owner, team, dueDate, status, progress } = req.body;
        const project = await Project.create({
            client,
            name,
            owner: owner || req.user.id,
            team: team || [],
            dueDate,
            status: status || "planning",
            progress: progress || 0,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, message: "Project created successfully", data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
    try {
        let filter = { _id: req.params.id };
        const project = await Project.findOne(filter);
        if (!project) return res.status(404).json({ success: false, message: "Project not found", data: null });

        await project.deleteOne();
        res.status(200).json({ success: true, message: "Project deleted", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// @desc    Get project tasks
// @route   GET /api/projects/:id/tasks
// @access  Private
export const getProjectTasks = async (req, res) => {
    try {
        let filter = { _id: req.params.id };
        const project = await Project.findOne(filter);
        if (!project) return res.status(404).json({ success: false, message: "Project not found", data: null });

        const Task = (await import("../models/Task.js")).default;
        const tasks = await Task.find({ $or: [{ project: project._id }, { projectId: project._id }] })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};
