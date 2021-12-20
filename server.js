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

  socket.on("set nickname", (nickname) => {
    socket.nickname = nickname;
  });

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
  })
//   socket.on("disconnect", () => {
//     io.to(room).emit("disconnect message", "A user disconnected");
//   });
});
