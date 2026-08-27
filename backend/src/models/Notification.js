import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["task_assigned", "task_updated", "lead_assigned", "reminder"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
