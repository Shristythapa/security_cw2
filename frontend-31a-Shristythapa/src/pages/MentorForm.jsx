// import backgroundImage from "../assets/img/formBackground.jpg";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createMentorSignupApi } from "../Api/Api";
import { toast } from "react-toastify";
import { sanitizeInput } from "../components/sanitizeInput";
const MentorForm = () => {
  const [tags, setTags] = useState([]);
  const [firstName, setFirstName] = useState("Brock");
  const [lastName, setLastName] = useState("Burnett");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("New york");
  const [inputValue, setInputValue] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  console.log(location);
  const handleAddTag = () => {
    if (!inputValue) return;
    setInputValue("");
    setTags([...tags, inputValue]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedUsername = sanitizeInput(location.state.username);
    const sanitizedEmail = sanitizeInput(location.state.email);
    const sanitizedPassword = sanitizeInput(location.state.password);
    const sanitizedProfileImage = location.state.profileImage;
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitisedAddress = sanitizeInput(address);

    const formData = new FormData();
    formData.append("name", sanitizedUsername);
    formData.append("email", sanitizedEmail);
    formData.append("password", sanitizedPassword);
    formData.append("profilePicture", sanitizedProfileImage);
    formData.append("firstName", sanitizedFirstName);
    formData.append("lastName", sanitizedLastName);
    formData.append("address", sanitisedAddress);
    tags.forEach((tag, index) => {
      formData.append(`skills[${index}]`, sanitizeInput(tag));
    });

    createMentorSignupApi(formData)
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
      });
  };

  const handleRemoveTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  return (
    <>
      <section>
        <div className="container">
          <div
            className="col-lg-12 col-xl-11 card text-black"
            style={{ borderRadius: "25px" }}
          >
            <div className="card text-black shadow">
              <div className=" card-body p-md-5">
                <div className="row align-items-center justify-content-start">
                  <div className="col-5 text-start h2 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                    Mentor form
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    id="form3Example1c"
                    className="form-control form-control-sm"
                    placeholder="Enter first name"
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    id="form3Example1c"
                    className="form-control form-control-sm"
                    placeholder="Enter last Name"
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <input
                    onChange={(e) => setDob(e.target.value)}
                    type="date"
                    id="form3Example1c"
                    className="form-control form-control-sm"
                    placeholder="Enter date of birth"
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <input
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    id="form3Example1c"
                    className="form-control form-control-sm"
                    placeholder="Address"
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <div className="container d-flex ">
                    <div className="col-md-11 col-lg-6 col-xl-7  d-flex align-items-center ">
                      <input
                        placeholder="Enter skill"
                        type="text"
                        className="form-control"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#111111",
                        color: "#ffffff",
                      }}
                      className="btn btn-md pl-pr-5 col-md-2 col-lg-2 col-xl-2  d-flex align-items-center mr-10 "
                      onClick={handleAddTag}
                    >
                      Add Tag
                    </button>
                  </div>
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        marginRight: "8px",
                        marginBottom: "8px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#000000",
                        color: "#fff",
                      }}
                    >
                      {tag}{" "}
                      <button
                        className="button"
                        onClick={handleRemoveTag.bind(null, index)}
                        style={{
                          backgroundColor: "#fff",
                          color: "#000",
                          border: "none",
                          padding: "4px 8px",
                          marginLeft: "4px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        X
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-center mx-3 mb-2 mb-lg-3">
                <button
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: "#111111",
                    color: "#ffffff",
                  }}
                  className="btn btn-md pl-pr-5"
                >
                  Submit
                </button>
              </div>
              <Link
                to={"/Signup"}
                style={{ color: "black", textDecoration: "none" }}
                className="d-flex justify-content-center mx-3 mb-2 mb-sm-3"
              ></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MentorForm;
