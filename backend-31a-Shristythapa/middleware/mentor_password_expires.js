const Mentor = require("../model/mentor");

const checkPasswordExpirationMentor = async (req, res, next) => {
  console.log(req);
  const { email } = req.body;
  const mentor = await Mentor.findOne({ email: email }); //user stores all data of the users

  if (!mentor) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const now = new Date();
  const passwordLastUpdated = new Date(mentor.passwordLastUpdated);
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

module.exports = {
  checkPasswordExpirationMentor,
};
