const httpServer= require('http').Server(app);
const io = require('socket.io')(httpServer);

io.on('connection', function (socket) {
  socket.on('sendmsg', function (data) {
    socket.emit('recvmsg', data)
  })
})