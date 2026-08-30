const BASE_URL = "https://chat-app-backend-gr6s.onrender.com";

const joinForm = document.getElementById("joinForm");
const chatForm = document.getElementById("chatForm");

const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");

const messagesContainer = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");

let currentUser = "";
let messages = [];
let pollingStarted = false;

const POLLING_INTERVAL = 1000;

// Unique ID for this browser session
const senderId = crypto.randomUUID();



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

  messageInput.focus();

  if (!pollingStarted) {
    pollingStarted = true;
    startPolling();
  }
});



function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createMessageElement(message) {
  const messageElement = document.createElement("div");

  const messageType = message.senderId === senderId ? "outgoing" : "incoming";

  messageElement.className = `message ${messageType}`;



  const username = document.createElement("div");
  username.className = "msg-user";
  username.textContent = message.username;

  const text = document.createElement("div");
  text.className = "msg-text";
  text.textContent = message.text;

  const time = document.createElement("div");
  time.className = "msg-time";
  time.textContent = formatTime(message.timestamp);

  const reactions = document.createElement("div");
  reactions.className = "reactions";

  const likeButton = document.createElement("button");
  likeButton.type = "button";
  likeButton.className = "like-btn";
  likeButton.textContent = `👍 ${message.likes}`;
  likeButton.setAttribute(
    "aria-label",
    `Like message from ${message.username}`,
  );

  const dislikeButton = document.createElement("button");
  dislikeButton.type = "button";
  dislikeButton.className = "dislike-btn";
  dislikeButton.textContent = `👎 ${message.dislikes}`;
  dislikeButton.setAttribute(
    "aria-label",
    `Dislike message from ${message.username}`,
  );

  likeButton.addEventListener("click", () => {
    updateReaction(message.id, "like");
  });

  dislikeButton.addEventListener("click", () => {
    updateReaction(message.id, "dislike");
  });

  reactions.appendChild(likeButton);
  reactions.appendChild(dislikeButton);

  messageElement.appendChild(username);
  messageElement.appendChild(text);
  messageElement.appendChild(time);
  messageElement.appendChild(reactions);

  return messageElement;
}

function renderMessages() {
  const shouldScroll =
    messagesContainer.scrollHeight -
      messagesContainer.scrollTop -
      messagesContainer.clientHeight <
    50;

  messagesContainer.innerHTML = "";

  messages.forEach((message) => {
    const messageElement = createMessageElement(message);
    messagesContainer.appendChild(messageElement);
  });

  if (shouldScroll) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}



async function fetchMessages() {
  try {
    const response = await fetch(`${BASE_URL}/messages`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const newMessages = await response.json();

   

    if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
      messages = newMessages;
      renderMessages();
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}



async function startPolling() {
  if (!pollingStarted) return;

  await fetchMessages();

  setTimeout(startPolling, POLLING_INTERVAL);
}



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
      throw new Error(`Server returned ${response.status}`);
    }

    messageInput.value = "";

   

    await fetchMessages();
  } catch (error) {
    console.error("Send Error:", error);
    alert("Unable to send your message. Please try again.");
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});



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
