const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  username:  { type: String, required: true, unique: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  hash:      { type: String, default: null },
  role:      { type: String, enum: ["superadmin", "admin"], default: "admin" },
  provider:  { type: String, default: "local" },
  googleId:  { type: String, default: null },
  picture:   { type: String, default: null },
}, { timestamps: true });

module.exports = model("Admin", adminSchema);
