const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  type:      { type: String, enum: ["contact", "quote"], default: "contact" },
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true },
  phone:     { type: String, default: "" },
  interest:  { type: String, default: "" },
  message:   { type: String, default: "" },
  // quote-specific
  service:   { type: String, default: "" },
  budget:    { type: String, default: "" },
  timeline:  { type: String, default: "" },
  read:      { type: Boolean, default: false },
  readAt:    { type: Date, default: null },
}, { timestamps: true });

// Auto-delete after 30 days
contactSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = model("ContactSubmission", contactSchema);
