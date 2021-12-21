const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { fetchUsers } = require("./utils");

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});

io.on("connection", (socket) => {
  io.emit("connection message", "A user connected...");

  // DISCONNECT
  socket.on("disconnect", () => {
    io.emit("disconnect message", "A user disconnected");
  });
  
  socket.on("set nickname", (nickname) => {
    socket.nickname = nickname;
  });

  // JOIN ROOM > LEAVE ROOM > CHAT MESSAGES TO ROOM
  socket.on("join room", async room => {
    socket.join(room);

    const numberOfUsers = await fetchUsers(io, room);
    io.to(room).emit("update people in room", numberOfUsers);

    socket.on("chat message", (msg) => {
      io.to(room).emit("chat message", msg, socket.nickname);
    });
  });

  socket.on("leave room", async room => {
    socket.leave(room)
    const numberOfUsers = await fetchUsers(io, room)

    io.to(room).emit("update people in room", numberOfUsers)
    io.to(room).emit("disconnect", room)
    io.emit("disconnect message", socket.nickname ? `${socket.nickname} has disconnected` : `${socket.id} has disconnected`);
  })
});
