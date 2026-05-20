const socket = io("http://localhost:3000");

const messagesContainer = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(message, type = "incoming") {
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.innerText = message.text;
  messagesContainer.appendChild(div);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
