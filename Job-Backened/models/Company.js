const mongoose = require("mongoose");
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // For email verification
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Company", CompanySchema);
