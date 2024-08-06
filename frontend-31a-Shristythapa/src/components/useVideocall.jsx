import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const useVideoCall = (isMentor, state, user, endCall, startCall) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [myVideoStream, setMyVideoStream] = useState(null);
  const myVideo = useRef(document.createElement("video"));
  const videoGrid = useRef();
  const navigate = useNavigate();
  const [userr, setUserr] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("calling user", user);
    const socket = io("https://localhost:5000", {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000,
      transports: ["websocket"],
    });

    socket.on("connect_error", (error) => {
      if (error.message !== "xhr poll error") {
        toast.error(
          "Connection error. Please check your network or server status."
        );
      }
    });

    socket.on("reconnect_failed", () => {
      toast.error(
        "Reconnection attempts failed. Please refresh the page or try again later."
      );
    });

    myVideo.current.muted = true;

    const peer = new Peer({
      host: "localhost",
      port: 5000,
      path: "/peerjs",
      config: {
        iceServers: [
          { url: "stun:stun01.sipphone.com" },
          //... other STUN and TURN servers
        ],
      },
      debug: 3,
    });

    peer.on("open", async (id) => {
      await checkAuth();
      console.log(id);
      console.log(user);
      socket.emit("join-room", state, id, userr.id);
    });

    if (isMentor) {
      startCall(state);
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log("user", user);
        setMyVideoStream(stream);
        addVideoStream(myVideo.current, stream, user._id);

        peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });

        socket.on("user-disconnected", (userId) => {
          // Handle user disconnection
        });
      })
      .catch((error) => {
        handleMediaError(error);
      });

    const handleBeforeUnload = () => {
      socket.emit("disconnect");
      if (isMentor) {
        endCall(state._id);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.disconnect();
      peer.destroy();
      if (myVideoStream) {
        stopTracks(myVideoStream);
      }
    };
  }, []);
  const checkAuth = async () => {
    try {
      const response = await axios.post(
        "https://localhost:5000/api/validate",
        {},
        { withCredentials: true }
      );

      if (response.data.valid) {
        console.log("user ", response.data);
        console.log("user ", response.data.user);
        setUserr(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to validate token:", error);
    } finally {
      setLoading(false);
    }
  };

  const addVideoStream = (video, stream, peerId) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      video.setAttribute("data-peer-id", peerId);
      videoGrid.current.append(video);
    });
  };

  const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream, userId);
      toast.success(`${userId} joined`);
    });

    call.on("close", () => {
      video.remove();
    });
  };

  const handleMediaError = (error) => {
    if (["PermissionDeniedError", "NotAllowedError"].includes(error.name)) {
      toast.error(
        "Camera and microphone permissions are blocked. Please allow permissions to use video chat."
      );
    } else {
      toast.error("Media not found. Proceeding without media stream.");
    }
  };

  const stopTracks = (stream) => {
    stream.getTracks().forEach((track) => track.stop());
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
    if (myVideoStream) {
      stopTracks(myVideoStream);
      if (isMentor) {
        endCall(state._id);
      }
      navigate(-1);
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  return {
    videoGrid,
    myVideoStream,
    isAudioMuted,
    isVideoPaused,
    toggleVideoHandler,
    muteButtonHandler,
    callEnd,
  };
};

export default useVideoCall;
