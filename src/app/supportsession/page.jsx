// 'use client';
// import { useState } from "react";

// export default function VidyaSetuSupportSession() {
//   const [newMessage, setNewMessage] = useState("");
//   const [messages] = useState([
//     {
//       sender: "scribe",
//       text: "नमस्ते Rahul! I'm Dr. Anjali Patel. I understand you need help with Calculus Integration problems. Let's start with the fundamentals.",
//       time: "10:30 AM",
//     },
//     {
//       sender: "user",
//       text: "Thank you, ma'am. I'm struggling with indefinite integrals, especially substitution methods for trigonometric functions.",
//       time: "10:32 AM",
//     },
//     {
//       sender: "scribe",
//       text: "Perfect, Rahul. Let's tackle that. For trigonometric substitutions, remember that:\n∫sin²(x) dx = ½[x - sin(x)cos(x)]",
//       time: "10:33 AM",
//     },
//     {
//       sender: "user",
//       text: "I see. Can we work through problem #5 from our textbook chapter on integration by parts?",
//       time: "10:35 AM",
//     },
//   ]);

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       setNewMessage("");
//       // In a real app, you would add the message to the messages array
//     }
//   };

//   const handleInputKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen text-black">
//       {/* Header */}
//       <header className="bg-blue-900 text-white text-center py-4 text-xl font-bold">
//         VidyaSetu Support Session
//       </header>

//       <div className="flex flex-grow">
//         {/* Left sidebar - Session details */}
//         <aside className="w-64 bg-white border-r border-gray-200">
//           <div className="bg-blue-900 text-white p-3 font-bold">
//             SESSION DETAILS
//           </div>
//           <div className="p-4 space-y-3">
//             <div>
//               <span className="font-bold">Scribe:</span> Dr. Anjali Patel
//             </div>
//             <div>
//               <span className="font-bold">Subject:</span> Mathematics (Class XII)
//             </div>
//             <div>
//               <span className="font-bold">Topic:</span> Calculus - Integration
//             </div>
//             <div>
//               <span className="font-bold">Duration:</span> 60 minutes
//             </div>
//             <div>
//               <span className="font-bold">Started:</span> 10:30 AM, 08-Apr-2025
//             </div>

//             {/* Call buttons */}
//             <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-6">
//               Audio Call
//             </button>
//             <button className="w-full bg-purple-600 text-white py-2 rounded-md">
//               Video Call
//             </button>
//             <button className="w-full border border-gray-300 bg-white text-gray-700 py-2 rounded-md">
//               Share Screen
//             </button>
//             <button className="w-full bg-red-500 text-white py-2 rounded-md">
//               End Session
//             </button>

//             {/* Session ID and recording notice */}
//             <div className="text-sm text-gray-500 mt-6">
//               <div>Session ID: VDS-2025-04-08-001</div>
//               <div>This session is being recorded</div>
//               <div>for quality and training purposes</div>
//             </div>
//           </div>
//         </aside>

//         {/* Main chat area */}
//         <main className="flex-grow flex flex-col bg-gray-50 p-4">
//           <div className="flex-grow overflow-y-auto mb-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`max-w-md mb-4 ${
//                   message.sender === "user" ? "ml-auto" : ""
//                 }`}
//               >
//                 <div
//                   className={`p-3 rounded-lg ${
//                     message.sender === "user"
//                       ? "bg-green-100 text-gray-800"
//                       : "bg-blue-100 text-gray-800"
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//                 <div
//                   className={`text-xs text-gray-500 mt-1 ${
//                     message.sender === "user" ? "text-right" : ""
//                   }`}
//                 >
//                   {message.sender === "user"
//                     ? `You - ${message.time}`
//                     : `Dr. Anjali P - ${message.time}`}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Message input */}
//           <div className="flex items-center bg-white rounded-full border border-gray-300 pl-4 pr-1 py-1">
//             <input
//               type="text"
//               placeholder="Type your message here..."
//               className="flex-grow outline-none"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={handleInputKeyPress}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="bg-blue-900 text-white rounded-full w-10 h-10 flex items-center justify-center"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 className="w-5 h-5"
//               >
//                 <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
//               </svg>
//             </button>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// pages/videocall.js
// 'use client'
// import { useRef, useEffect, useState } from "react";
// import io from "socket.io-client";

// export default function VideoCall() {
//   const [partnerId, setPartnerId] = useState(null);
//   const [partnerObjectId, setPartnerObjectId] = useState(null);
//   const socketRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const pcRef = useRef(null);

//   useEffect(async() => {
//     // Determine which token to use.
//     // For a student, the token is stored under "studenttoken".
//     // For a scribe, the token is stored under "scribetoken".
//     const token =  request.cookies.get("studenttoken")?.value || request.cookies.get("scribetoken")?.value || "";
//     if (!token) {
//       console.error("No token found. Please log in as a student or scribe.");
//       return;
//     }

//     // Connect to Socket.IO with the token in the auth payload.
//     const socket = io({
//       path: "/api/socket",
//       auth: { token },
//     });
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       // When connected, indicate readiness to join a call.
//       socket.emit("join-call");
//     });

//     // When paired, the server sends "call-start" with the partner’s Socket.IO id and partner's id.
//     socket.on("call-start", ({ peerId, partnerObjectId }) => {
//       setPartnerId(peerId);
//       setPartnerObjectId(partnerObjectId);
//       startCall(peerId);
//     });

//     // Handle incoming signaling messages.
//     socket.on("signal", async ({ from, data }) => {
//       if (data.type === "offer") {
//         if (!pcRef.current) await initPeerConnection();
//         await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
//         const answer = await pcRef.current.createAnswer();
//         await pcRef.current.setLocalDescription(answer);
//         socket.emit("signal", { to: from, data: answer });
//       } else if (data.type === "answer") {
//         await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
//       } else if (data.candidate) {
//         try {
//           await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//         } catch (error) {
//           console.error("Error adding ICE candidate", error);
//         }
//       }
//     });

//     // Clean up when the component unmounts.
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // Initialize the RTCPeerConnection and add local video/audio tracks.
//   const initPeerConnection = async () => {
//     pcRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     // Get local media stream.
//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localVideoRef.current.srcObject = localStream;

//     // Add tracks to the connection.
//     localStream.getTracks().forEach((track) => {
//       pcRef.current.addTrack(track, localStream);
//     });

//     // When receiving remote media, attach it to remote video.
//     pcRef.current.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };

//     // When a new ICE candidate is available, send it to the partner.
//     pcRef.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socketRef.current.emit("signal", {
//           to: partnerId,
//           data: { candidate: event.candidate },
//         });
//       }
//     };
//   };

//   // Start the call by creating an offer and sending it to the partner.
//   const startCall = async (peerId) => {
//     if (!pcRef.current) await initPeerConnection();
//     const offer = await pcRef.current.createOffer();
//     await pcRef.current.setLocalDescription(offer);
//     socketRef.current.emit("signal", { to: peerId, data: offer });
//   };

//   return (
//     <div className="text-black" style={{ textAlign: "center" }}>
//       <h1>Omegle-Like Video Call</h1>
//       <p>
//         {partnerObjectId
//           ? `Connected with partner: ${partnerObjectId}`
//           : "Waiting for a partner..."}
//       </p>
//       <div style={{ display: "flex", justifyContent: "center" }}>
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           width="300"
//           style={{ margin: "10px", border: "1px solid #ccc" }}
//         />
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           width="300"
//           style={{ margin: "10px", border: "1px solid #ccc" }}
//         />
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useRef, useEffect, useState } from "react";
// import io from "socket.io-client";
// import Cookies from "js-cookie";
// import axios from "axios";


// export default function VideoCall() {
//   const [partnerId, setPartnerId] = useState(null);
//   const [partnerObjectId, setPartnerObjectId] = useState(null);
//   const socketRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const pcRef = useRef(null);

//   // useEffect(async() => {
//   //   // const token = Cookies.get("studenttoken")?.value || Cookies.get("scribetoken")?.value || "";
//   //   const req = await axios.post("/api/gettoken");
//   //   console.log(req.data,"tokens ")
//   //   const {token , decodedtoken} = req.data;
//   //   console.log(token,"tok")
//   //   if (!token) {
//   //     console.error("No token found. Please log in as a student or scribe.");
//   //     return;
//   //   }
   

//   //   const socket = io({
//   //     path: "/api/socket",
//   //     transports: ["websocket"], // 👈 Force WebSocket, avoids 405s on polling
//   //     auth: { token },
//   //   });
//   //   socketRef.current = socket;

//   //   socket.on("connect", () => {
//   //     socket.emit("join-call");
//   //   });

//   //   socket.on("call-start", ({ peerId, partnerObjectId }) => {
//   //     setPartnerId(peerId);
//   //     setPartnerObjectId(partnerObjectId);
//   //     startCall(peerId);
//   //   });

//   //   socket.on("signal", async ({ from, data }) => {
//   //     if (data.type === "offer") {
//   //       if (!pcRef.current) await initPeerConnection();
//   //       await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
//   //       const answer = await pcRef.current.createAnswer();
//   //       await pcRef.current.setLocalDescription(answer);
//   //       socket.emit("signal", { to: from, data: answer });
//   //     } else if (data.type === "answer") {
//   //       await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
//   //     } else if (data.candidate) {
//   //       try {
//   //         await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//   //       } catch (error) {
//   //         console.error("Error adding ICE candidate", error);
//   //       }
//   //     }
//   //   });

//   //   // Cleanup on unmount
//   //   return () => {
//   //     socket.disconnect();
//   //   };
//   // }, []);
//   useEffect(() => {
//     const setup = async () => {
//       try {
//         const req = await axios.post("/api/gettoken");
//         const { token } = req.data;
//         if (!token) {
//           console.error("No token found. Please log in as a student or scribe.");
//           return;
//         }
  
//         const socket = io({
//           path: "/api/socket",
//           transports: ["websocket"], // 👈 FIX
//           auth: { token },
//         });
  
//         socketRef.current = socket;
  
//         socket.on("connect", () => {
//           socket.emit("join-call");
//         });
  
//         socket.on("call-start", ({ peerId, partnerObjectId }) => {
//           setPartnerId(peerId);
//           setPartnerObjectId(partnerObjectId);
//           startCall(peerId);
//         });
  
//         socket.on("signal", async ({ from, data }) => {
//           if (data.type === "offer") {
//             if (!pcRef.current) await initPeerConnection();
//             await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
//             const answer = await pcRef.current.createAnswer();
//             await pcRef.current.setLocalDescription(answer);
//             socket.emit("signal", { to: from, data: answer });
//           } else if (data.type === "answer") {
//             await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
//           } else if (data.candidate) {
//             try {
//               await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//             } catch (error) {
//               console.error("Error adding ICE candidate", error);
//             }
//           }
//         });
//       } catch (err) {
//         console.error("Socket setup error:", err);
//       }
//     };
  
//     setup();
  
//     return () => {
//       if (socketRef.current) socketRef.current.disconnect();
//     };
//   }, []);
  
//   const initPeerConnection = async () => {
//     pcRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = localStream;
//     }
//     localStream.getTracks().forEach((track) => {
//       pcRef.current.addTrack(track, localStream);
//     });

//     pcRef.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     pcRef.current.onicecandidate = (event) => {
//       if (event.candidate && socketRef.current && partnerId) {
//         socketRef.current.emit("signal", {
//           to: partnerId,
//           data: { candidate: event.candidate },
//         });
//       }
//     };
//   };

//   const startCall = async (peerId) => {
//     if (!pcRef.current) await initPeerConnection();
//     const offer = await pcRef.current.createOffer();
//     await pcRef.current.setLocalDescription(offer);
//     socketRef.current.emit("signal", { to: peerId, data: offer });
//   };

//   return (
//     <div className="text-black" style={{ textAlign: "center" }}>
//       <h1>Omegle-Like Video Call</h1>
//       <p>
//         {partnerObjectId ? `Connected with partner: ${partnerObjectId}` : "Waiting for a partner..."}
//       </p>
//       <div style={{ display: "flex", justifyContent: "center" }}>
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           width={300}
//           style={{ margin: "10px", border: "1px solid #ccc" }}
//         ></video>
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           width={300}
//           style={{ margin: "10px", border: "1px solid #ccc" }}
//         ></video>
//       </div>
//     </div>
//   );
// }


"use client";

import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";

export default function VideoCall() {
  const [partnerId, setPartnerId] = useState(null);
  const [partnerObjectId, setPartnerObjectId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      try {
        console.log("Fetching token...");
        const req = await axios.post("/api/gettoken");
        console.log("Token response received");
        const { token } = req.data;
        
        if (!token) {
          console.error("No token found. Please log in as a student or scribe.");
          setConnectionStatus("Authentication failed. Please log in again.");
          return;
        }

        setConnectionStatus("Connecting to signaling server...");
        
        // Initialize socket connection
        const socket = io({
          // Using default endpoint (no path needed if endpoint is /api/socket.js)
          transports: ["websocket", "polling"], // Allow fallback to polling
          auth: { token },
        });
        
        socketRef.current = socket;

        // Connection status tracking
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          setConnectionStatus("Connected to server. Waiting for a partner...");
          socket.emit("join-call");
        });

        socket.on("connect_error", (err) => {
          console.error("Socket connection error:", err.message);
          setConnectionStatus(`Connection error: ${err.message}`);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          setConnectionStatus("Disconnected from server");
        });

        // Call handling
        socket.on("call-start", async ({ peerId, partnerObjectId }) => {
          console.log("Call start event received", peerId, partnerObjectId);
          setPartnerId(peerId);
          setPartnerObjectId(partnerObjectId);
          setConnectionStatus(`Connected with partner: ${partnerObjectId}. Establishing media connection...`);
          await startCall(peerId);
        });

        socket.on("signal", async ({ from, data }) => {
          console.log("Signal received from", from, data.type || "ICE candidate");
          
          try {
            if (data.type === "offer") {
              if (!pcRef.current) await initPeerConnection();
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
              const answer = await pcRef.current.createAnswer();
              await pcRef.current.setLocalDescription(answer);
              socket.emit("signal", { to: from, data: answer });
              setConnectionStatus("Media connection in progress...");
            } else if (data.type === "answer") {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(data));
              setConnectionStatus("Media connection established!");
            } else if (data.candidate) {
              try {
                if (pcRef.current && pcRef.current.remoteDescription) {
                  await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
              } catch (error) {
                console.error("Error adding ICE candidate", error);
              }
            }
          } catch (error) {
            console.error("Error handling signal:", error);
            setConnectionStatus(`Connection error: ${error.message}`);
          }
        });
      } catch (err) {
        console.error("Socket setup error:", err);
        setConnectionStatus(`Setup error: ${err.message}`);
      }
    };
  
    setup();
  
    // Cleanup function
    return () => {
      // Close peer connection
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      
      // Stop all media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      
      console.log("VideoCall component unmounted, resources cleaned up");
    };
  }, []);
  
  const initPeerConnection = async () => {
    try {
      console.log("Initializing peer connection");
      
      pcRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          // Add TURN servers for better connectivity through firewalls
          // {
          //   urls: 'turn:your-turn-server.com:3478',
          //   username: 'username',
          //   credential: 'password'
          // }
        ],
      });

      console.log("Requesting user media...");
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      console.log("User media obtained successfully");
      localStreamRef.current = localStream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        console.log("Local video source set");
      }
      
      // Add tracks to peer connection
      localStream.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track.kind);
        pcRef.current.addTrack(track, localStream);
      });

      // Set up remote track handler
      pcRef.current.ontrack = (event) => {
        console.log("Remote track received:", event.track.kind);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setConnectionStatus("Video call connected!");
        }
      };

      // ICE candidate handling
      pcRef.current.onicecandidate = (event) => {
        if (event.candidate && socketRef.current && partnerId) {
          console.log("ICE candidate generated, sending to partner");
          socketRef.current.emit("signal", {
            to: partnerId,
            data: { candidate: event.candidate },
          });
        }
      };
      
      // Connection state monitoring
      pcRef.current.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pcRef.current.iceConnectionState);
        if (pcRef.current.iceConnectionState === "failed" || 
            pcRef.current.iceConnectionState === "disconnected") {
          setConnectionStatus(`WebRTC connection issue: ${pcRef.current.iceConnectionState}`);
        }
      };
    } catch (error) {
      console.error("Error initializing peer connection:", error);
      setConnectionStatus(`Media error: ${error.message}. Please check camera/microphone permissions.`);
    }
  };

  const startCall = async (peerId) => {
    try {
      console.log("Starting call with peer:", peerId);
      if (!pcRef.current) await initPeerConnection();
      
      console.log("Creating offer");
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      
      console.log("Sending offer to peer");
      socketRef.current.emit("signal", { to: peerId, data: offer });
      setConnectionStatus("Sending connection offer to partner...");
    } catch (error) {
      console.error("Error starting call:", error);
      setConnectionStatus(`Call setup error: ${error.message}`);
    }
  };

  return (
    <div className="text-black p-4" style={{ textAlign: "center" }}>
      <h1 className="text-2xl font-bold mb-4">Video Call</h1>
      <p className="mb-4">{connectionStatus}</p>
      
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2 className="text-lg mb-2">Your Video</h2>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            width={350}
            height={263}
            style={{ border: "2px solid #ccc", borderRadius: "8px", backgroundColor: "#f0f0f0" }}
          ></video>
        </div>
        
        <div>
          <h2 className="text-lg mb-2">Partner's Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            width={350}
            height={263}
            style={{ border: "2px solid #ccc", borderRadius: "8px", backgroundColor: "#f0f0f0" }}
          ></video>
        </div>
      </div>
    </div>
  );
}