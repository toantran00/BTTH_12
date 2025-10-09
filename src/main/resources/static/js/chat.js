"use strict";

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");
var logoutBtn = document.querySelector("#logout-btn");

var stompClient = null;
var username = null;

var colors = [
  "#2196F3", "#32c787", "#00BCD4", "#ff5652", "#ffc107", "#ff85af",
  "#FF9800", "#39bbb0", "#fcba03", "#fc0303", "#de5454", "#b9de54",
  "#54ded7", "#1358d6", "#d611c6"
];

function connect(event) {
  username = document.querySelector("#name").value.trim();
  
  if (username) {
    usernamePage.classList.add("hidden");
    chatPage.classList.remove("hidden");

    var socket = new SockJS("/support-websocket");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
  }
  event.preventDefault();
}

function onConnected() {
  // Subscribe to the support topic
  stompClient.subscribe("/topic/support", onMessageReceived);

  // Tell the server about joining
  stompClient.send(
    "/app/support.register",
    {},
    JSON.stringify({ sender: username, type: "JOIN" })
  );

  connectingElement.classList.add("hidden");
}

function onError(error) {
  connectingElement.textContent =
    "Không thể kết nối đến server! Vui lòng refresh trang và thử lại.";
  connectingElement.style.color = "red";
}

function sendMessage(event) {
  var messageContent = messageInput.value.trim();

  if (messageContent && stompClient) {
    var chatMessage = {
      sender: username,
      content: messageInput.value,
      type: "CHAT",
    };

    stompClient.send("/app/support.send", {}, JSON.stringify(chatMessage));
    messageInput.value = "";
  }
  event.preventDefault();
}

function onMessageReceived(payload) {
  var message = JSON.parse(payload.body);
  var messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (message.type === "JOIN") {
    messageElement.classList.add("system");
    messageElement.innerHTML = `
      <div class="message-content">
        ${message.sender} đã tham gia cuộc trò chuyện
      </div>
    `;
  } else if (message.type === "LEAVE") {
    messageElement.classList.add("system");
    messageElement.innerHTML = `
      <div class="message-content">
        ${message.sender} đã rời khỏi cuộc trò chuyện
      </div>
    `;
  } else {
    // Kiểm tra xem tin nhắn có phải của người dùng hiện tại không
    if (message.sender === username) {
      messageElement.classList.add("own");
    }
    
    var avatarColor = getAvatarColor(message.sender);
    var currentTime = new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageElement.innerHTML = `
      <div class="message-header">
        <span class="message-sender" style="color: ${avatarColor}">
          ${message.sender}
        </span>
        <span class="message-time">${currentTime}</span>
      </div>
      <div class="message-content">
        ${message.content}
      </div>
    `;
  }

  messageArea.appendChild(messageElement);
  messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
  var hash = 0;
  for (var i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }
  var index = Math.abs(hash % colors.length);
  return colors[index];
}

function logout() {
  if (stompClient) {
    stompClient.disconnect();
  }
  location.reload();
}

// Event listeners
usernameForm.addEventListener("submit", connect, true);
messageForm.addEventListener("submit", sendMessage, true);
logoutBtn.addEventListener("click", logout, true);

// Enter key để gửi tin nhắn
messageInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage(event);
  }
});

// Xử lý khi đóng trang
window.addEventListener("beforeunload", function() {
  if (stompClient) {
    stompClient.disconnect();
  }
});