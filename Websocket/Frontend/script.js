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

    if (data.command === "new-message") {
      const msg = data.message;

      addMessage(msg, msg.username === currentUser ? "outgoing" : "incoming");
    }
  };
}

joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username === "") return;

  currentUser = username;

  joinScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  connectSocket();
});

function addMessage(message, type = "incoming") {
  const div = document.createElement("div");

  div.classList.add("message", type);

  div.innerHTML = `
    <div class="msg-user">${message.username}</div>
    <div class="msg-text">${message.text}</div>
    <div class="msg-time">${message.timestamp}</div>
  `;

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return;

  socket.send(
    JSON.stringify({
      command: "send-message",
      message: {
        text,
        username: currentUser,
        senderId: "client",
      },
    }),
  );

  input.value = "";
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
