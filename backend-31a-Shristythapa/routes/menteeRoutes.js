const router = require("express").Router();
const menteeController = require("../controllers/menteeControllers");
const { loginAccountLimiter } = require("../middleware/ratelimit");
const {
  checkPasswordExpirationMentee,
} = require("../middleware/mentee_password_expires");

router.post("/signup", menteeController.signUpMentee);

router.post(
  "/login",
  checkPasswordExpirationMentee,
  loginAccountLimiter,
  menteeController.loginMentee
);
router.post("/forgotPassword", menteeController.changePassword);
router.post("/updatePassword/:id/:token", menteeController.updatePassword);
module.exports = router;
