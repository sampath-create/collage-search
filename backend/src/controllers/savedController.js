const SavedItem = require("../models/SavedItem");
const College = require("../models/College");

const listSaved = async (req, res, next) => {
  try {
    const items = await SavedItem.find({ user: req.user.id })
      .populate("college", "name location fees rating")
      .populate("collegeIds", "name location fees rating")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ data: items });
  } catch (err) {
    return next(err);
  }
};

const saveCollege = async (req, res, next) => {
  try {
    const { collegeId } = req.body || {};
    if (!collegeId) {
      return res.status(400).json({ error: "collegeId is required" });
    }

    const collegeExists = await College.exists({ _id: collegeId });
    if (!collegeExists) {
      return res.status(404).json({ error: "College not found" });
    }

    const item = await SavedItem.create({
      user: req.user.id,
      kind: "college",
      college: collegeId
    });

    return res.status(201).json({ data: item });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "College already saved" });
    }
    return next(err);
  }
};

const saveComparison = async (req, res, next) => {
  try {
    const { collegeIds } = req.body || {};
    if (!Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 3) {
      return res.status(400).json({ error: "collegeIds must include 2 to 3 ids" });
    }

    const uniqueIds = [...new Set(collegeIds.map((id) => String(id)))];
    if (uniqueIds.length !== collegeIds.length) {
      return res.status(400).json({ error: "collegeIds must be unique" });
    }

    const count = await College.countDocuments({ _id: { $in: collegeIds } });
    if (count !== collegeIds.length) {
      return res.status(404).json({ error: "One or more colleges not found" });
    }

    const item = await SavedItem.create({
      user: req.user.id,
      kind: "comparison",
      collegeIds
    });

    return res.status(201).json({ data: item });
  } catch (err) {
    return next(err);
  }
};

const removeSaved = async (req, res, next) => {
  try {
    const item = await SavedItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!item) {
      return res.status(404).json({ error: "Saved item not found" });
    }
    return res.json({ data: item });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listSaved, saveCollege, saveComparison, removeSaved };
