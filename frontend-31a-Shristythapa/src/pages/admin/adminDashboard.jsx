import axios from "axios";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await axios.post(
  //         "https://localhost:5000/api/validate",
  //         {},
  //         { withCredentials: true }
  //       );
  //       console.log(response);

  //       if (response.data.valid) {
  //         setUser(response.data.user);
  //         setIsAuthenticated(true);
  //         if (response.data.user.isAdmin) {
  //           setIsAdmin(response.data.user.isAdmin);
  //         } 
  //       }
  //     } catch (error) {
  //       console.error("Failed to validate token:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  // if (isAdmin) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <>
      <div className="container-fluid" style={{ width: "100vw" }}>
        <Outlet />
      </div>
    </>
  );
};

export default AdminDashboard;
