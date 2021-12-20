var socket = io();
var form1 = document.getElementById("form1");
var setNickname = document.getElementById("setNickname");
var nickname = document.getElementById("nickname");
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var room = document.getElementById("room");
var leaveRoom = document.getElementById("leaveRoom");
var roomLabel = document.getElementById("roomLabel")  

form1.addEventListener("submit", (e) => {
  e.preventDefault();
  if (nickname.value) {
    console.log("clicked");
    socket.emit("set nickname", nickname.value);
    setNickname.value = "";
  }
});

leaveRoom.addEventListener("click", (e) => {
  socket.emit("leave room", socket.id);
  clearMessages();
  console.log("leaving room");
});

form2.addEventListener("submit", (e) => {
  e.preventDefault();
  if (room.value) {
    socket.emit("join room", room.value);
    roomLabel.innerHTML("")
    clearMessages();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("connection message", (msg) => {
  var item = document.createElement("li");
  item.textContent = "A user has connected.";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("disconnect message", () => {
  var item = document.createElement("li");
  item.textContent = "A user has disconnected.";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("chat message", function (msg, nickname) {
  console.log(`${msg}`);

  var item = document.createElement("li");
  if (nickname) {
    item.textContent = `${nickname} says: ${msg}`;
  } else {
    item.textContent = `guest says: ${msg}`;
  }
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

const clearMessages = () => {
  while (messages.firstChild > 1) {
    messages.removeChild(messages.lastChild);
  }
};
