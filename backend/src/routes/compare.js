const express = require("express");
const { compareColleges } = require("../controllers/compareController");

const router = express.Router();

router.get("/", compareColleges);

module.exports = router;
