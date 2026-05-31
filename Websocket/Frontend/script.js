const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");

const messagesContainer = document.getElementById("messages");

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";
let socket = null;


function connectSocket() {
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);


    if (data.command === "chat-history") {
      messagesContainer.innerHTML = "";

      data.messages.forEach((msg) => {
        addMessage(msg, msg.username === currentUser ? "outgoing" : "incoming");
      });
    }