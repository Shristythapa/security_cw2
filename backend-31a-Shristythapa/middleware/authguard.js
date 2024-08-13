const jwt = require("jsonwebtoken");

const isMentor = (req, res, next) => {
  console.log("auth guard", req.cookies.cookieHTTP);
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

const isAdmin = (req, res, next) => {
  console.log("is admining")
  if (res.cookies) {
    const token = req.cookies.cookieHTTP;
    if (!token) {
      return res.json({ message: "Authentication failed: Token not found" });
    }

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ message: "Authentication failed: Invalid token" });
      }

      if (decoded.isAdmin) {
        req.user = decoded;
        next();
      } else {
        return res.json({ message: "Access denied" });
      }
    });
  } else {
    console.log("not found")
    return res.json({ message: "Authentication failed: Token not found" });
  }
};

module.exports = { isMentor, isMentee, isAdmin };
