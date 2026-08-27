import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    status: {
        type: String,
        enum: ["new", "contacted", "converted"],
        default: "new"
    },
    stage: {
        type: String,
        enum: ["new", "contacted", "qualified", "interested", "proposal", "won", "lost"],
        default: "new"
    },
    dealValue: { type: Number, default: 0 },
    expectedCloseDate: { type: Date },
    notes: { type: String, default: "" },
    nextFollowUpDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

// Text index for full-text search on name and email
leadSchema.index({ name: "text", email: "text" });

leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ deletedAt: 1 });


export default mongoose.model("Lead", leadSchema);
