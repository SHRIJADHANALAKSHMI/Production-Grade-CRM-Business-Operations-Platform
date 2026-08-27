import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["planning", "active", "completed", "cancelled"], default: "planning" },
    progress: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
