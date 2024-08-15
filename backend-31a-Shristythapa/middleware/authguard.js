const jwt = require("jsonwebtoken");

const isMentor = (req, res, next) => {
  console.log("auth guard", req.session.user);

  if (!req.session || !req.session.user) {
    return res.json({
      error: "Authentication error: No token found in session",
    });
  }

  const token = req.session.user;

  if (token.isMentor) {
    next();
  } else {
    return res.json({ message: "Access denied: Requires mentor role" });
  }
};

const isMentee = (req, res, next) => {
  console.log("auth guard", req.session.user);

  if (!req.session || !req.session.user) {
    return res.json({
      error: "Authentication error: No token found in session",
    });
  }

  const token = req.session.user;

  if (!token.isMentor) {
    next();
  } else {
    return res.json({ message: "Access denied: Requires mentee role" });
  }
};
const isAdmin = (req, res, next) => {
  console.log("auth guard", req.session.user);

  if (!req.session || !req.session.user || !req.session.user.isAdmin) {
    return res.json({
      error: "Authentication error: No token found in session",
    });
  }

  const token = req.session.user;

  if (token.isAdmin) {
    next();
  } else {
    return res.json({ message: "Access denied: Requires Admin role" });
  }
};

module.exports = { isMentor, isMentee, isAdmin };
