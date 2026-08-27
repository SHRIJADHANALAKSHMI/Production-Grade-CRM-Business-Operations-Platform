import express from "express";
import { protect } from "../middleware/auth.js";
import Lead from "../models/Lead.js";
import Client from "../models/Client.js";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.status(200).json({ success: true, data: [] });

        const regex = new RegExp(q, "i");

        // Concurrent search across 3 models
        const [leads, clients, projects] = await Promise.all([
            Lead.find({ name: regex, deletedAt: null }).select("name email phone status _id").limit(5).lean(),
            Client.find({ name: regex }).select("name email phone _id").limit(5).lean(),
            Project.find({ name: regex }).select("name status _id").limit(5).lean()
        ]);

        const results = [
            ...leads.map(l => ({ ...l, type: "lead", url: `/leads` })),
            ...clients.map(c => ({ ...c, type: "client", url: `/clients` })),
            ...projects.map(p => ({ ...p, type: "project", url: `/projects/${p._id}` }))
        ];

        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
