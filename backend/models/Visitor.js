const { Schema, model } = require("mongoose");

const visitorSchema = new Schema({
  page:      { type: String, required: true },
  ip:        { type: String, default: "" },
  userAgent: { type: String, default: "" },
  referrer:  { type: String, default: "" },
  sessionId: { type: String, default: "" },
}, { timestamps: true });

module.exports = model("Visitor", visitorSchema);
