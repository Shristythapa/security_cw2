import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { updateMenteePassword, updateMentorPassword } from "../Api/Api";
import { toast } from "react-toastify";
import { sanitizeInput } from "../components/sanitizeInput";
function UpdatePassword() {
  const [password, setPassword] = useState();
  const { id, token } = useParams();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
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
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();

    if (role == "mentor") {
      try {
        updateMentorPassword(id, token, { password: sanitizeInput(password) })
          .then((res) => {
            console.log("updated");
            console.log(res);
            if (res.data.success === true) {
              toast.success("Password Reset succesfull");
              navigate("/login");
            } else {
              toast.error(res.data.message);
              navigate("/login");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        toast.error(e.message);
      }
    } else if (role == "mentee") {
      try {
        console.log("update mentee password");
        updateMenteePassword(id, token, { password: sanitizeInput(password) })
          .then((res) => {
            console.log("updated");
            console.log(res);
            if (res.data.success === true) {
              toast.success("Password Reset succesfull");
              navigate("/login");
            } else {
              toast.error(res.data.message);
              navigate("/login");
            }
          })
          .catch((err) => {
            console.log("update error :", err);
          });
      } catch (e) {
        console.log("update error :", e);
        toast.error(e.message);
      }
    } else {
      toast.error("Select Your Role");
    }
  };

  return (
    <div
      style={{ backgroundColor: "#FDFBFF" }}
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <div className="bg-white p-5 rounded w-25 card shadow border-0">
        <p className="text-start h2 fw-bold mb-4 mx-1 mx-md-3 mt-3">
          Update Password
        </p>
        <form>
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
          <div className="mb-3">
            <div className="input-group">
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

          <button
            onClick={handleSubmit}
            type="submit"
            className="btn  w-100 rounded-3 "
            style={{
              backgroundColor: "#111111",
              color: "#ffffff",
            }}
          >
            Change
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
