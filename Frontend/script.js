const socket = io("http://localhost:3000");

const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");

const messagesContainer = document.getElementById("messages");

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";

joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();

  if (username === "") return;

  currentUser = username;

  joinScreen.classList.add("hidden");

  chatScreen.classList.remove("hidden");
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

  socket.emit("send-message", {
    text,
    username: currentUser,
    senderId: socket.id,
  });

  input.value = "";
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

socket.on("chat-history", (messages) => {
  messagesContainer.innerHTML = "";

  messages.forEach((msg) => {
    addMessage(msg, msg.username === currentUser ? "outgoing" : "incoming");
  });
});

socket.on("receive-message", (message) => {
  console.log("RECEIVED MESSAGE:", message);
  addMessage(
    message,
    message.username === currentUser ? "outgoing" : "incoming",
  );
});
