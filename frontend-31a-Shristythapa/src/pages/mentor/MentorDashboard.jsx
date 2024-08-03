import { Outlet, Navigate } from "react-router-dom";
import MentorNavbar from "./MentorNavbar";
import { useLocation } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
const MentorDashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "https://localhost:5000/api/validate",
          {},
          { withCredentials: true }
        );

        if (response.data.valid) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          setIsMentor(response.data.user.isMentor);
        }
      } catch (error) {
        console.error("Failed to validate token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isMentor) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <UserProvider user={user}>
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            {/* <MenteeSidebar></MenteeSidebar> */}

            {/* Navbar */}
            <MentorNavbar></MentorNavbar>
          </div>

          {/* Main content */}
          <div
            className="row"
            style={{
              color: "#EEA025",
              minWidth: "100vw",
              minHeight: "100vh",
              backgroundColor: "#F7F8FC",
            }}
          >
            <div className="col">
              <Outlet></Outlet>
            </div>
          </div>
        </div>
      </UserProvider>
    </>
  );
};

export default MentorDashboard;
