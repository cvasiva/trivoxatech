const { Schema, model } = require("mongoose");

const newsletterSchema = new Schema({
  email:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  source: { type: String, default: "website" },
}, { timestamps: true });

module.exports = model("NewsletterSubscriber", newsletterSchema);
