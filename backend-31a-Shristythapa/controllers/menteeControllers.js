const Mentees = require("../model/mentee");

const bycrypt = require("bcrypt");
const cloudainary = require("cloudinary");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const signUpMentee = async (req, res) => {
  const { name, email, password } = req.body;
  const { profilePicture } = req.files;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
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
    });

    await newMentee.save();

    return res.status(200).json({
      success: true,
      message: "User created sucessfully.",
    });
  } catch (error) {
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
      return res.status(400).json({
        success: false,
        message: "Password dosen't match",
      });
    }

    const token = jwt.sign(
      { id: mentee._id, isMentor: false, email: mentee.email },
      process.env.JWT_TOKEN_SECRET
    );

    return res.status(200).json({
      success: true,
      token: token,
      mentee: mentee,
      message: "User loged in Sucessfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const changePassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Enter email",
      success: false,
    });
  }
  Mentees.findOne({ email: email }).then((user) => {
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not existed", success: false });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "1d",
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
      text: `http://localhost:3000/resetMentorPassword/${user._id}/${token}`,
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
  const { id, token } = req.params;
  const { password } = req.body;
  const generatedSalt = await bycrypt.genSalt(10);

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bycrypt
        .hash(password, generatedSalt)
        .then((hash) => {
          Mentees.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.json({ success: true }))
            .catch((err) => res.json({ success: false }));
        })
        .catch((err) => res.send({ success: false, message: err }));
    }
  });
};

module.exports = {
  signUpMentee,
  loginMentee,
  changePassword,
  updatePassword,
};
