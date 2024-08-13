const MenteeLog = require("../model/menteeLogModel");
const MentorLog = require("../model/mentorLogModel");

const logout = (req, res) => {
  const user = req.session.user;
  req.session.destroy(async (err) => {
    if (err) {
      console.log(err);
      return res.send("Failed to logout");
    }
    console.log(req.session);
    res.clearCookie("connect.sid");
    if (user.isMentor) {
      await MentorLog.updateOne(
        { mentorId: user.id },
        {
          $push: {
            logouts: new Date(),
          },
        },
        { upsert: true }
      );
    } else {
      await MenteeLog.updateOne(
        { menteeId: user.id },
        {
          $push: {
            logouts: new Date(),
          },
        },
        { upsert: true }
      );
    }
    res.send("Logout successful");
  });
};

const validateSession = (req, res) => {
  if (!req.session.user) {
    console.log("no session found");
    return res.json({ valid: false });
  }
  return res.json({
    valid: true,
    user: req.session.user,
  });
};

module.exports = {
  logout,
  validateSession,
};
