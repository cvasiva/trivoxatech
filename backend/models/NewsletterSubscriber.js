const { Schema, model } = require("mongoose");

const newsletterSchema = new Schema({
  email:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:   { type: String, default: "", trim: true },
  phone:  { type: String, default: "", trim: true },
  source: { type: String, default: "website" },
}, { timestamps: true });

// Auto-delete after 30 days
newsletterSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = model("NewsletterSubscriber", newsletterSchema);
