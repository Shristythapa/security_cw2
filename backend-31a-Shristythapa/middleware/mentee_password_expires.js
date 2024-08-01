const Mentee = require("../model/mentee");

const checkPasswordExpirationMentee = async (req, res, next) => {
  const { email } = req.body;

  // Ensure email is provided
  if (!email) {
    return res.json({
      success: false,
      message: "Email is required.",
    });
  }

  try {
    const mentee = await Mentee.findOne({ email: email }); // Assuming Mentee is a model you've defined

    if (!mentee) {
      return res.status(404).json({
        success: false,
        message: "Mentee not found.",
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  checkPasswordExpirationMentee,
};
