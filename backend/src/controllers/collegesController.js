const College = require("../models/College");
const { parsePagination, parseSort } = require("../utils/pagination");

const listColleges = async (req, res, next) => {
  try {
    const { search, location, course, minFees, maxFees, sort } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (course) {
      query["courses.name"] = { $regex: course, $options: "i" };
    }
    if (minFees || maxFees) {
      query.fees = {};
      if (minFees) {
        query.fees.$gte = Number(minFees);
      }
      if (maxFees) {
        query.fees.$lte = Number(maxFees);
      }
    }

    const { page, limit, skip } = parsePagination(req.query);
    const sortBy = parseSort(sort);

    const [total, colleges] = await Promise.all([
      College.countDocuments(query),
      College.find(query).sort(sortBy).skip(skip).limit(limit).lean()
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.json({
      data: colleges,
      meta: { page, limit, total, totalPages }
    });
  } catch (err) {
    return next(err);
  }
};

const getCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id).lean();
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    return res.json({ data: college });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listColleges, getCollege };
