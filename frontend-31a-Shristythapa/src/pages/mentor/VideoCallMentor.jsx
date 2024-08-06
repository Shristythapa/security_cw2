import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import { endCall, startCall } from "../../Api/Api";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import axios from "axios";
const VideoCallMentor = () => {
  //get session id
  const navigate = useNavigate();
  const { state } = useLocation();

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const [myVideoStream, setMyVideoStream] = useState(null);

  const myVideo = document.createElement("video");

  const videoGrid = useRef();
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
          console.log(response.data.user);
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
    let socket;
    try {
      socket = io("https://localhost:5000", {
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 20000,
        transports: ["websocket"],
      });
    } catch (error) {
      // console.error("Error connecting to socket.io server:", error);
      toast.error("Unable to connect to the server. Please try again later.");
      return;
    }

    socket.on("connect_error", (error) => {
      if (error.message === "xhr poll error") {
        return;
      }
      // console.error("Connection error:", error);
      toast.error(
        "Connection error. Please check your network or server status."
      );
    });

    socket.on("reconnect_failed", () => {
      toast.error(
        "Reconnection attempts failed. Please refresh the page or try again later."
      );
    });

    myVideo.muted = true;
    console.log("rOOM ID", state);

    const peer = new Peer({
      host: "localhost",
      port: 5000,
      path: "/peerjs",
      config: {
        iceServers: [
          { url: "stun:stun01.sipphone.com" },
          { url: "stun:stun.ekiga.net" },
          { url: "stun:stunserver.org" },
          { url: "stun:stun.softjoys.com" },
          { url: "stun:stun.voiparound.com" },
          { url: "stun:stun.voipbuster.com" },
          { url: "stun:stun.voipstunt.com" },
          { url: "stun:stun.voxgratia.org" },
          { url: "stun:stun.xten.com" },
          {
            url: "turn:192.158.29.39:3478?transport=udp",
            credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
            username: "28224511:1379330808",
          },
          {
            url: "turn:192.158.29.39:3478?transport=tcp",
            credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
            username: "28224511:1379330808",
          },
        ],
      },

      debug: 3,
    });
    //peer and socket connections
    peer.on("open", (id) => {
      console.log("my id is" + id);
      socket.emit("join-room", state, id, user.id);
    });

    if (user.id === state) {
      // console.log("passed state", state);
      // console.log("starting session", user);
      startCall(state);
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setMyVideoStream(stream);
        addVideoStream(myVideo, stream, user.id);
        console.log("streaming");

        setupPeerCallHandling(peer, stream);
        setupSocketEvents(socket, peer, stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
        if (
          error.name === "PermissionDeniedError" ||
          error.name === "NotAllowedError"
        ) {
          toast.error(
            "Camera and microphone permissions are blocked. Please allow permissions to use video chat."
          );
        } else {
          toast.error("Media not found. Proceeding without media stream.");
        }

        setupPeerCallHandling(peer, null);
        setupSocketEvents(socket, peer, null);
      });

    const setupPeerCallHandling = (peer, stream) => {
      peer.on("call", (call) => {
        console.log("Incoming call", call);
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
    };

    const setupSocketEvents = (socket, peer, stream) => {
      socket.on("user-connected", (userId) => {
        console.log(userId, "user connected");
        connectToNewUser(userId, peer, stream);
      });

      socket.on("user-disconnected", (userId) => {
        console.log(userId, "disconnected");
      });
    };
    //function to handle user connectioned
    const connectToNewUser = (userId, stream) => {
      console.log("I call someone" + userId);

      if (!document.querySelector(`video[data-peer-id="${userId}"]`)) {
        const call = peer.call(userId, stream);
        const video = document.createElement("video");

        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream, userId);
          toast.success("New User Joined");
        });

        call.on("close", () => {
          video.remove();
        });
      }
    };

    const handleBeforeUnload = () => {
      // Emit a "disconnect" event to the server before leaving the page
      socket.emit("disconnect");

      endCall(state);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      console.log("page enddddd");
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Cleanup: Disconnect the socket when the component unmounts
      socket.disconnect();
      peer.destroy();
      endCall(state);
      // Stop video and audio tracks when leaving the page
      if (myVideoStream) {
        console.log("my video streem ", myVideoStream);
        const videoTrack = myVideoStream.getVideoTracks()[0];
        const audioTrack = myVideoStream.getAudioTracks()[0];

        if (videoTrack) videoTrack.stop();
        if (audioTrack) audioTrack.stop();
      }
    };
  }, [user, state]);

  const addVideoStream = (video, stream, peerId) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      video.setAttribute("data-peer-id", peerId); 
      videoGrid.current.append(video);
    });
  };

  const toggleVideoHandler = () => {
    if (myVideoStream) {
      const videoTrack = myVideoStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoPaused;
        setIsVideoPaused(!isVideoPaused);
      }
    }
  };

  const muteButtonHandler = () => {
    if (myVideoStream) {
      const audioTrack = myVideoStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioMuted;
        setIsAudioMuted(!isAudioMuted);
      }
    }
  };
  const callEnd = () => {
    console.log("Attempting to end call...");
    if (myVideoStream) {
      const videoTracks = myVideoStream.getVideoTracks();
      const audioTracks = myVideoStream.getAudioTracks();

      const stopPromises = [...videoTracks, ...audioTracks].map((track) =>
        track.stop()
      );

      Promise.all(stopPromises)
        .then(() => {
          console.log("Camera and microphone turned off successfully.");
          // Optional: Call the endCall function if the user is the mentor
          if (user.id === state.mentorId) {
            console.log("User is mentor. Ending call...");
            endCall(state);
            console.log("Call ended for mentor.");
          } else {
            console.log("User is not mentor. Skipping call end.");
          }
          // Perform any other cleanup operations if needed
          // ...

          // Navigate to the previous page
          console.log("Navigating to previous page...");
          navigate(-1);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          console.log("Navigation completed.");
        })
        .catch((error) => {
          console.error(
            "Error occurred while stopping tracks:",
            error.response.data.message
          );
          // Handle the error if necessary
        });
    } else {
      // Log an error if myVideoStream is not defined
      console.error("myVideoStream is not defined.");
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: "#501366" }} className="header">
        <div className="logo">
          <div className="header__back">
            <i className="fas fa-angle-left"></i>
          </div>
          <h3 style={{ fontFamily: "monospace" }}>Video Chat</h3>
        </div>
      </div>
      <div className="main">
        <div
          className="videos__group"
          style={{ minHeight: "100vh ", overflowY: "auto" }}
        >
          <div id="video-grid" ref={videoGrid}></div>
        </div>

        <div className="options" style={{ backgroundColor: "#501366" }}>
          <div className="options__left">
            <div
              style={{ backgroundColor: "#EEA025" }}
              id="stopVideo"
              onClick={muteButtonHandler}
              className="options__button"
            >
              {/* Your component content */}

              {isAudioMuted ? (
                <i class="bi bi-mic-mute-fill"></i>
              ) : (
                <i class="bi bi-mic-fill"></i>
              )}

              {/* <i class="bi bi-mic"></i> */}
            </div>
            <div
              style={{ backgroundColor: "#EEA025" }}
              id="muteButton"
              onClick={toggleVideoHandler}
              className="options__button"
            >
              {/* Your component content */}

              {isVideoPaused ? (
                <i class="bi bi-camera-video-off-fill"></i>
              ) : (
                <i class="bi bi-camera-video-fill"></i>
              )}

              {/* <i class="bi bi-camera-video"></i> */}
            </div>
            <div
              style={{ backgroundColor: "#EEA025" }}
              id="callEnd"
              onClick={callEnd}
              className="options__button"
            >
              <i class="bi bi-telephone-x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallMentor;
