import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    convertedDate: { type: Date, default: Date.now },
    projectsCount: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);
