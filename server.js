// /server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let onlineScribes = new Map();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    path: "/socket.io", // important!
    cors: {
      origin: "*", // replace with your frontend URL in prod
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("register", (userData) => {
        console.log(userData, "userdataa")
      console.log(`User registered: ${userData.role} - ${userData.id}`);
      if (userData.role === "Scribe") {
        onlineScribes.set(userData.id, {
          id: userData.id,
          socketId: socket.id,
          aadhaar: userData.aadhaar,
          status: "available",
          date : userData.date,
          class : userData.class
        });
        io.emit("scribes-online", Array.from(onlineScribes.values()));
      }
    });

    socket.on("disconnect", () => {
      for (const [id, data] of onlineScribes.entries()) {
        if (data.socketId === socket.id) {
          onlineScribes.delete(id);
          break;
        }
      }
      io.emit("scribes-online", Array.from(onlineScribes.values()));
    });

    // socket.on("join-room", (roomId, userData) => {
    //   socket.join(roomId);
    //   console.log(`User ${userData.id} joined room ${roomId}`);
    //   if (userData.role === "Scribe" && onlineScribes.has(userData.id)) {
    //     onlineScribes.get(userData.id).status = "in-call";
    //     io.emit("scribes-online", Array.from(onlineScribes.values()));
    //   }
    //   socket.to(roomId).emit("user-joined", userData);
    // });

    socket.on("join-room", (roomId, userData) => {
        socket.join(roomId);
        console.log(`[JOIN-ROOM] ${userData.role} (${userData.id}) joined room ${roomId}`);
        
        // Broadcast to all others in the room (do not send back to yourself)
        socket.broadcast.to(roomId).emit("user-joined", userData);
      });

      socket.on('chat-message', ({ roomId, message }) => {
        socket.to(roomId).emit('chat-message', message);
      });
      
      socket.on("call-request", (data) => {
        // data should include roomId, target (scribe id), and from (student data)
        const { roomId, target, from } = data;
        console.log(`[CALL REQUEST] Student ${from.id} calling scribe ${target} in room ${roomId}`);
        
        // Find the scribe's socket from the onlineScribes map
        const scribeInfo = onlineScribes.get(target);
        if (scribeInfo) {
          // Send a "call-invite" directly to the scribe's socket
          io.to(scribeInfo.socketId).emit("call-invite", { roomId, from });
        } else {
          console.log("Target scribe not found or offline.");
        }
      });
  
    socket.on("leave-room", (roomId, userData) => {
      socket.leave(roomId);
      console.log(`User ${userData.id} left room ${roomId}`);
      if (userData.role === "Scribe" && onlineScribes.has(userData.id)) {
        onlineScribes.get(userData.id).status = "available";
        io.emit("scribes-online", Array.from(onlineScribes.values()));
      }
      socket.to(roomId).emit("user-left", userData);
    });

    socket.on("offer", (offer, roomId, toUserId) => {
      socket.to(roomId).emit("offer", offer, socket.id);
    });

    socket.on("answer", (answer, roomId) => {
      socket.to(roomId).emit("answer", answer, socket.id);
    });

    socket.on("ice-candidate", (candidate, roomId) => {
      socket.to(roomId).emit("ice-candidate", candidate, socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT,() => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
