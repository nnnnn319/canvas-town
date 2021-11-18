const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors: true});
const fs = require('fs');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
//所有socket
let socketList = new Map()
//所有socket->room映射
let socketRoom = new Map()
//room->准备好的数字
let socketPre = new Map()
// room->出题人index
let socketExam = new Map()
// room中的所有socketId
let socketInRoom = new Map()
// 出题人socketID
let examSocketId = undefined

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
  //加入不同的房间
  socket.on('room', (id, num) => {
    console.log(id + " join room " + num)
    socketList.get(id).join(num)
    socketRoom.set(id, num)
    // console.log(socket.rooms)
    //判断房间是否存在 并维护房间->socketId的map
    if(socketInRoom.has(num)) {
      socketInRoom.get(num).push(id)
    } else {
      socketInRoom.set(num, [])
      socketInRoom.get(num).push(id)
    }
    console.log(num+" 房间人员:")
    console.log(socketInRoom)
  })
  //发送消息 相当于聊天功能
  socket.on('chat message', (msg, id) => {
    console.log('message: ' + msg + " " + id);
    //广播
    let room = socketRoom.get(id)
    console.log(room)
    io.to(room).emit('chat message', msg);
  });
  //开始挑战 首先先是一个人挑战 之后再实现循环
  // start challenge 每一个客户端都要发起 当收到所有客户端的挑战时才会开始
  socket.on('start challenge', (id) => {
    console.log("member "+id+" start challenge")
    //获取id的房间号 查询是否其他成员也准备好了 如果都准备好了 返回true 如果没有返回false 前端对应开始挑战还是继续等待其他成员的显示
    let room_num = socketRoom.get(id)
    let num_members = getRoomMemberLength(room_num)
    // 房间socket数量
    let num_length = 0
    num_members.then(val => {
      num_length = val
      let now_num = getRoomPreNum(room_num)
      if(now_num < val) {
        console.log('人不够还不开始')
        //返回不开始 前端可以显示目前人数 考虑返回给单人
      } else {
        console.log('可以开始')
        //返回开始 前端收到消息直接开始 后端返回列表
        let mem = start(room_num, 1)
        socketExam.set(room_num, 1)
        //发送给前端 出题人id
        io.to(room_num).emit('member', mem)
      }
    })
  })
  //前端发送题目
  socket.on('get exam', (id, exam) => {
    //收到题目
    console.log("已经收到题目")
    let room = socketRoom.get(id)
    //只给出题人发消息 让其返回触发开始
    io.to(id).emit('reverse exam', exam)
    // 给所有人发送题目
    io.to(room).emit('exam', exam)
  })
  //前端收到发送的反转音频 返回收到消息(只发题方返回) 后端进入计时答题模式
  socket.on('answer', (id)=>{
    console.log("开始答题")
    let time = 60
    let room_num = socketRoom.get(id)
    let timer = setInterval(()=> {
      if(time > 0) {     
       console.log("剩余时间 "+time)
       time--
      } else {
        //答题时间结束
        clearInterval(timer)
        timer = null
        console.log("答题结束")
        //下一个人开始出题
        // console.log(room_num)
        let mem = start(room_num, socketExam.get(room_num)+1)
        //发送给前端 出题人 id
        // console.log("mem")
        // console.log(mem)
        io.to(room_num).emit('member', mem)
        socketExam.set(room_num, socketExam.get(room_num)+1)
      }
    }, 1000)
  })
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

async function getRoomMemberLength(room_num) {
  let room_members = io.sockets.adapter.rooms.get(room_num).size
  return room_members
}

function getRoomPreNum(room_num) {
  if(socketPre.has(room_num)) {
    now_num = socketPre.get(room_num) + 1
    socketPre.set(room_num, now_num)
  }
  else{
    socketPre.set(room_num, 1)
    now_num = 1
  }
  return now_num
}
// example
function getRoomAllSocket_example() {
  io.in('1').allSockets().then(items=>{
    console.log(items.forEach(item=>{
        console.log('看看这是啥：'+item)
    }))
  })
}

function getRoomAllSocket(room_num) {
  return io.in(room_num).allSockets()
}



// async function start(room_num, index) {
//   // 房间 room_num 开始挑战
//   let allSockets = [] //所有客户端
//   await getRoomAllSocket(room_num).then(items => {
//     items.forEach(async function (item){
//       allSockets.push(item)
//     })
//   })
//   console.log(allSockets)
//   if(index>allSockets.length) {
//     console.log('全部出题结束')
//     return;
//   }
//   // 首先发送开始信号 按顺序设置出题人
//   // 返回一个正在出题人的socketID 前端判断 如果与自己的socketId不等 则不为出题人
//   console.log('出题人 '+allSockets[index-1])
//   let examSocketId = allSockets[index-1]
//   return examSocketId
// }
function start(room_num, index) {
  // 房间 room_num 开始挑战
  console.log("start 开始挑战 挑战成员有：")
  console.log(socketInRoom.get(room_num))

  if(index > socketInRoom.get(room_num).length) {
    console.log('全部出题结束')
    //初始化一些内容
    socketExam.set(room_num, 1)
    return;
  }
  // 首先发送开始信号 按顺序设置出题人
  // 返回一个正在出题人的socketID 前端判断 如果与自己的socketId不等 则不为出题人
  console.log("第"+index+"轮")
  console.log('出题人 '+socketInRoom.get(room_num)[index-1])
  let examSocketId = socketInRoom.get(room_num)[index-1]
  return examSocketId
}


