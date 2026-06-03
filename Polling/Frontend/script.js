const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");

const messagesContainer = document.getElementById("messages");

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";

const BASE_URL = "http://localhost:3002";

let messages = [];

joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) return;

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

    <div class="reactions">
      <button class="like-btn">👍 ${message.likes || 0}</button>
      <button class="dislike-btn">👎 ${message.dislikes || 0}</button>
    </div>
  `;

  div.querySelector(".like-btn").addEventListener("click", async () => {
    await fetch(`${BASE_URL}/messages/${message.id}/like`, {
      method: "POST",
    });
    fetchMessages();
  });

  
  div.querySelector(".dislike-btn").addEventListener("click", async () => {
    await fetch(`${BASE_URL}/messages/${message.id}/dislike`, {
      method: "POST",
    });
    fetchMessages();
  });

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


async function fetchMessages() {
  try {
    const res = await fetch(`${BASE_URL}/messages`);
    messages = await res.json();

    renderMessages();
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
}


function renderMessages() {
  messagesContainer.innerHTML = "";

  messages.forEach((msg) => {
    addMessage(msg, msg.username === currentUser ? "outgoing" : "incoming");
  });
}


function startPolling() {
  fetchMessages();

  setInterval(() => {
    fetchMessages();
  }, 1000);
}


sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      username: currentUser,
      senderId: "client",
    }),
  });

  input.value = "";
  fetchMessages();
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
