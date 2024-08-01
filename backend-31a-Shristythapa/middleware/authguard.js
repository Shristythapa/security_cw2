const jwt = require("jsonwebtoken");

const isMentor = (req, res, next) => {
  const token = req.cookies.cookieHTTP;

  if (!token) {
    return res.json({ message: "Authentication failed: Token not found" });
  }

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ message: "Authentication failed: Invalid token" });
    }

    if (decoded.isMentor) {
      req.user = decoded;
      next();
    } else {
      return res.json({ message: "Access denied: Requires Mentor role" });
    }
  });
};

const isMentee = (req, res, next) => {
  const token = req.cookies.cookieHTTP;

  if (!token) {
    return res.json({ message: "Authentication failed: Token not found" });
  }

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ message: "Authentication failed: Invalid token" });
    }

    if (!decoded.isMentor) {
      req.user = decoded;
      next();
    } else {
      return res.json({ message: "Access denied: Requires Mentee role" });
    }
  });
};

module.exports = { isMentor, isMentee };
