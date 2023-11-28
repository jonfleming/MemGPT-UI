const messages = document.getElementById('chat-area')
const btn = document.getElementById('send-btn')
const input = document.getElementById('user-input')
const internalDialogCtl = document.getElementById('internal-dialog')
const functionCallCtl = document.getElementById('functioon-call')
const socketPort = 8282
const socket = new WebSocket(`ws://127.0.0.1:${socketPort}`)
let user = 'Jon'
let agent = 'Bot'

btn.disabled = true

socket.onopen = () => {
  console.log('connected')
  socket.send(JSON.stringify({type: 'command', command: 'load_agent', name: 'agent_9'}))
  setTimeout(() => {
    writeLine('agent_response', agent, 'How can I help you?', 'bot-message')
  }, 2000)
  btn.disabled = false
}


// Button/Enter Key
btn.addEventListener('click', sendMessage)
input.addEventListener('keyup', function (e) {
  if (e.key == 'Enter') sendMessage()
})

// Messenger Functions
function sendMessage() {
  const msg = input.value
  socket.send(JSON.stringify({type: 'user_message', message: msg, agent_name: 'agent_9'}))
  input.value = ''
  writeLine('', user, msg, 'user-message')
}

socket.onmessage = function(event) {
  const msg = JSON.parse(event.data)
  const showInternalDialog = internalDialogCtl.checked
  const showFunctionCall = functionCallCtl.checked

  console.log(msg)
  switch (msg.type) {
    case 'agent_response_start':
    case 'agent_response_end':
      writeHr()
      break
    case 'command_response':
      writeLine(msg.type,  agent, msg.message || msg.status, 'bot-function small')
      break
    case 'agent_response':
      switch (msg.message_type) {
        case 'function_message':
          if (showFunctionCall) {
            const functionName = msg.message.split('(')
            msg.message = functionName[0].includes('send_message') ? functionName[0]+ '()' : msg.message
            if (msg.message && !msg.message.includes('Success: None')) {
              writeLine('', agent, msg.message, 'bot-function small')
            }
          }

          break
        case 'internal_monologue':
          if (showInternalDialog) {
            writeLine('', agent,  msg.message, 'bot-thought')
          }
          
          break
        default:
          writeLine(msg.message_type, agent, msg.message || msg.status, 'bot-message')

      }
  } 
}

function icon(user) {
    const avatar = user === agent ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'
    return '<div class="avatar col-md-1">' + avatar + '</div>'
}

function writeLine(messageType, user, text, className) {
  if (text && text != 'Success: None') {
    const container = document.createElement('div')
    container.classList.add('message-container', 'row')
    container.innerHTML = (icon(user))
    const message = document.createElement('div')
    addClass(message, className)
    message.innerHTML = '<div>' + user + window.markdown(text) + '</div>'
    container.appendChild(message)
    messages.appendChild(container)
    messages.scrollTop = messages.scrollHeight
  }
}

function writeHr() {
  const hr = document.createElement('hr')
  messages.appendChild(hr)
  messages.scrollTop = messages.scrollHeight
}

function addClass(element, className) {
  element.classList.add('message', "col-md-11")
  const classNames = className.split(' ')

  if (Array.isArray(classNames)) {
    classNames.forEach((c) => {
      element.classList.add(c)
    })
  } else {
    element.classList.add(className)
  }  
}