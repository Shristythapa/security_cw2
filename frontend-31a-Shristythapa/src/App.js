import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MentorForm from "./pages/MentorForm";
import { ToastContainer } from "react-toastify";
import Landing from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import MenteeDashboard from "./pages/mentee/MenteeDashboard";
import Sessions from "./pages/mentee/Sessions";
import Mentors from "./pages/mentee/Mentors";
import "react-toastify/dist/ReactToastify.css";
import MentorSessions from "./pages/mentor/MentorSession";
import MentorPPForMentee from "./pages/mentee/MentorPPForMentee";
import MenteeArticles from "./pages/mentee/MenteeArticle";
import MentorArticles from "./pages/mentor/MentorArticles";
import ForgotPassword from "./pages/ChangePassword";
import UpdatePassword from "./pages/UpdatePassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import VideoCallMentor from "./pages/mentor/VideoCallMentor";
import VideoCallMentee from "./pages/mentee/VideoCallMentee";
import axios from "axios";
import AdminDashboard from "./pages/admin/adminDashboard";
import UserTable from "./pages/admin/mentorLog"
import MentorLog from "./pages/admin/mentorLog";
import MenteeLog from "./pages/admin/menteeLog";
library.add(faEnvelope, faLock);

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <ToastContainer></ToastContainer>

      <Routes>
        <Route
          path="/admin"
          element={<AdminDashboard></AdminDashboard>}
        ></Route>
        <Route path="/mentorLog/:id" element={<MentorLog></MentorLog>}></Route>
        <Route path="/menteeLog/:id" element={<MenteeLog></MenteeLog>}></Route>
        <Route path="/user" element={<UserTable></UserTable>}></Route>
        {/* public routes */}
        <Route path="/" element={<Landing></Landing>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/mentorForm" element={<MentorForm></MentorForm>}></Route>
        <Route
          path="/changePassword"
          element={<ForgotPassword></ForgotPassword>}
        ></Route>
        <Route
          path="/resetMentorPassword/:id/:token"
          element={<UpdatePassword></UpdatePassword>}
        ></Route>
        <Route
          path="/passwordResetSuccess"
          element={<PasswordResetSuccess></PasswordResetSuccess>}
        ></Route>
        {/* 
    
        {/* mentor routes */}
        <Route path="mentor" element={<MentorDashboard></MentorDashboard>}>
          <Route
            path="mentorSessionDashboard"
            element={<MentorSessions></MentorSessions>}
          ></Route>

          <Route
            path="mentorArticleDashboard"
            element={<MentorArticles></MentorArticles>}
          ></Route>
        </Route>

        {/* mentee routes */}
        <Route path="mentee" element={<MenteeDashboard></MenteeDashboard>}>
          <Route
            path="menteeSessionDashboard"
            element={<Sessions></Sessions>}
          ></Route>
          <Route
            path="menteeMentorDashboard"
            element={<Mentors></Mentors>}
          ></Route>
          <Route
            path="menteeArticleDashboard"
            element={<MenteeArticles></MenteeArticles>}
          ></Route>
          <Route
            path="mentorPublicProfileForMentee/:id"
            element={<MentorPPForMentee></MentorPPForMentee>}
          ></Route>
        </Route>
        <Route
          path="mentee_video_call/:id"
          element={<VideoCallMentee></VideoCallMentee>}
        ></Route>
        <Route
          path="mentor_video_call/:id"
          element={<VideoCallMentor></VideoCallMentor>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
