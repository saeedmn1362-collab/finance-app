const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/monthly", authMiddleware, reportsController.getMonthlyReport);
router.get("/yearly", authMiddleware, reportsController.getYearlyReport);

module.exports = router;
