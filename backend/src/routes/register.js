const express = require("express");
const router = express.Router();
const { registerForEvent, cancelRegistration, getMyRegistrations } = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, registerForEvent);
router.delete("/", protect, cancelRegistration);
router.get("/my", protect, getMyRegistrations);

module.exports = router;