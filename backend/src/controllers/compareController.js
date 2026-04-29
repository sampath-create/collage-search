const College = require("../models/College");

const compareColleges = async (req, res, next) => {
  try {
    const ids = String(req.query.ids || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length < 2 || ids.length > 3) {
      return res.status(400).json({ error: "Provide 2 to 3 college ids" });
    }

    const colleges = await College.find({ _id: { $in: ids } }).lean();
    if (colleges.length !== ids.length) {
      return res.status(404).json({ error: "One or more colleges not found" });
    }

    const byId = new Map(
      colleges.map((college) => [college._id.toString(), college])
    );
    const ordered = ids.map((id) => byId.get(id));

    const table = ordered.map((college) => ({
      id: college._id,
      name: college.name,
      location: college.location,
      fees: college.fees,
      rating: college.rating,
      placementRate: college.placements?.placementRate || 0
    }));

    return res.json({ data: table });
  } catch (err) {
    return next(err);
  }
};

module.exports = { compareColleges };
