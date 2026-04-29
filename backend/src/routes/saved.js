const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  listSaved,
  saveCollege,
  saveComparison,
  removeSaved
} = require("../controllers/savedController");

const router = express.Router();

router.use(requireAuth);

router.get("/", listSaved);
router.post("/colleges", saveCollege);
router.post("/comparisons", saveComparison);
router.delete("/:id", removeSaved);

module.exports = router;
