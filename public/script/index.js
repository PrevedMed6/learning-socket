let url = 'ws://localhost:3000/ws';
let startButton = document.querySelector('#startButton');
let endButton = document.querySelector('#endButton');
let helloForm = document.querySelector('#helloForm');
let messageForm = document.querySelector('#messageForm');
let myMessageArea = document.querySelector('#myMessageArea');
let sendButton = document.querySelector('#sendButton');
let userName = document.querySelector('#userName');
let socket = null;

function startChat(e) {
  e.preventDefault();
  socket = new WebSocket(url);
  socket.onopen = function() {
    var message = JSON.stringify({type: 'start', message: userName.value});
    this.send(message);
  };
  socket.onclose = event => console.log(`Closed ${event.code}`);
  socket.onmessage = function(event) {
    let incomingMessage = event.data;
    showMessage(incomingMessage);
  };
  startButton.disabled = true;
  userName.disabled = true;
  endButton.disabled = false;
  myMessageArea.disabled = false;
  sendButton.disabled = false;
};

function endChat(e) {
  e.preventDefault();
  socket.close(1000, "работа закончена");
  startButton.disabled = false;
  userName.disabled = false;
  endButton.disabled = true;
  myMessageArea.disabled = true;
  sendButton.disabled = true;
}
// отправка сообщения из формы
//document.forms.publish.onsubmit = function() {
 // let outgoingMessage = this.message.value;
 // socket.send(outgoingMessage);
 // return false;
//};

// отображение информации в div#messages
function showMessage(message) {
  let messageElem = document.createElement('p');
  messageElem.textContent = message;
  document.querySelector('#messageArea').prepend(messageElem);
}
helloForm.addEventListener('submit', startChat);
messageForm.addEventListener('submit', endChat);
// прослушка входящих сообщений

