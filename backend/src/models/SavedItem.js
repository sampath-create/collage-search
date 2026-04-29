const mongoose = require("mongoose");

const savedItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kind: { type: String, enum: ["college", "comparison"], required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    collegeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }]
  },
  { timestamps: true }
);

savedItemSchema.index({ user: 1, kind: 1, college: 1 }, { unique: true, sparse: true });

const SavedItem = mongoose.model("SavedItem", savedItemSchema);

module.exports = SavedItem;
