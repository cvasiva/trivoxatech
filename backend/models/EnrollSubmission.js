const { Schema, model } = require("mongoose");

const enrollSchema = new Schema({
  type:     { type: String, default: "enroll" },
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, lowercase: true, trim: true },
  phone:    { type: String, required: true },
  whatsapp: { type: String, required: true },
  course:   { type: String, default: "" },
  message:  { type: String, default: "" },
  read:     { type: Boolean, default: false },
  readAt:   { type: Date, default: null },
}, { timestamps: true });

module.exports = model("EnrollSubmission", enrollSchema);
