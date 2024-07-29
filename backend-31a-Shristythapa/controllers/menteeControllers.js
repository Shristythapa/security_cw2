const Mentees = require("../model/mentee");

const bycrypt = require("bcrypt");
const cloudainary = require("cloudinary");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const MenteePaswords = require("../model/passwordMentee");
const Mentee = require("../model/mentee");

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  ) {
    return true;
  }
  return false;
};

const signUpMentee = async (req, res) => {
  const { name, email, password } = req.body;
  const { profilePicture } = req.files;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields",
    });
  }

  const isPasswordValid = validatePassword(password);
  if (!isPasswordValid) {
    return res.json({
      success: false,
      message:
        "Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  if (!profilePicture) {
    return res.status(400).json({
      success: false,
      message: "Please upload Image",
    });
  }

  try {
    const generatedSalt = await bycrypt.genSalt(10);
    const encryptedPassword = await bycrypt.hash(password, generatedSalt);

    const existingMentee = await Mentees.findOne({ email: email });
    if (existingMentee) {
      console.log("user already exist");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const uploadedImage = await cloudainary.v2.uploader.upload(
      profilePicture.path,
      {
        folder: "Mentee",
        crop: "scale",
      }
    );

    const newMentee = new Mentees({
      name: name,
      email: email,
      password: encryptedPassword,
      profileUrl: uploadedImage.secure_url,
      passwordLastUpdated: Date.now(), 
    });

    await newMentee.save();

    // Check if the mentee already exists in MenteePasswords collection
    let passwordEntry = await MenteePaswords.findOne({
      userId: newMentee._id,
    });

    // If the entry does not exist, create a new one
    passwordEntry = new MenteePaswords({
      userId: newMentee._id,
      passwords: [encryptedPassword],
    });

    await passwordEntry.save();
    return res.status(200).json({
      success: true,
      message: "User created sucessfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Server error",
    });
  }
};

const loginMentee = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const mentee = await Mentees.findOne({ email: email }); //user stores all data of the users

    if (!mentee) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(mentee);

    const passwordToCompare = mentee.password;
    const isMatch = bycrypt.compare(password, passwordToCompare);

    if (!isMatch) {
      console.log("password doesn't match");
      return res.status(400).json({
        success: false,
        message: "Password dosen't match",
      });
    }
    console.log("password match");

    const token = jwt.sign(
      { id: mentee._id, isMentor: false, email: mentee.email },
      process.env.JWT_TOKEN_SECRET
    );
    console.log("token", token);
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    res.cookie("cookieHTTP", token, cookieOptions);

    return res.status(200).json({
      success: true,
      mentee: mentee,
      message: "User loged in Sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const changePassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      message: "Enter email",
      success: false,
      status: 400,
    });
  }
  Mentees.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.json({
        message: "User not existed",
        success: false,
        status: 400,
      });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "2h",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testing99st@gmail.com",
        pass: "cohbyloqsegkxbeu",
      },
    });

    var mailOptions = {
      from: "thapashristy110@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `https://localhost:3000/resetMentorPassword/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ success: true, message: "Mail Send Unsucessful" });
      } else {
        return res.json({ success: true, message: "Mail" });
      }
    });
  });
};

const updatePassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!id || !password || !token) {
      return res
        .status(400)
        .json({ error: "User ID, password, and token are required" });
    }

    // Fetch all password records for the user
    const passwordRecords = await MenteePaswords.find({ userId: id });
    if (!passwordRecords || passwordRecords.length === 0) {
      return res.json({ error: "User not found" });
    }
    console.log(passwordRecords);

    // Verify JWT token
    jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
      if (err) {
        return res.json({ message: "Invalid or expired token" });
      }

      // Check if the new password matches any previous passwords
      for (const record of passwordRecords) {
        for (const oldPassword of record.passwords) {
          const match = await bycrypt.compare(password, oldPassword);
          if (match) {
            return res.json({ message: "Can't repeat previous passwords" });
          }
        }
      }

      // Hash the new password
      const generatedSalt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, generatedSalt);

      // Update the user's password
      await Mentee.findByIdAndUpdate(id, { password: hashedPassword });
      console.log("password updated");

      // Add the new hashed password to the password records
      for (const record of passwordRecords) {
        record.passwords.push(hashedPassword);
        await record.save();
      }

      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUpMentee,
  loginMentee,
  changePassword,
  updatePassword,
};
