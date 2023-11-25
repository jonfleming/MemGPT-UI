const messages = document.querySelector('.message-list')
const btn = document.querySelector('.btn')
const input = document.querySelector('input')
const socketPort = 3001
const socket = new WebSocket(`ws://127.0.0.1:${socketPort}`)

btn.disabled = true

socket.onopen = () => {
  console.log('connected')
  btn.disabled = false
}

writeLine('Bot', 'How can I help you?', 'item-primary')
const user = 'Jon'

// Button/Enter Key
btn.addEventListener('click', sendMessage)
input.addEventListener('keyup', function (e) {if (e.keyCode == 13) sendMessage()})

// Messenger Functions
function sendMessage() {
  const msg = input.value
  socket.send(msg)
  input.value = ''
  writeLine(user, msg, 'item-secondary')
}

socket.onmessage = function(event) {
  const msg = JSON.parse(event.data)
  writeLine(msg.from,  msg.message, 'item-primary')
}

function writeLine(user, text, className) {
  const message = document.createElement('li')
  message.classList.add('message-item', className)
  message.innerHTML = user + ': ' + text
  messages.appendChild(message)
  messages.scrollTop = messages.scrollHeight
}
