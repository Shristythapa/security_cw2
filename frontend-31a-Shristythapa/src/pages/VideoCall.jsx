import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import "../assets/css/style.css";
import { endCall, startCall } from "../Api/Api";
import { toast } from "react-toastify";
  
const VideoCallMentor = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { ROOM_ID } = state || {};
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [myVideoStream, setMyVideoStream] = useState(null);
  const myVideo = document.createElement("video");
  const videoGrid = useRef();


  useEffect(() => {
    let socket;
    try {
      socket = io("https://localhost:5000", {
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 20000,
        transports: ["websocket"],
      });
    } catch (error) {
      console.error("Error connecting to socket.io server:", error);
      toast.error("Unable to connect to the server. Please try again later.");
      return;
    }

    socket.on("connect_error", (error) => {
      if (error.message === "xhr poll error") {
        return;
      }
      console.error("Connection error:", error);
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
    console.log("ROOM ID", ROOM_ID);

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

    peer.on("open", (id) => {
      console.log("my id is" + id);
      socket.emit("join-room", ROOM_ID, id, user._id);
    });

    if (user._id === state.mentorId) {
      startCall(state._id);
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setMyVideoStream(stream);
        addVideoStream(myVideo, stream, user._id);
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

    const connectToNewUser = (userId, peer, stream) => {
      console.log("Calling user", userId);
      if (!document.querySelector(`video[data-peer-id="${userId}"]`)) {
        const call = peer.call(userId, stream);
        const video = document.createElement("video");

        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream, userId);
        });

        call.on("close", () => {
          video.remove();
        });
      }
    };

    const handleBeforeUnload = () => {
      socket.emit("disconnect");
      if (user._id === state.mentorId) {
        endCall(state._id);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.disconnect();
      peer.destroy();
      if (myVideoStream) {
        console.log("Stopping my video stream", myVideoStream);
        const videoTrack = myVideoStream.getVideoTracks()[0];
        const audioTrack = myVideoStream.getAudioTracks()[0];

        if (videoTrack) videoTrack.stop();
        if (audioTrack) audioTrack.stop();
      }
    };
  }, []);

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

  return (
    <div ref={videoGrid} className="video-grid">
      {/* Other UI components */}
      <button onClick={toggleVideoHandler}>
        {isVideoPaused ? "Resume Video" : "Pause Video"}
      </button>
      <button onClick={muteButtonHandler}>
        {isAudioMuted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
};

export default VideoCallMentor;
