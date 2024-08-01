import { Outlet } from "react-router-dom";
import MentorNavbar from "./MentorNavbar";
import { useLocation } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";
const MentorDashboard = () => {
  const location = useLocation();
  const { user } = location.state || {};
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
