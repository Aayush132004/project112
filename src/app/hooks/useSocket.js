// // app/hooks/useSocket.js
// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';

// export default function useSocket() {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const socketInitialized = useRef(false);

//   useEffect(() => {
//     if (!socketInitialized.current) {
//       const socketInitializer = async () => {
//         await fetch('/api/socket');
        
//         const socketInstance = io();
        
//         socketInstance.on('connect', () => {
//           console.log('Socket connected!');
//           setIsConnected(true);
//         });
        
//         socketInstance.on('disconnect', () => {
//           console.log('Socket disconnected!');
//           setIsConnected(false);
//         });
        
//         setSocket(socketInstance);
//       };
      
//       try {
//         socketInitializer();
//         socketInitialized.current = true;
//       } catch (error) {
//         console.error('Socket initialization error:', error);
//       }
//     }
    
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   return { socket, isConnected };
// }
// /apps/hooks/useSocket.js
'use client';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (!socketInitialized.current) {
      const socketInstance = io({
        path: "/socket.io", // ensure it matches what you defined in your server.js
        transports: ['websocket'], // optional but good to avoid polling
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected!');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected!');
        setIsConnected(false);
      });

      setSocket(socketInstance);
      socketInitialized.current = true;
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return { socket, isConnected };
}
