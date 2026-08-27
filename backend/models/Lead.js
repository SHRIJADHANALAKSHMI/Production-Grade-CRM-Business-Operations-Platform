import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    status: { type: String, enum: ["New", "Contacted", "Qualified"], default: "New" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
