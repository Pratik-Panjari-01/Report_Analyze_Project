import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  extractedText: { type: String, default: "" },
  analysis: { type: String, default: "" },
  status: { type: String, enum: ["uploaded", "extracted", "analyzed", "failed"], default: "uploaded" }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
