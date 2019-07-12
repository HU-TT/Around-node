const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express();

const httpServer= require('http').Server(app);
const io = require('socket.io')(httpServer);

const model = require('./src/model')
const Chat = model.getModel('chat')


io.on('connection', function (socket) {
  socket.on('sendmsg', function (data) {
    const { from , to, msg} = data   
    const chatid = [from, to].sort().join('_')
    Chat.create({chatid, from, to, content: msg})
      .then(ret => {
        socket.emit('recvmsg', Object.assign({}, ret._doc))
      })
  })
})

const router = require('./src/router')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(router)

httpServer.listen(9093, () => {
  console.log('server running...')
})
