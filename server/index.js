const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getRoomsList
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000
const publicDirectoryPath = path.join(__dirname, '../client/public')

app.use(express.static(publicDirectoryPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.emit('roomsList', {
    rooms: getRoomsList()
  })

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room })

    if (error) {
      return callback(error)
    }

    socket.join(user.room)
    // sending to sender-client only
    socket.emit('message', generateMessage('Admin', 'Welcome!'))
    // sending to all clients in room except sender
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    io.emit('roomsList', {
      rooms: getRoomsList()
    })
    
    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter()

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!')
    }

    io.to(user.room).emit('message', generateMessage(user.username, message))
    callback()
  })

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.lat},${coords.long}`))
    // callback sends acknowledgement to client so we can print Location shared! when callback received
    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
      io.emit('roomsList', {
        rooms: getRoomsList()
      })
    }
  })

  socket.on('switchRoom', () => {
    socket.leave(socket.room)
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left the room`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
      io.emit('roomsList', {
        rooms: getRoomsList()
      })
    }
  })
  
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})