import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { createMenteeSignupApi, createMentorSignupApi } from "../Api/Api";
import sampleImage from "../assets/img/learning.avif";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
// ... (your existing imports)
import sampleProfile from "../assets/img/dummyProfileImage.jfif";
import { red } from "@mui/material/colors";
const Signup = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("Brunett");
  const [email, setEmail] = useState("brunett@gmail.com");
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [criteria, setCriteria] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setCriteria({
      length: password.length >= minLength && password.length < maxLength,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      number: hasNumber,
      specialChar: hasSpecialChar,
    });

    // Set password validity
    setIsPasswordValid(
      password.length >= minLength &&
        password.length < maxLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
  };

  const changePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };
  //make useState for image
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  //function for image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const navigate = useNavigate();

  const mentorForm = (username, email, password, profileImage) => {
    // console.log("profile image", profileImage);
    navigate("/mentorForm", {
      state: {
        username: username,
        email: email,
        password: password,
        profileImage: profileImage,
      },
    });
  };
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const changeName = (e) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log(name, email, password, profileImage);
    if (!isEmailValid) {
      toast.error("Invalid email format");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet the criteria");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePicture", profileImage);
    console.log(formData);

    // console.log("profile image", profileImage);
    // console.log(role);
    if (role === "mentee") {
      // console.log(formData);
      createMenteeSignupApi(formData)
        .then((res) => {
          if (res.data.success === false) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            navigate("/login");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          // console.log(err.message);
        });
    } else if (role === "mentor") {
      //route to mentor form page
      if (name || email || password || profileImage) {
        return mentorForm(name, email, password, profileImage);
      }
      toast.error("Enter all Feilds");
    } else {
      toast.error("Please Choose a role");
    }
  };

  return (
    <>
      <section
        id="hero"
        className="min-vh-100 hero d-flex align-items-center pt-4"
        style={{ backgroundColor: "#FDFBFF", overflowY: "auto" }}
      >
        <div className="container  h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div
                className="card text-black shadow "
                // data-aos="fade-up"
                style={{
                  boxShadow: "0 0 10px rgba(75, 1, 112, 0.1) !important",
                }}
              >
                <div className="card-body p-md-3">
                  <p className="text-center h2 fw-bold mb-4 mx-1 mx-md-3 mt-3">
                    Sign up
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <form className="mx-1 mx-md-3">
                        <div className="profile-avatar text-center">
                          <label
                            htmlFor="imageInput"
                            className="avatar-container"
                          >
                            {previewImage ? (
                              <img
                                className="avatar-img"
                                src={previewImage}
                                alt="Profile"
                              />
                            ) : (
                              <img
                                src={sampleProfile}
                                alt="sample"
                                className="avatar-img"
                              ></img>
                            )}
                          </label>
                          <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon
                            icon="person"
                            className="fa-lg me-3 fa-fw"
                          />
                          <select
                            onChange={(e) => setRole(e.target.value)}
                            class="form-select form-select-md mb-2 mt-3"
                            aria-label=".form-select-md example"
                          >
                            <option disabled selected>
                              Select Role
                            </option>
                            <option value="mentee">Mentee</option>
                            <option value="mentor">Mentor</option>
                          </select>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-3">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-lg me-2 fa-fw"
                          />
                          <div className="form-outline flex-fill mb-3">
                            <input
                              onChange={changeName}
                              type="text"
                              id="form3Example1c"
                              className="form-control form-control-sm"
                              placeholder="Enter name"
                              style={{ height: "40px" }}
                            />
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-3">
                          <span>
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              className="fa-lg me-2 fa-fw"
                            />
                          </span>
                          <div className="form-outline flex-fill mb-3">
                            <input
                              onChange={handleEmailChange}
                              type="email"
                              id="form3Example3c"
                              className="form-control form-control-sm"
                              placeholder="Enter Email"
                              style={{ height: "40px" }}
                            />
                            {!isEmailValid && (
                              <small className="text-danger">
                                Invalid email format
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span>
                                <FontAwesomeIcon
                                  icon={faLock}
                                  className="fa-lg me-2 fa-fw"
                                />
                              </span>
                            </div>
                            <input
                              onChange={changePassword}
                              type="password"
                              id="form3Example4c"
                              className="form-control"
                              placeholder="Enter Password"
                              aria-label="Password"
                              aria-describedby="basic-addon1"
                              style={{ height: "40px" }}
                            />
                          </div>
                          <div>
                            <ul>
                              <li
                                style={{
                                  color: criteria.length ? "green" : "red",
                                }}
                              >
                                Length Between 8-12 characters
                              </li>
                              <li
                                style={{
                                  color: criteria.upperCase ? "green" : "red",
                                }}
                              >
                                Contains an uppercase letter
                              </li>
                              <li
                                style={{
                                  color: criteria.lowerCase ? "green" : "red",
                                }}
                              >
                                Contains a lowercase letter
                              </li>
                              <li
                                style={{
                                  color: criteria.number ? "green" : "red",
                                }}
                              >
                                Contains a number
                              </li>
                              <li
                                style={{
                                  color: criteria.specialChar ? "green" : "red",
                                }}
                              >
                                Contains a special character (e.g., !, @, #, $)
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-3 mb-2 mb-lg-3">
                          <button
                            onClick={handleSubmit}
                            style={{
                              backgroundColor: "#111111",
                              color: "#ffffff",
                            }}
                            className="btn btn-md"
                          >
                            Register
                          </button>
                        </div>
                        <Link
                          to={"/Login"}
                          className="d-flex justify-content-center mx-3 mb-2 mb-lg-3"
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          <a>Already have an account?</a>
                        </Link>
                      </form>
                    </div>

                    <div className="col-md-9 col-lg-5 col-xl-6 d-flex align-items-center order-1 order-lg-1">
                      <Link to="/">
                        <img
                          width="500"
                          height="350"
                          src={sampleImage}
                          className="img-fluid"
                          alt="Sa mple "
                        ></img>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
