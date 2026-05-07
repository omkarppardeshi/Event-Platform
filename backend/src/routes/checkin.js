const express = require("express");
const router = express.Router();
const { searchAttendee, markCheckin } = require("../controllers/checkinController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/search", protect, adminOnly, searchAttendee);
router.post("/", protect, adminOnly, markCheckin);

module.exports = router;