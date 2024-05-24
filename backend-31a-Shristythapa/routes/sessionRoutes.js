const router = require("express").Router();
const sessionController = require("../controllers/sessionController");
const { mentorAuthGuard } = require("../middleware/authguard");
const { menteeAuthGuard } = require("../middleware/authguard");

router.post("/create", sessionController.createSession, mentorAuthGuard);
router.get("/getAllSessions", sessionController.getAllSessions);
router.delete("/deleteSession/:id", sessionController.deleteSessions);
router.get("/getSessionById/:id", sessionController.getSessionById);
router.put("/joinSession/:id", sessionController.joinSession, menteeAuthGuard);
router.get("/mentorSessions/:id", sessionController.getSessionsByMentorId);
router.put(
  "/startSession/:id",
  sessionController.startSession,
  mentorAuthGuard
);
router.put("/endCall/:id", sessionController.endCall, mentorAuthGuard);
module.exports = router;
