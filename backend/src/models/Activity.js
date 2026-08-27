import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    action: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
