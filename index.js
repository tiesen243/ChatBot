const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const url = "https://chatgpt53.p.rapidapi.com/";

const chatLog = $("#chat-log"),
  userInput = $("#user-input"),
  sendButton = $("#send-button"),
  buttonIcon = $("#button-icon"),
  info = $(".info");

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = userInput.value.trim();

  if (message === " ") return;
  else if (message === "developer") {
    userInput.value = "";
    appendMessage("user", message);
    setTimeout(() => {
      appendMessage("bot", "I am a developer");
      buttonIcon.classList.add("fa-solid", "fa-paper-plane");
      buttonIcon.classList.remove("fas", "fa-spinner", "fa-pulse");
    }, 2000);
    return;
  } else if (message === "clear") {
    userInput.value = "";
    chatLog.innerHTML = "";
    return;
  }

  appendMessage("user", message);
  userInput.value = "";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "bb64cf9bc2msh8ae9391c3eaf37bp170e6djsnfe48d2e758dc",
      "X-RapidAPI-Host": "chatgpt53.p.rapidapi.com",
    },
    body: `{"messages":[{"role":"user","content":"${message}"}]}`,
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      appendMessage("bot", res.choices[0].message.content);
      buttonIcon.classList.add("fa-solid", "fa-paper-plane");
      buttonIcon.classList.remove("fas", "fa-spinner", "fa-pulse");
    })

    .catch((err) => {
      if (err.name === "TypeError") {
        appendMessage(
          "bot",
          "Sorry, I am not feeling well today. Please try again later."
        );
        buttonIcon.classList.add("fa-solid", "fa-paper-plane");
        buttonIcon.classList.remove("fas", "fa-spinner", "fa-pulse");
      }
    });
}

function appendMessage(sender, message) {
  info.style.display = "none";
  console.log(sender);
  buttonIcon.classList.remove("fa-solid", "fa-paper-plane");
  buttonIcon.classList.add("fas", "fa-spinner", "fa-pulse");

  const messageElement = document.createElement("div");
  const iconElement = document.createElement("div");
  const chatElement = document.createElement("div");
  const icon = document.createElement("i");

  chatElement.classList.add("chat-box");
  iconElement.classList.add("icon");
  messageElement.classList.add(sender);
  messageElement.innerText = message;

  if (sender === "user") {
    icon.classList.add("fas", "fa-user");
    iconElement.setAttribute("id", "user-icon");
  } else if (sender === "bot") {
    icon.classList.add("fa-solid", "fa-robot");
    iconElement.setAttribute("id", "bot-icon");
  }

  iconElement.appendChild(icon);
  chatElement.appendChild(iconElement);
  chatElement.appendChild(messageElement);
  chatLog.appendChild(chatElement);
  chatLog.scrollTo = chatLog.scrollHeight;
}
