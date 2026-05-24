const usernameInput = document.getElementById("usernameInput");

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

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  const username = usernameInput.value.trim();

  if (text === "" || username === "") return;

  socket.emit("send-message", {
    text,
    username,
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
  messages.forEach((msg) => addMessage(msg, "incoming"));
});

socket.on("receive-message", (message) => {
  addMessage(message, message.senderId === socket.id ? "outgoing" : "incoming");
});
