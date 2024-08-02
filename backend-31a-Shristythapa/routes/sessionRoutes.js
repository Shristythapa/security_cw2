const router = require("express").Router();
const sessionController = require("../controllers/sessionController");
const { isMentor } = require("../middleware/authguard");
const { isMentee } = require("../middleware/authguard");

router.post("/create", sessionController.createSession, isMentor);
router.get("/getAllSessions", sessionController.getAllSessions);
router.post("/deleteSession/:id", sessionController.deleteSessions, isMentor);
router.get("/getSessionById/:id", sessionController.getSessionById);
router.put("/joinSession/:id", sessionController.joinSession, isMentee, isMentee);
router.get("/mentorSessions/:id", sessionController.getSessionsByMentorId);
router.put("/startSession/:id",sessionController.startSession,isMentor);
router.put("/endCall/:id", sessionController.endCall, isMentor);
module.exports = router;


