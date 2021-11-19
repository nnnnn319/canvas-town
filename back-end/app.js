var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/game');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 添加音乐文件夹为公共文件夹
app.use(express.static(path.join(__dirname, 'public/music')));

app.use(cors({
  origin:['http://localhost:8080'],
  methods:['GET','POST'],
  allowedHeaders:['Content-Type','Authorization']
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors: true});
const fs = require('fs')
let socketList = new Map()
let socketRoom = new Map()

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', (socket) => {
  console.log('a user connected ' + socket.id);
  readFile()
  socketList.set(socket.id, socket)
  socket.on('disconnect', ()=>{
      console.log("a user disconnection")
  })
  //获取path中的id
//   var url = socket.request.headers.referer;
//   var splited = url.split('/');
//   var roomID = splited[splited.length - 1];
//   console.log("room_id" + roomID)
  socket.on('room', (id, num) => {
    console.log(id + " accept room num " + num)
    socketList.get(id).join(num)
    socketRoom.set(id, num)
    console.log(socket.rooms)
  })
  socket.on('chat message', (msg, id) => {
    console.log('message: ' + msg + " " + id);
    //广播
    let room = socketRoom.get(id)
    console.log(room)
    io.to(room).emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


function readFile() {
    // fs.readFile('test.mp3', function(err, buf){
    //     // it's possible to embed binary data
    //     // within arbitrarily-complex objects
    //     console.log(buf)
    //   });
    // var context = new AudioContext();
    // context.decodeAudioData('test.mp3', function(buffer){
    //     var source = context.createBufferSource();
    //     Array.prototype.reverse.call( buffer.getChannelData(0) );
    //     Array.prototype.reverse.call( buffer.getChannelData(1) );
    //     source.buffer = buffer;
    // });
}
 */
module.exports = app;
