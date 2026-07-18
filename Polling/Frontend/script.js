// Update this after deploying your backend to Render
// Example:
// const BASE_URL = "https://your-app-name.onrender.com";
const BASE_URL = "http://localhost:3002";

const joinForm = document.getElementById("joinForm");
const chatForm = document.getElementById("chatForm");
const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");

const messagesContainer = document.getElementById("messages");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";
let messages = [];
let pollingStarted = false;

// Unique ID for this browser session
const senderId = crypto.randomUUID();

/* =========================
   Join Chat
========================= */

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();

  if (!username) {
    alert("Please enter your name.");
    return;
  }

  currentUser = username;

  joinScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  if (!pollingStarted) {
    pollingStarted = true;
    startPolling();
  }
});

/* =========================
   Message Rendering
========================= */

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addMessage(message) {
  const div = document.createElement("div");

  const type = message.senderId === senderId ? "outgoing" : "incoming";

  div.className = `message ${type}`;

  div.innerHTML = `
    <div class="msg-user">${message.username}</div>

    <div class="msg-text">${message.text}</div>

    <div class="msg-time">${formatTime(message.timestamp)}</div>

    <div class="reactions">
      <button class="like-btn">
        👍 ${message.likes}
      </button>

      <button class="dislike-btn">
        👎 ${message.dislikes}
      </button>
    </div>
  `;

  div.querySelector(".like-btn").addEventListener("click", () => {
    updateReaction(message.id, "like");
  });

  div.querySelector(".dislike-btn").addEventListener("click", () => {
    updateReaction(message.id, "dislike");
  });

  messagesContainer.appendChild(div);
}

function renderMessages() {
  const shouldScroll =
    messagesContainer.scrollHeight -
      messagesContainer.scrollTop -
      messagesContainer.clientHeight <
    50;

  messagesContainer.innerHTML = "";

  messages.forEach(addMessage);

  if (shouldScroll) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

/* =========================
   Fetch Messages
========================= */

async function fetchMessages() {
  try {
    const response = await fetch(`${BASE_URL}/messages`);

    if (!response.ok) {
      throw new Error("Unable to fetch messages.");
    }

    const newMessages = await response.json();

    // Only update the UI if something has changed
    if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
      messages = newMessages;
      renderMessages();
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

/* =========================
   Polling
========================= */

async function startPolling() {
  if (!pollingStarted) return;

  await fetchMessages();

setTimeout(() => {
  if (pollingStarted) {
    startPolling();
  }
}, 1000);
}

/* =========================
   Send Message
========================= */

async function sendMessage() {
  const text = messageInput.value.trim();

  if (!text) return;

  sendBtn.disabled = true;

  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentUser,
        text,
        senderId,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to send message.");
    }

    messageInput.value = "";

    await fetchMessages();
  } catch (error) {
    console.error("Send Error:", error);
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

/* =========================
   Like / Dislike
========================= */

async function updateReaction(messageId, reaction) {
  try {
    const response = await fetch(
      `${BASE_URL}/messages/${messageId}/${reaction}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error(`Unable to ${reaction} message.`);
    }

    messages = [];
    await fetchMessages();
  } catch (error) {
    console.error("Reaction Error:", error);
  }
}
