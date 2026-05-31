const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");

const messagesContainer = document.getElementById("messages");

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";
let socket = null;
let messages = []; // ✅ IMPORTANT STATE

function connectSocket() {
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // CHAT HISTORY
    if (data.command === "chat-history") {
      messages = data.messages;
      renderMessages();
    }

    // NEW MESSAGE
    if (data.command === "new-message") {
      messages.push(data.message);
      renderMessages();
    }

    // UPDATED MESSAGE (likes/dislikes)
    if (data.command === "message-updated") {
      const index = messages.findIndex(
        (m) => String(m.id) === String(data.message.id),
      );

      if (index !== -1) {
        messages[index] = data.message;
        renderMessages();
      }
    }
  };
}

joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) return;

  currentUser = username;

  joinScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  connectSocket();
});

// SEND MESSAGE
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text || !socket) return;

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
}

// RENDER ALL MESSAGES
function renderMessages() {
  messagesContainer.innerHTML = "";

  messages.forEach((msg) => {
    addMessage(msg, msg.username === currentUser ? "outgoing" : "incoming");
  });
}

// CREATE MESSAGE UI
function addMessage(message, type = "incoming") {
  const div = document.createElement("div");

  div.classList.add("message", type);

  div.dataset.id = message.id; // ✅ IMPORTANT FIX

  div.innerHTML = `
    <div class="msg-user">${message.username}</div>
    <div class="msg-text">${message.text}</div>
    <div class="msg-time">${message.timestamp}</div>

    <div class="reactions">
      <button class="like-btn">👍 ${message.likes || 0}</button>
      <button class="dislike-btn">👎 ${message.dislikes || 0}</button>
    </div>
  `;

  // LIKE
  div.querySelector(".like-btn").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        command: "like-message",
        messageId: message.id,
      }),
    );
  });

  // DISLIKE
  div.querySelector(".dislike-btn").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        command: "dislike-message",
        messageId: message.id,
      }),
    );
  });

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
