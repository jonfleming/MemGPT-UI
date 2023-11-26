const WebSocket = require("ws");
const express = require('express')
const path = require('path')

const app = express()

const httpPort = process.env.SOCKET_PORT || 3000
const socketPort = process.env.SOCKET_PORT || 3001

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

console.log(`Socket running on ${socketPort}!`)
const ws =  new WebSocket.Server({
  port: socketPort
})

ws.on('connection', (socket) => {
    console.log(`New connection`)

    socket.on('message', (data) => {      
        console.log(`New message from ${socket.id}: ${data}`)        
        setTimeout(() => {
          ws.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              const msg = { message: data.toString(), from: 'Bot' }
              client.send(JSON.stringify(msg))
            }
          })
        }, 2000);    
        
    })
})

const httpServer = app.listen(httpPort, () => {
  console.log(`Express running on ${httpPort}!`)
})

httpServer.on('upgrade', async function upgrade(request, socket, head) {
  console.log('Handle Upgrade...')
  ws.handleUpgrade(request, socket, head, function done(ws) {
    ws.emit('connection', ws, request)
  })
})