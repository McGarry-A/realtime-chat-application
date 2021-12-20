const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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

  socket.on("disconnect", () => {
    io.emit("disconnect message", "A user disconnected");
  });

  socket.on("join room", async (room) => {
    // FETCHES IDS OF USERS IN THAT ROOM
    const fetchUsers = async () => {
        try {
            const clientsInRoom = await io.in(room).allSockets();
            console.log(clientsInRoom.size)
            return clientsInRoom.size;
        } catch (error) {
            console.log(error);
        }
    };
    socket.join(room);

    const numberOfUsers = await fetchUsers();
    io.to(room).emit("update people in room", numberOfUsers);
    socket.on("chat message", (msg) => {
      io.to(room).emit("chat message", msg, socket.nickname);
    });
    console.log("user joined a new room: " + room);
  });

  socket.on("leave room", (id) => {
    console.log(`${id} has left the room`);
  });
});
