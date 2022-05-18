let url = 'ws://localhost:3001/ws';
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
    var message = JSON.stringify({type: 'start', user: userName.value});
    this.send(message);
  };
  socket.onclose = function(event) {
    let incomingMessage = event.data;
  }
  socket.onmessage = function(event) {
    myMessageArea.value = '';
    let incomingMessage = JSON.parse(event.data);
    if(incomingMessage.type === 'stop')
    {
      socket.close(1000,'Закрыть');
    }
    showMessage(incomingMessage.message);
  };
  startButton.disabled = true;
  userName.disabled = true;
  endButton.disabled = false;
  myMessageArea.disabled = false;
  sendButton.disabled = false;
};

function endChat(e) {
  e.preventDefault();
  var message = JSON.stringify({type: 'stop', user: userName.value});
  socket.send(message);
  startButton.disabled = false;
  userName.disabled = false;
  endButton.disabled = true;
  myMessageArea.disabled = true;
  sendButton.disabled = true;
}
// отправка сообщения из формы
function sendMessage(e) {
  e.preventDefault();
  let message = JSON.stringify({type:'message', user:userName.value, message:myMessageArea.value});
  socket.send(message);
};

// отображение информации в div#messages
function showMessage(message) {
  let messageElem = document.createElement('p');
  messageElem.textContent = message;
  document.querySelector('#messageArea').prepend(messageElem);
}
helloForm.addEventListener('submit', startChat);
endButton.addEventListener('click', endChat);
messageForm.addEventListener('submit', sendMessage);

