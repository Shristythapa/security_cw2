
  const logout = (req,res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Failed to logout");
      }
      res.clearCookie("connect.sid"); 
      res.send("Logout successful");
    });
  };

const validateSession = (req,res) => {
  console.log(req.session.user);
  if (!req.session.user) {
    return res.status(401).json({ valid: false });
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
