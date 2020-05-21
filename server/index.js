// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'Hello From Express' });
// });

// app.post('/api/world', (req, res) => {
//   console.log(req.body);
//   res.send(
  
//     `I received your POST request. This is what you sent me: ${req.body.post}`,
//   );
// });

// app.listen(port, () => console.log(`Listening on port ${port}`));

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
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.emit('roomsList', {
    rooms: getRoomsList()
  })
  
  // TODO remove
  socket.emit('message', 'Welcome!')

  socket.on('sendMessage', (message) => {
    io.emit('message', message)
  })
  // End TODO remove

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
    
    // callback()
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