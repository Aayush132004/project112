// // app/call/[roomId]/page.js
// 'use client';
// import { use } from 'react';
// import { useEffect, useRef, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import useSocket from '../../hooks/useSocket';
// import axios from 'axios';

// const ICE_SERVERS = {
//   iceServers: [
//     {
//       urls: 'stun:stun.l.google.com:19302'
//     },
//     {
//       urls: 'stun:stun1.l.google.com:19302'
//     }
//   ]
// };

// export default function CallRoom({ params }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   // const targetId = searchParams.get('target');
//   // const roomId = params.roomId;
//   const { roomId } = use(params);
//   const {targetId} = use(params);

//   console.log(roomId , "roomid")
  
//   const { socket, isConnected } = useSocket();
  
//   const [user, setUser] = useState(null);
//   const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
//   const [micActive, setMicActive] = useState(true);
//   const [cameraActive, setCameraActive] = useState(true);
  
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null);
  
//   // Get user data from token
//   useEffect(() => {
//     const getUserData = async () => {
//     //   try {
//     //     const res = await fetch('/api/token');
//     //     const data = await res.json();
        
//     //     if (data.decodedToken) {
//     //       setUser(data.decodedToken);
//     //     } else {
//     //       router.push('/login');
//     //     }
//     //   } catch (error) {
//     //     console.error('Error fetching user data:', error);
//     //   }
//     const type = await axios.post("/api/getanydata");
//     console.log(type , "type");
//     if(type.data == "Student"){
//     const res = await axios.post("/api/student/getdata");
//     if(res){
//     console.log(res.data.data, 'dash board data');
//     setUser(res.data.data);

//     }else{
//       alert("login first")
//     }
//     }else if(type.data == 'Scribe'){
//       const res = await axios.post("/api/scribe/getdata");
//       if(res){
//       console.log(res.data.data, 'dash board data');
//       setUser(res.data.data);

//     }else{
//       alert("Loginfirst")
//     }
//   }
// }
    
    
//     getUserData();
//   }, []);
  
//   // Setup socket listeners and WebRTC when user data is loaded
//   useEffect(() => {
//     if (!socket || !user || !roomId) return;
//     console.log('Setting up media. user:', user, 'roomId:', roomId, 'socket connected:', isConnected);

    
//     const setupMediaAndJoinRoom = async () => {
//       try {
//         // Get user media
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true
//         });
        
//         localStreamRef.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
        
//         // Join the room
//         // socket.emit('join-room', roomId, {
//         //   role: user.role,
//         //   id: user._id,
//         //   aadhaar: user.role === 'Student' ? user.aadhaarNumber : user.aadhaarNumber
//         // });

//         if (socket && user && roomId) {
//           console.log("Joining room", roomId, "as", user.role, user._id);
//           // Here we use the same user data, so both sides use the same roomId.
//           socket.emit("join-room", roomId, {
//             role: user.role,
//             id: user._id,         // Make sure this matches what you use in the server (not user.id if your id is stored as _id)
//             aadhaar: user.aadhaarNumber
//           });
//         }
        
//         // Create peer connection after joining room
//         createPeerConnection();
        
//         // Handle peer events
//         setupPeerEvents();
//       } catch (err) {
//         console.error('Failed to get media devices:', err);
//         alert('Failed to access camera or microphone. Please check your permissions.');
//         // router.push(user.role === 'Student' ? '/dashboard/student' : '/dashboard/scribe');
//       }
//     };
    
//     setupMediaAndJoinRoom();
    
//     // Clean up on component unmount
//     return () => {
//       cleanupBeforeLeaving();
//     };
    
//   }, [socket, user, roomId]);
  
//   const createPeerConnection = () => {
//     peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);
    
//     // Add local tracks to the connection
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => {
//         peerConnectionRef.current.addTrack(track, localStreamRef.current);
//       });
//     }
    
//     // Handle ICE candidates
//     peerConnectionRef.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate, roomId);
//       }
//     };
    
//     // Handle incoming tracks
//     peerConnectionRef.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//       setCallStatus('connected');
//     };
    
//     return peerConnectionRef.current;
//   };
  
//   const setupPeerEvents = () => {
//     if (!socket) return;
    
//     // When another user joins
//     socket.on('user-joined', async (userData) => {
//       console.log('User joined:', userData);
      
//       // If we're the initiator (student), create and send offer
//       if (user.role === 'Student') {
//         try {
//           const offer = await peerConnectionRef.current.createOffer();
//           await peerConnectionRef.current.setLocalDescription(offer);
//           socket.emit('offer', offer, roomId);
//         } catch (error) {
//           console.error('Error creating offer:', error);
//         }
//       }
//     });
    
//     // When receiving an offer
//     socket.on('offer', async (offer, from) => {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await peerConnectionRef.current.createAnswer();
//         await peerConnectionRef.current.setLocalDescription(answer);
//         socket.emit('answer', answer, roomId);
//       } catch (error) {
//         console.error('Error handling offer:', error);
//       }
//     });
    
//     // When receiving an answer
//     socket.on('answer', async (answer) => {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//       } catch (error) {
//         console.error('Error handling answer:', error);
//       }
//     });
    
//     // When receiving ICE candidate
//     socket.on('ice-candidate', async (candidate) => {
//       try {
//         await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     });
    
//     // When user leaves
//     socket.on('user-left', () => {
//       endCall();
//     });
//   };
  
//   const toggleMediaStream = (type, state) => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         if (track.kind === type) {
//           track.enabled = !state;
//         }
//       });
//     }
//   };
  
//   const toggleMic = () => {
//     toggleMediaStream('audio', micActive);
//     setMicActive((prev) => !prev);
//   };
  
//   const toggleCamera = () => {
//     toggleMediaStream('video', cameraActive);
//     setCameraActive((prev) => !prev);
//   };
  
//   const cleanupBeforeLeaving = () => {
//     // Stop all tracks
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => track.stop());
//     }
    
//     // Close the peer connection
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }
    
//     // Leave the room
//     if (socket && user) {
//       socket.emit('leave-room', roomId, {
//         role: user.role,
//         id: user._id
//       });
//     }
    
//     // Remove all socket listeners
//     if (socket) {
//       socket.off('user-joined');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('ice-candidate');
//       socket.off('user-left');
//     }
//   };
  
//   const endCall = () => {
//     cleanupBeforeLeaving();
//     setCallStatus('ended');
    
//     // Navigate back after a brief delay
//     setTimeout(() => {
//       router.push(user?.role === 'student' ? '/studentdashboard' : '/scribedashboard');
//     }, 1000);
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <div className="flex-grow flex flex-col p-4">
//         <div className="mb-4">
//           <h1 className="text-2xl font-bold">
//             {callStatus === 'connecting' ? 'Connecting...' : 
//              callStatus === 'connected' ? 'Connected' : 'Call Ended'}
//           </h1>
//           <p className="text-gray-600">Room: {roomId}</p>
//         </div>
        
//         <div className="flex flex-col md:flex-row gap-4 flex-grow">
//           {/* Remote Video (Larger) */}
//           <div className="flex-grow bg-black rounded-lg relative overflow-hidden">
//             <video 
//               ref={remoteVideoRef} 
//               autoPlay 
//               playsInline
//               className="w-full h-full object-cover"
//             />
//             {callStatus === 'connecting' && (
//               <div className="absolute inset-0 flex items-center justify-center text-white">
//                 Waiting for the other participant...
//               </div>
//             )}
//           </div>
          
//           {/* Local Video (Smaller) */}
//           <div className="w-full md:w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
//             <video 
//               ref={localVideoRef} 
//               autoPlay 
//               playsInline 
//               muted
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>
//       </div>
      
//       {/* Controls */}
//       <div className="bg-white p-4 shadow-md flex justify-center space-x-4">
//         <button 
//           onClick={toggleMic} 
//           className={`p-3 rounded-full ${micActive ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}
//         >
//           {micActive ? 'Mic On' : 'Mic Off'}
//         </button>
        
//         <button 
//           onClick={toggleCamera} 
//           className={`p-3 rounded-full ${cameraActive ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}
//         >
//           {cameraActive ? 'Camera On' : 'Camera Off'}
//         </button>
        
//         <button 
//           onClick={endCall} 
//           className="p-3 rounded-full bg-red-600 text-white"
//         >
//           End Call
//         </button>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import Peer from 'peerjs';
// import { useRouter } from 'next/navigation';

// export default function CallRoom({ params }) {
//   const { roomId } = params;
//   const router = useRouter();

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerRef = useRef(null);
//   const callRef = useRef(null);

//   const [micActive, setMicActive] = useState(true);
//   const [cameraActive, setCameraActive] = useState(true);
//   const [callStatus, setCallStatus] = useState('connecting');

//   useEffect(() => {
//     const init = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localStreamRef.current = stream;
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       const peer = new Peer(roomId, {
//         host: '/',
//         port: 3000,
//         path: '/peerjs', // if using PeerServer
//       });

//       peerRef.current = peer;

//       peer.on('open', (id) => {
//         console.log('PeerJS ID:', id);
//       });

//       peer.on('call', (incomingCall) => {
//         incomingCall.answer(stream);
//         incomingCall.on('stream', (remoteStream) => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = remoteStream;
//             setCallStatus('connected');
//           }
//         });
//         callRef.current = incomingCall;
//       });

//       // Try calling other user (assuming you share same roomId)
//       const call = peer.call(roomId, stream);
//       if (call) {
//         call.on('stream', (remoteStream) => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = remoteStream;
//             setCallStatus('connected');
//           }
//         });
//         callRef.current = call;
//       }
//     };

//     init();

//     return () => {
//       localStreamRef.current?.getTracks().forEach(track => track.stop());
//       callRef.current?.close();
//       peerRef.current?.destroy();
//     };
//   }, [roomId]);

//   const toggleMic = () => {
//     localStreamRef.current?.getAudioTracks().forEach(track => (track.enabled = !micActive));
//     setMicActive(!micActive);
//   };

//   const toggleCamera = () => {
//     localStreamRef.current?.getVideoTracks().forEach(track => (track.enabled = !cameraActive));
//     setCameraActive(!cameraActive);
//   };

//   const endCall = () => {
//     callRef.current?.close();
//     peerRef.current?.destroy();
//     router.push('/');
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-grow p-4">
//         <h1 className="text-xl font-bold mb-2">
//           {callStatus === 'connecting' ? 'Connecting...' : callStatus === 'connected' ? 'Connected' : 'Ended'}
//         </h1>
//         <p>Room: {roomId}</p>
//         <div className="flex gap-4 mt-4">
//           <div className="w-full h-64 bg-black">
//             <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
//           </div>
//           <div className="w-64 h-48 bg-gray-800">
//             <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//           </div>
//         </div>
//       </div>
//       <div className="bg-white p-4 flex justify-center space-x-4">
//         <button onClick={toggleMic} className={`p-2 rounded ${micActive ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
//           {micActive ? 'Mic On' : 'Mic Off'}
//         </button>
//         <button onClick={toggleCamera} className={`p-2 rounded ${cameraActive ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
//           {cameraActive ? 'Camera On' : 'Camera Off'}
//         </button>
//         <button onClick={endCall} className="p-2 rounded bg-red-600 text-white">
//           End Call
//         </button>
//       </div>
//     </div>
//   );
// }
//  /app/[roomId]/page.jsx
// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import Peer from 'peerjs';
// import { io } from 'socket.io-client';
// import { useRouter } from 'next/navigation';

// export default function CallRoom({ params }) {
//   const { roomId } = params;
//   const router = useRouter();

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerRef = useRef(null);
//   const callRef = useRef(null);
//   const socketRef = useRef(null);

//   const [micActive, setMicActive] = useState(true);
//   const [cameraActive, setCameraActive] = useState(true);
//   const [callStatus, setCallStatus] = useState('connecting');

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');

//   useEffect(() => {
//     const init = async () => {
//       // await fetch('/api/socket'); // ensure socket.io is initialized on backend

//       const socket = io({
//         path: '/socket.io',
//       });
//       socketRef.current = socket;

//       socket.emit('join-room', roomId);

//       socket.on('chat-message', (message) => {
//         setMessages((prev) => [...prev, { sender: 'peer', text: message }]);
//       });

//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localStreamRef.current = stream;
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       const peer = new Peer(roomId, {
//         host: '/',
//         port: 3000,
//         path: '/peerjs',
//       });

//       peerRef.current = peer;

//       peer.on('call', (incomingCall) => {
//         incomingCall.answer(stream);
//         incomingCall.on('stream', (remoteStream) => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = remoteStream;
//             setCallStatus('connected');
//           }
//         });
//         callRef.current = incomingCall;
//       });

//       const call = peer.call(roomId, stream);
//       if (call) {
//         call.on('stream', (remoteStream) => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = remoteStream;
//             setCallStatus('connected');
//           }
//         });
//         callRef.current = call;
//       }
//     };

//     init();

//     return () => {
//       localStreamRef.current?.getTracks().forEach(track => track.stop());
//       callRef.current?.close();
//       peerRef.current?.destroy();
//       socketRef.current?.disconnect();
//     };
//   }, [roomId]);

//   const toggleMic = () => {
//     localStreamRef.current?.getAudioTracks().forEach(track => (track.enabled = !micActive));
//     setMicActive(!micActive);
//   };

//   const toggleCamera = () => {
//     localStreamRef.current?.getVideoTracks().forEach(track => (track.enabled = !cameraActive));
//     setCameraActive(!cameraActive);
//   };

//   const endCall = () => {
//     callRef.current?.close();
//     peerRef.current?.destroy();
//     socketRef.current?.disconnect();
//     router.push('/');
//   };

//   const sendMessage = () => {
//     if (newMessage.trim()) {
//       socketRef.current.emit('chat-message', { roomId, message: newMessage });
//       setMessages((prev) => [...prev, { sender: 'me', text: newMessage }]);
//       setNewMessage('');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-grow p-4 grid grid-cols-3 gap-4">
//         <div className="col-span-2 space-y-4">
//           <h1 className="text-xl font-bold">{callStatus === 'connecting' ? 'Connecting...' : 'Connected'}</h1>
//           <p>Room: {roomId}</p>
//           <div className="w-full h-64 bg-black">
//             <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
//           </div>
//           <div className="w-64 h-48 bg-gray-800">
//             <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-4 shadow-md flex flex-col">
//           <h2 className="text-lg font-semibold mb-2">Chat</h2>
//           <div className="flex-1 overflow-y-auto mb-2 space-y-1 border rounded p-2">
//             {messages.map((msg, idx) => (
//               <div key={idx} className={`text-sm ${msg.sender === 'me' ? 'text-blue-600 text-right' : 'text-gray-700'}`}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-2">
//             <input
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//               className="flex-1 p-2 border rounded"
//               placeholder="Type message..."
//             />
//             <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-1 rounded">
//               Send
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-4 flex justify-center space-x-4">
//         <button onClick={toggleMic} className={`p-2 rounded ${micActive ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
//           {micActive ? 'Mic On' : 'Mic Off'}
//         </button>
//         <button onClick={toggleCamera} className={`p-2 rounded ${cameraActive ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
//           {cameraActive ? 'Camera On' : 'Camera Off'}
//         </button>
//         <button onClick={endCall} className="p-2 rounded bg-red-600 text-white">
//           End Call
//         </button>
//       </div>
//     </div>
//   );
// }
// app/call/[roomId]/page.js
// 'use client';
// import { use } from 'react';
// import { useEffect, useRef, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import useSocket from '../../hooks/useSocket';
// import axios from 'axios';

// const ICE_SERVERS = {
//   iceServers: [
//     {
//       urls: 'stun:stun.l.google.com:19302'
//     },
//     {
//       urls: 'stun:stun1.l.google.com:19302'
//     }
//   ]
// };

// export default function CallRoom({ params }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { roomId } = use(params);
//   const { targetId } = use(params);

//   const { socket, isConnected } = useSocket();

//   const [user, setUser] = useState(null);
//   const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
//   const [micActive, setMicActive] = useState(true);
//   const [cameraActive, setCameraActive] = useState(true);

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null);

//   // Get user data from token
//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const type = await axios.post("/api/getanydata");
//         console.log(type, "type");
//         if (type.data == "Student") {
//           const res = await axios.post("/api/student/getdata");
//           if (res) {
//             console.log(res.data.data, 'dashboard data');
//             setUser(res.data.data);
//           } else {
//             alert("Login first");
//           }
//         } else if (type.data == 'Scribe') {
//           const res = await axios.post("/api/scribe/getdata");
//           if (res) {
//             console.log(res.data.data, 'dashboard data');
//             setUser(res.data.data);
//           } else {
//             alert("Login first");
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     }

//     getUserData();
//   }, []);

//   // Setup socket listeners and WebRTC when user data is loaded
//   useEffect(() => {
//     if (!socket || !user || !roomId) return;

//     const setupMediaAndJoinRoom = async () => {
//       try {
//         // Debug: Log if media devices are detected
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         console.log("Detected media devices:", devices);

//         // Get user media
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true
//         });

//         localStreamRef.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }

//         // Join the room
//         if (socket && user && roomId) {
//           console.log("Joining room", roomId, "as", user.role, user._id);
//           socket.emit("join-room", roomId, {
//             role: user.role,
//             id: user._id,
//             aadhaar: user.aadhaarNumber
//           });
//         }

//         // Create peer connection after joining room
//         createPeerConnection();

//         // Handle peer events
//         setupPeerEvents();
//       } catch (err) {
//         console.error('Failed to get media devices:', err);
//         alert('Failed to access camera or microphone. Please check your permissions.');
//       }
//     };

//     setupMediaAndJoinRoom();

//     // Clean up on component unmount
//     return () => {
//       cleanupBeforeLeaving();
//     };

//   }, [socket, user, roomId]);

//   const createPeerConnection = () => {
//     peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);

//     // Add local tracks to the connection
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => {
//         peerConnectionRef.current.addTrack(track, localStreamRef.current);
//       });
//     }

//     // Handle ICE candidates
//     peerConnectionRef.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate, roomId);
//       }
//     };

//     // Handle incoming tracks
//     peerConnectionRef.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//       setCallStatus('connected');
//     };

//     return peerConnectionRef.current;
//   };

//   const setupPeerEvents = () => {
//     if (!socket) return;

//     // When another user joins
//     socket.on('user-joined', async (userData) => {
//       console.log('User joined:', userData);

//       // If we're the initiator (student), create and send offer
//       if (user.role === 'Student') {
//         try {
//           const offer = await peerConnectionRef.current.createOffer();
//           await peerConnectionRef.current.setLocalDescription(offer);
//           socket.emit('offer', offer, roomId);
//         } catch (error) {
//           console.error('Error creating offer:', error);
//         }
//       }
//     });

//     // When receiving an offer
//     socket.on('offer', async (offer, from) => {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await peerConnectionRef.current.createAnswer();
//         await peerConnectionRef.current.setLocalDescription(answer);
//         socket.emit('answer', answer, roomId);
//       } catch (error) {
//         console.error('Error handling offer:', error);
//       }
//     });

//     // When receiving an answer
//     socket.on('answer', async (answer) => {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//       } catch (error) {
//         console.error('Error handling answer:', error);
//       }
//     });

//     // When receiving ICE candidate
//     socket.on('ice-candidate', async (candidate) => {
//       try {
//         await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     });

//     // When user leaves
//     socket.on('user-left', () => {
//       endCall();
//     });
//   };

//   const toggleMediaStream = (type, state) => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         if (track.kind === type) {
//           track.enabled = !state;
//         }
//       });
//     }
//   };

//   const toggleMic = () => {
//     toggleMediaStream('audio', micActive);
//     setMicActive((prev) => !prev);
//   };

//   const toggleCamera = () => {
//     toggleMediaStream('video', cameraActive);
//     setCameraActive((prev) => !prev);
//   };

//   const cleanupBeforeLeaving = () => {
//     // Stop all tracks
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => track.stop());
//     }

//     // Close the peer connection
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }

//     // Leave the room
//     if (socket && user) {
//       socket.emit('leave-room', roomId, {
//         role: user.role,
//         id: user._id
//       });
//     }

//     // Remove all socket listeners
//     if (socket) {
//       socket.off('user-joined');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('ice-candidate');
//       socket.off('user-left');
//     }
//   };

//   const endCall = () => {
//     cleanupBeforeLeaving();
//     setCallStatus('ended');

//     // Navigate back after a brief delay
//     setTimeout(() => {
//       router.push(user?.role === 'Student' ? '/studentdashboard' : '/scribedashboard');
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <div className="flex-grow flex flex-col p-4">
//         <div className="mb-4">
//           <h1 className="text-2xl font-bold">
//             {callStatus === 'connecting' ? 'Connecting...' : 
//              callStatus === 'connected' ? 'Connected' : 'Call Ended'}
//           </h1>
//           <p className="text-gray-600">Room: {roomId}</p>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 flex-grow">
//           {/* Remote Video (Larger) */}
//           <div className="flex-grow bg-black rounded-lg relative overflow-hidden">
//             <video 
//               ref={remoteVideoRef} 
//               autoPlay 
//               playsInline
//               className="w-full h-full object-cover"
//             />
//             {callStatus === 'connecting' && (
//               <div className="absolute inset-0 flex items-center justify-center text-white">
//                 Waiting for the other participant...
//               </div>
//             )}
//           </div>

//           {/* Local Video (Smaller) */}
//           <div className="w-full md:w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
//             <video 
//               ref={localVideoRef} 
//               autoPlay 
//               playsInline 
//               muted
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="bg-white p-4 shadow-md flex justify-center space-x-4">
//         <button 
//           onClick={toggleMic} 
//           className={`p-3 rounded-full ${micActive ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}
//         >
//           {micActive ? 'Mic On' : 'Mic Off'}
//         </button>

//         <button 
//           onClick={toggleCamera} 
//           className={`p-3 rounded-full ${cameraActive ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}
//         >
//           {cameraActive ? 'Camera On' : 'Camera Off'}
//         </button>

//         <button 
//           onClick={endCall} 
//           className="p-3 rounded-full bg-red-600 text-white"
//         >
//           End Call
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';
import { use } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSocket from '../../hooks/useSocket';
import axios from 'axios';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function CallRoom({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { roomId } = use(params);
  const { socket, isConnected } = useSocket();

  const [user, setUser] = useState(null);
  const [callStatus, setCallStatus] = useState('connecting');
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  // Get user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const type = await axios.post("/api/getanydata");
        if (type.data === "Student") {
          const res = await axios.post("/api/student/getdata");
          setUser(res.data.data);
        } else if (type.data === "Scribe") {
          const res = await axios.post("/api/scribe/getdata");
          setUser(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (!socket || !user || !roomId) return;

    const setupMediaAndJoinRoom = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("join-room", roomId, {
          role: user.role,
          id: user._id,
          aadhaar: user.aadhaarNumber,
        });

        createPeerConnection();
        setupPeerEvents();
      } catch (err) {
        console.error("Media error:", err);
        alert("Camera/Mic access denied.");
      }
    };

    setupMediaAndJoinRoom();
    return () => cleanupBeforeLeaving();
  }, [socket, user, roomId]);

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);
    localStreamRef.current?.getTracks().forEach(track =>
      peerConnectionRef.current.addTrack(track, localStreamRef.current)
    );

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate, roomId);
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
      setCallStatus('connected');
    };
  };

  const setupPeerEvents = () => {
    socket.on("user-joined", async (remoteUser) => {
      console.log("User joined:", remoteUser);

      const isInitiator = user._id.localeCompare(remoteUser.id) === 1;
      if (isInitiator) {
        if (!peerConnectionRef.current) createPeerConnection();
        try {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit("offer", offer, roomId);
          console.log("Sent offer");
        } catch (err) {
          console.error("Offer error:", err);
        }
      }
    });

    socket.on("offer", async (offer, from) => {
      console.log("Received offer");
      if (!peerConnectionRef.current) createPeerConnection();
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("answer", answer, roomId);
        console.log("Sent answer");
      } catch (err) {
        console.error("Offer handle error:", err);
      }
    });

    socket.on("answer", async (answer) => {
      console.log("Received answer");
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error("Answer handle error:", err);
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("ICE candidate error:", err);
      }
    });

    socket.on("user-left", () => {
      if (callStatus === 'connected') {
        console.log("User left call");
        endCall();
      } else {
        console.warn("User left before connection was established.");
      }
    });
  };

  const toggleMediaStream = (type, state) => {
    localStreamRef.current?.getTracks().forEach((track) => {
      if (track.kind === type) track.enabled = !state;
    });
  };

  const toggleMic = () => {
    toggleMediaStream("audio", micActive);
    setMicActive(prev => !prev);
  };

  const toggleCamera = () => {
    toggleMediaStream("video", cameraActive);
    setCameraActive(prev => !prev);
  };

  const cleanupBeforeLeaving = () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    socket?.emit("leave-room", roomId, {
      role: user?.role,
      id: user?._id,
    });

    socket?.off("user-joined");
    socket?.off("offer");
    socket?.off("answer");
    socket?.off("ice-candidate");
    socket?.off("user-left");
  };

  const endCall = () => {
    cleanupBeforeLeaving();
    setCallStatus("ended");
    setTimeout(() => {
      // router.push(user?.role === 'Student' ? "/studentdashboard" : "/scribedashboard");
      // alert(user?.role)
      if(user.role == 'Student'){
        router.push("/studentdashboard");
      }else{
        router.push('/scribedashboard');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex flex-col p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            {callStatus === 'connecting' ? 'Connecting...' : callStatus === 'connected' ? 'Connected' : 'Call Ended'}
          </h1>
          <p className="text-gray-600">Room: {roomId}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          <div className="flex-grow bg-black rounded-lg relative overflow-hidden">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {callStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Waiting for the other participant...
              </div>
            )}
          </div>

          <div className="w-full md:w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 shadow-md flex justify-center space-x-4">
        <button onClick={toggleMic} className={`p-3 rounded-full ${micActive ? 'bg-blue-600' : 'bg-red-600'} text-white`}>
          {micActive ? 'Mic On' : 'Mic Off'}
        </button>

        <button onClick={toggleCamera} className={`p-3 rounded-full ${cameraActive ? 'bg-blue-600' : 'bg-red-600'} text-white`}>
          {cameraActive ? 'Camera On' : 'Camera Off'}
        </button>

        <button onClick={endCall} className="p-3 rounded-full bg-red-600 text-white">
          End Call
        </button>
      </div>
    </div>
  );
}
