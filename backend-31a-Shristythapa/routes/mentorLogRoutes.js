const router = require("express").Router();
const mentorLogController = require("../controllers/mentorLogsController");
const { isAdmin } = require("../middleware/authguard");
router.get("/getAllMentorLogs",  mentorLogController.getAllMentorLogs);
router.get(
  "/getMentorLogById/:id",

  mentorLogController.getMentorLogById
);

module.exports = router;
