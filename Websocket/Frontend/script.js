const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const joinBtn = document.getElementById("joinBtn");

const messagesContainer = document.getElementById("messages");

const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";
let socket = null;

let messages = [];

function connectSocket() {
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    
    if (data.command === "chat-history") {
      messages = data.messages;
      renderMessages();
    }

    if (data.command === "new-message") {
      messages.push(data.message);
      renderMessages();
    }

    if (data.command === "message-updated") {
      const index = messages.findIndex(
        (m) => String(m.id) === String(data.message.id),
      );

      if (index !== -1) {
        messages[index] = data.message;
        updateMessageUI(data.message);
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

function renderMessages() {
  messagesContainer.innerHTML = "";
  messages.forEach(renderSingleMessage);
}


function renderSingleMessage(msg) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.classList.add(msg.username === currentUser ? "outgoing" : "incoming");

  div.dataset.id = msg.id;

  div.innerHTML = getMessageHTML(msg);

  attachEvents(div, msg);

  messagesContainer.appendChild(div);
}


function updateMessageUI(msg) {
  const el = document.querySelector(`[data-id="${msg.id}"]`);
  if (el) {
    el.innerHTML = getMessageHTML(msg);
    attachEvents(el, msg);
  }
}


function getMessageHTML(message) {
  return `
    <div class="msg-user">${message.username}</div>
    <div class="msg-text">${message.text}</div>
    <div class="msg-time">${message.timestamp}</div>

    <div class="reactions">
      <button class="like-btn">👍 ${message.likes || 0}</button>
      <button class="dislike-btn">👎 ${message.dislikes || 0}</button>
    </div>
  `;
}


function attachEvents(div, message) {
  div.querySelector(".like-btn").onclick = () => {
    socket.send(
      JSON.stringify({
        command: "like-message",
        messageId: message.id,
      }),
    );
  };

  div.querySelector(".dislike-btn").onclick = () => {
    socket.send(
      JSON.stringify({
        command: "dislike-message",
        messageId: message.id,
      }),
    );
  };
}
