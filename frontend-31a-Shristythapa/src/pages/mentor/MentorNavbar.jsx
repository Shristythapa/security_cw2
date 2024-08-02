import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useUser } from "../../context/UserContext";
import { logout } from "../../Api/Api";

const MentorNavbar = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light justify-content-between p-3"
        style={{ backgroundColor: "#8535A1", maxWidth: "100vw" }}
      >
        <div className="mr-auto">
          <a
            className="navbar-brand"
            href="#"
            style={{ color: "#EEA025", fontSize: "30px" }}
          >
            Mentorship
          </a>
        </div>
        <div className="ms-auto container  justify-content-between w-80">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0 me-5">
            <li className="nav-item me-5">
              <Link
                to={"/mentor/mentorSessionDashboard"}
                className="nav-link"
                style={{ color: "#EEA025", fontSize: "20px" }}
              >
                Sessions
              </Link>
            </li>

            <li className="nav-item me-5">
              <Link
                to={"/mentor/mentorArticleDashboard"}
                className="nav-link"
                style={{ color: "#EEA025", fontSize: "20px" }}
              >
                Articles
              </Link>
            </li>
          </ul>
          <div className="dropdown  ">
            <a
              href="#"
              className="d-flex align-items-center text-black text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={
                  user
                    ? user.profileUrl
                    : "https://www.google.com/imgres?q=how%20can%20i%20persist%20user%20information%20through%20a%20session%20react&imgurl=https%3A%2F%2Fcms-assets.tutsplus.com%2Fcdn-cgi%2Fimage%2Fwidth%3D600%2Fuploads%252Fusers%252F48%252Fposts%252F25180%252Fimage-1451577414907.jpg&imgrefurl=https%3A%2F%2Fcode.tutsplus.com%2Fdata-persistence-and-sessions-with-react--cms-25180t&docid=fHk_O2g9CtYgqM&tbnid=GvMLdTcvkz60lM&vet=12ahUKEwjJxPGfmNOHAxVMRmcHHdNhB1AQM3oECGgQAA..i&w=600&h=300&hcb=2&ved=2ahUKEwjJxPGfmNOHAxVMRmcHHdNhB1AQM3oECGgQAA"
                }
                alt="hugenerd"
                width="50"
                height="50"
                className="rounded-circle"
              ></img>
              <span
                className="d-none d-sm-inline mx-1"
                style={{ color: "#EEA025", fontSize: "20px" }}
              >
                {user ? user.name : "Loading..."}
              </span>
            </a>
            <ul className="dropdown-menu dropdown-menu-light text-small shadow">
              <li>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MentorNavbar;
