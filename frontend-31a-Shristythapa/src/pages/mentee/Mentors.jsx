import React, { useEffect, useState } from "react";
import { getAllMentorsApi } from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../assets/css/dropdown.css";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    getAllMentorsApi().then((res) => {
      if (res.data.success === false) {
        return toast.error(res.data.message);
      }
      setMentors(res.data.mentors);
    });
  }, []);

  const viewMentor = (data) => {
    navigate(`/mentee/mentorPublicProfileForMentee/${data._id}`, {
      state: data._id,
    });
  };
  const handleRemoveFilter = () => {
    setSelectedSkill("");
  };
  const allSkills = mentors.reduce((skills, mentor) => {
    mentor.mentorProfileInformation.skills.forEach((skill) => {
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    });
    return skills;
  }, []);

  const filteredMentors = selectedSkill
    ? mentors.filter((mentor) =>
        mentor.mentorProfileInformation.skills.includes(selectedSkill)
      )
    : mentors;

  return (
    <div
      className="col py-3"
      style={{ backgroundColor: "#f7f8fc", color: "#EEA025" }}
    >
      <div className="p-2">
        <div className=" d-flex justify-content-between align-items-center">
          <h2
            style={{ color: "#EEA025", fontSize: "28px", fontWeight: "bolder" }}
          >
            Mentors
          </h2>
          <div className="col-2 text-end">
            {/* Dropdown menu for selecting skill */}
            <div className="dropdown me-5 ">
              <button className="dropbtn px-4">Select Skill</button>
              <div className="dropdown-content">
                <span className="dropdown-item" onClick={handleRemoveFilter}>
                  Remove Filter
                </span>

                {allSkills.map((skill, index) => (
                  <span key={index} onClick={() => setSelectedSkill(skill)}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="row gy-4">
            {filteredMentors.map((mentor) => (
              <div className="col-md-3 col-sm-12" key={mentor._id}>
                <div
                  className="info-box card p-3 d-flex flex-column align-items-center border-0 shadow-sm"
                  onClick={() => {
                    viewMentor(mentor);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={mentor.profileUrl}
                    alt="hugenerd"
                    width="50"
                    height="50"
                    className="rounded-circle"
                  />
                  <h3>{mentor.mentorProfileInformation.firstName}</h3>
                  <p className="m-3">
                    {mentor.mentorProfileInformation.skills.map(
                      (skill, index) => (
                        <span
                          style={{ backgroundColor: "#772C91", color: "#fff" }}
                          className="badge m-1 p-2"
                          key={index}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
