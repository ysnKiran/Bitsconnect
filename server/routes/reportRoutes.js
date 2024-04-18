const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");

router.get("/reviews", ReportController.getPendingReports);
router.post("/newReview", ReportController.postReport);
router.put("/reviews/:reviewId/complete", ReportController.markReportCompleted);

module.exports = router;
