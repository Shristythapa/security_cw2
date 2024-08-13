import { Outlet, Navigate } from "react-router-dom";
import MenteeNavbar from "./MenteeNavbar";
import { React, useEffect } from "react";
import { UserProvider } from "../../context/UserContext";
import { useState } from "react";
import axios from "axios";
const MenteeDashboard = () => {
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

  if (isMentor) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <UserProvider user={user}>
        <div className="container-fluid" style={{ width: "100vw" }}>
          <div className="row">
            {/* Navbar */}
            <MenteeNavbar></MenteeNavbar>
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

export default MenteeDashboard;
