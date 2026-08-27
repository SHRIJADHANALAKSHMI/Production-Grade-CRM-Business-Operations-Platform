import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    convertedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" }
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);
