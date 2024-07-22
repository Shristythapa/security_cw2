import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import sampleImage from "../assets/img/learning.avif";
import { loginMenteeApi, loginMentorApi } from "../Api/Api";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import reCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

      if (!isEmailValid) {
        toast.error("Invalid email format");
        return;
      }

    const data = {
      email: email,
      password: password,
    };

    if (role === "mentee") {
      loginMenteeApi(data)
        .then((res) => {
          console.log(res);
          if (res.data.success === false) {
            console.log("success false ");
            console.log(res.message);
            toast.error(res.message);
          } else {
            toast.success(res.data.message);

            //set token and user data in local storage
            localStorage.setItem("token", res.data.token);
            console.log(res);
            console.log(res.data.mentee);
            //set use await ref.read(spotifyViewModelProvider.notifier).login();r data
            const jsonDecode = JSON.stringify(res.data.mentee);
            localStorage.setItem("user", jsonDecode);
            localStorage.setItem("role", false);
            navigate("/mentee/menteeSessionDashboard");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err.message);
        });
    } else if (role === "mentor") {
      loginMentorApi(data)
        .then((res) => {
          console.log(res);
          if (res.data.success === false) {
            //add toast to show error message
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            //set token and user data in local storage
            localStorage.setItem("token", res.data.token);

            //set user data
            const jsonDecode = JSON.stringify(res.data.mentor);
            localStorage.setItem("user", jsonDecode);
            localStorage.setItem("role", true);
            navigate("/mentor/mentorSessionDashboard");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err.message);
        });
    } else {
      toast.error("Enter all items");
    }
  };

  return (
    <>
      <section
        id="hero"
        className="min-vh-100 hero d-flex align-items-center pt-4"
        style={{ backgroundColor: "#FDFBFF", overflowY: "auto" }}
      >
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div
                className="card text-black shadow"
                style={{
                  boxShadow: "0 0 10px rgba(75, 1, 112, 0.1) !important",
                }}
              >
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-7  d-flex align-items-center order-1 order-lg-1">
                      <Link to="/">
                        <img
                          width="500"
                          height="350"
                          src={sampleImage}
                          alt="Sample "
                        ></img>
                      </Link>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-2">
                      <p className="text-start h2 fw-bold mb-4 mx-1 mx-md-3 mt-3">
                        Login
                      </p>
                      <form className="mx-1 mx-md-3">
                        <div className="d-flex flex-row align-items-center mb-4">
                          <select
                            onChange={(e) => setRole(e.target.value)}
                            className="form-select form-select-md mb-2 mt-3"
                            aria-label=".form-select-md example"
                            defaultValue=""
                          >
                            <option disabled value="">
                              Select Role
                            </option>
                            <option value="mentee">Mentee</option>
                            <option value="mentor">Mentor</option>
                          </select>
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
                        <div className="d-flex flex-row align-items-center mb-3">
                          <span>
                            <FontAwesomeIcon
                              icon={faLock}
                              className="fa-lg me-2 fa-fw"
                            />
                          </span>
                          <div className="form-outline flex-fill mb-3">
                            <input
                              onChange={(e) => setPassword(e.target.value)}
                              type="password"
                              id="form3Example4c"
                              className="form-control form-control-sm"
                              placeholder="Enter Password"
                              style={{ height: "40px" }}
                            />
                          </div>
                        </div>
                        <reCAPTCHA
                          sitekey={"6Le5kOwpAAAAAM6y44lpyNqRD5E7eI58EfnUJKTR"}
                          ref={captchaRef}
                        />

                        <div className="d-flex justify-content-center mx-3 mb-2 mb-lg-3">
                          <button
                            onClick={handleSubmit}
                            style={{
                              backgroundColor: "#111111",
                              color: "#ffffff",
                            }}
                            className="btn btn-md pl-pr-5"
                          >
                            Login
                          </button>
                        </div>
                        <Link
                          to={"/Signup"}
                          style={{ color: "black", textDecoration: "none" }}
                          className="d-flex justify-content-center mx-3 mb-2 mb-sm-3"
                        >
                          Don't have an account?
                        </Link>
                        <Link
                          to={"/changePassword"}
                          style={{ color: "black", textDecoration: "none" }}
                          className="d-flex justify-content-center mx-3 mb-2 mb-sm-3"
                        >
                          Forgot password?
                        </Link>
                      </form>
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

export default Login;
