const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");

const messagesContainer = document.getElementById("messages");

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";

const BASE_URL = "http://localhost:3000";

joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username === "") return;

  currentUser = username;

  joinScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  startPolling();
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
