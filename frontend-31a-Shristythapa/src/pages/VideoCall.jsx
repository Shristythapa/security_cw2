// import React from "react";
// import useVideoCall from "./../components/useVideocall";
// import { useLocation, useNavigate, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { endCall, startCall } from "./../Api/Api";
// import axios from "axios";
// const VideoCallMentee = () => {
//   const [user, setUser] = useState();
//   const { state } = useLocation();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const {
//     videoGrid,
//     myVideoStream,
//     isAudioMuted,
//     isVideoPaused,
//     toggleVideoHandler,
//     muteButtonHandler,
//     callEnd,
//   } = useVideoCall(false, state, user, endCall);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.post(
//           "https://localhost:5000/api/validate",
//           {},
//           { withCredentials: true }
//         );

//         if (response.data.valid) {
//           console.log("user data", response.data);
//           console.log("user effect", response.data.user);
//           setUser(response.data.user);
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         console.error("Failed to validate token:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     <div>
//       <div style={{ backgroundColor: "#501366" }} className="header">
//         <div className="logo">
//           <div className="header__back">
//             <i className="fas fa-angle-left"></i>
//           </div>
//           <h3 style={{ fontFamily: "monospace" }}>Video Chat</h3>
//         </div>
//       </div>
//       <div className="main">
//         <div
//           className="videos__group"
//           style={{ minHeight: "100vh ", overflowY: "auto" }}
//         >
//           <div id="video-grid" ref={videoGrid}></div>
//         </div>
//         <div className="options" style={{ backgroundColor: "#501366" }}>
//           <div className="options__left">
//             <div
//               id="stopVideo"
//               onClick={muteButtonHandler}
//               className="options__button"
//               style={{ backgroundColor: "#EEA025" }}
//             >
//               {isAudioMuted ? (
//                 <i className="bi bi-mic-mute-fill"></i>
//               ) : (
//                 <i className="bi bi-mic-fill"></i>
//               )}
//             </div>
//             <div
//               id="muteButton"
//               onClick={toggleVideoHandler}
//               className="options__button"
//               style={{ backgroundColor: "#EEA025" }}
//             >
//               {isVideoPaused ? (
//                 <i className="bi bi-camera-video-off-fill"></i>
//               ) : (
//                 <i className="bi bi-camera-video-fill"></i>
//               )}
//             </div>
//             <div
//               id="callEnd"
//               onClick={callEnd}
//               className="options__button"
//               style={{ backgroundColor: "#EEA025" }}
//             >
//               <i className="bi bi-telephone-x"></i>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const VideoCallMentor = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const [user, setUser] = useState();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.post(
//           "https://localhost:5000/api/validate",
//           {},
//           { withCredentials: true }
//         );

//         if (response.data.valid) {
//           console.log("user data", response.data);
//           console.log("user effect", response.data.user);
//           setUser(response.data.user);
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         console.error("Failed to validate token:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const {
//     videoGrid,
//     myVideoStream,
//     isAudioMuted,
//     isVideoPaused,
//     toggleVideoHandler,
//     muteButtonHandler,
//     callEnd,
//   } = useVideoCall(true, state, user, endCall, startCall);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     <div>
//       <div style={{ backgroundColor: "#501366" }} className="header">
//         <div className="logo">
//           <div className="header__back">
//             <i className="fas fa-angle-left"></i>
//           </div>
//           <h3 style={{ fontFamily: "monospace" }}>Video Chat</h3>
//         </div>
//       </div>
//       <div className="main">
//         <div
//           className="videos__group"
//           style={{ minHeight: "100vh ", overflowY: "auto" }}
//         >
//           <div id="video-grid" ref={videoGrid}></div>
//         </div>

//         <div className="options" style={{ backgroundColor: "#501366" }}>
//           <div className="options__left">
//             <div
//               style={{ backgroundColor: "#EEA025" }}
//               id="stopVideo"
//               onClick={muteButtonHandler}
//               className="options__button"
//             >
//               {/* Your component content */}

//               {isAudioMuted ? (
//                 <i class="bi bi-mic-mute-fill"></i>
//               ) : (
//                 <i class="bi bi-mic-fill"></i>
//               )}

//               {/* <i class="bi bi-mic"></i> */}
//             </div>
//             <div
//               style={{ backgroundColor: "#EEA025" }}
//               id="muteButton"
//               onClick={toggleVideoHandler}
//               className="options__button"
//             >
//               {/* Your component content */}

//               {isVideoPaused ? (
//                 <i class="bi bi-camera-video-off-fill"></i>
//               ) : (
//                 <i class="bi bi-camera-video-fill"></i>
//               )}

//               {/* <i class="bi bi-camera-video"></i> */}
//             </div>
//             <div
//               style={{ backgroundColor: "#EEA025" }}
//               id="callEnd"
//               onClick={callEnd}
//               className="options__button"
//             >
//               <i class="bi bi-telephone-x"></i>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { VideoCallMentee, VideoCallMentor };
