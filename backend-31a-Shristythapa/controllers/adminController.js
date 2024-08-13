const bycrypt = require("bcrypt");
const Admin = require("../model/adminModel");

const createDefaultAdmin = async () => {
  try {
    const defaultUsername = "s_admin@gmail.com"; // Default admin username
    const defaultPassword = "s_admin@!2**"; // Default admin password

    // Check if the default admin already exists
    const existingAdmin = await Admin.findOne({ username: defaultUsername });
    if (existingAdmin) {
      console.log("Default admin already exists");
      return;
    }

    // Hash the default password
    const hashedPassword = await bycrypt.hash(defaultPassword, 10);

    // Create the default admin
    const newAdmin = new Admin({
      username: defaultUsername,
      password: hashedPassword,
    });
    await newAdmin.save();

    console.log("Default admin created successfully");
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body)
  try {
    const admin = await Admin.findOne({ username: email });
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bycrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password " });
    }

    req.session.user = {
      id: admin._id,
      name: admin.name,
      username: admin.username,
      isAdmin: true,
    };

    res.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createDefaultAdmin,
  adminLogin,
};
