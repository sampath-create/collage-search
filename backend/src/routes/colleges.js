const express = require("express");
const { listColleges, getCollege } = require("../controllers/collegesController");

const router = express.Router();

router.get("/", listColleges);
router.get("/:id", getCollege);

module.exports = router;
