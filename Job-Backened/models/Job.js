const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  candidates: [
    { email: { type: String }, status: { type: String, default: "pending" } },
  ],
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Job", JobSchema);
