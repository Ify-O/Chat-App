const BASE_URL = "https://chat-app-backend-gr6s.onrender.com";

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

const POLLING_INTERVAL = 1000;

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

async function getResponseData(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  return {
    error: text || `Server returned ${response.status}`,
  };
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

  if (message.updatedAt) {
    time.textContent += " (edited)";
  }

  const reactions = document.createElement("div");

  reactions.className = "reactions";

  const likeButton = document.createElement("button");

  likeButton.type = "button";
  likeButton.className = "like-btn";

  likeButton.textContent = `👍 ${message.likes}`;

  likeButton.addEventListener("click", () => {
    updateReaction(message.id, "like");
  });

  const dislikeButton = document.createElement("button");

  dislikeButton.type = "button";
  dislikeButton.className = "dislike-btn";

  dislikeButton.textContent = `👎 ${message.dislikes}`;

  dislikeButton.addEventListener("click", () => {
    updateReaction(message.id, "dislike");
  });

  reactions.appendChild(likeButton);
  reactions.appendChild(dislikeButton);

  const actions = document.createElement("div");

  actions.className = "message-actions";

  if (message.senderId === senderId) {
    const editButton = document.createElement("button");

    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
      editMessage(message);
    });

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      deleteMessage(message.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
  }

  messageElement.appendChild(username);
  messageElement.appendChild(text);
  messageElement.appendChild(time);
  messageElement.appendChild(reactions);
  messageElement.appendChild(actions);

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
    messagesContainer.appendChild(createMessageElement(message));
  });

  if (shouldScroll) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

async function fetchMessages() {
  try {
    const response = await fetch(`${BASE_URL}/messages`);

    const data = await getResponseData(response);

    if (!response.ok) {
      throw new Error(data.error || `Server returned ${response.status}`);
    }

    if (JSON.stringify(data) !== JSON.stringify(messages)) {
      messages = data;
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

    const data = await getResponseData(response);

    if (!response.ok) {
      throw new Error(data.error || "Unable to send message.");
    }

    messageInput.value = "";

    await fetchMessages();
  } catch (error) {
    console.error("Send Error:", error);

    alert(error.message);
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

async function editMessage(message) {
  const newText = prompt("Edit your message:", message.text);

  if (newText === null || !newText.trim()) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/messages/${message.id}`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        text: newText.trim(),
      }),
    });

    const data = await getResponseData(response);

    if (!response.ok) {
      throw new Error(data.error || "Unable to edit message.");
    }

    await fetchMessages();
  } catch (error) {
    console.error("Edit Error:", error);

    alert(error.message);
  }
}

async function deleteMessage(messageId) {
  const confirmed = confirm("Are you sure you want to delete this message?");

  if (!confirmed) return;

  try {
    const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
      method: "DELETE",
    });

    const data = await getResponseData(response);

    if (!response.ok) {
      throw new Error(data.error || "Unable to delete message.");
    }

    await fetchMessages();
  } catch (error) {
    console.error("Delete Error:", error);

    alert(error.message);
  }
}

async function updateReaction(messageId, reaction) {
  try {
    const response = await fetch(
      `${BASE_URL}/messages/${messageId}/${reaction}`,
      {
        method: "POST",
      },
    );

    const data = await getResponseData(response);

    if (!response.ok) {
      throw new Error(data.error || `Unable to ${reaction} message.`);
    }

    await fetchMessages();
  } catch (error) {
    console.error("Reaction Error:", error);

    alert(error.message);
  }
}