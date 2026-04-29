const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, default: "UG" },
    duration: { type: String, default: "4 years" }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
  },
  { _id: false }
);

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    location: { type: String, required: true },
    fees: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    overview: {
      established: Number,
      type: String,
      affiliation: String,
      campusSize: String
    },
    courses: [courseSchema],
    placements: {
      placementRate: { type: Number, default: 0 },
      avgPackage: { type: Number, default: 0 },
      topRecruiters: [String]
    },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);

module.exports = College;
