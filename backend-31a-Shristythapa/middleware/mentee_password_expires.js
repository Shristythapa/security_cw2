const Mentee = require("../model/mentee");

const checkPasswordExpirationMentee = async (req, res, next) => {
  console.log(req);
  const { email } = req.body;
  const mentee = await Mentee.findOne({ email: email }); //mentee stores all data of the mentees

  if (!mentee) {
    return res.status(404).json({
      success: false,
      message: "mentee not found",
    });
  }

  const now = new Date();
  const passwordLastUpdated = new Date(mentee.passwordLastUpdated);
  const monthsDifference =
    now.getMonth() -
    passwordLastUpdated.getMonth() +
    12 * (now.getFullYear() - passwordLastUpdated.getFullYear());

  if (monthsDifference >= 3) {
    return res.status(401).json({
      success: false,
      message: "Password expired. Please update your password.",
    });
  }

  next();
};
const rateLimit = require("express-rate-limit");

const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too Many Request made. Please try after 15 min",
  standardHeaders: true,
  legacyHeaderr: false,
});
module.exports = {
  checkPasswordExpirationMentee,
  loginAccountLimiter
};
