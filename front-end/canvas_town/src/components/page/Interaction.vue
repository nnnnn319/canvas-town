<template>
    <div class="interact">
      <div class="interact-container">
<!--        <div class="header">-->
<!--          -->
<!--          <i class="el-icon-close exit" @click="exit"></i>-->
<!--        </div>-->
          <div class="room-title">
            <div class="question">
              {{this.q_username}}正在出题
            </div>
          </div>
          <!-- 左侧聊天区域 -->
          <div class="room-left">
            <div class="left-box">
              <div class="time" >
                <i class="el-icon-alarm-clock"></i>{{percentage}}s
              </div>
              <div class="chat">
                <div class="chat-father" ref="chatInnerDiv">
                  <ul class="chat-content" ref="chatUl">
                    <li v-for="item in items" :key="item.message" id="chat-item">
                      {{item.message}}
                    </li>
                  </ul>
                </div>
                <div class="chat-contain">
                  <div class="chat-footer">
                    <el-input class="input-content" placeholder="按下回车键发送" @keyup.enter.native="unfold"  v-model="input2">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div class="center-box">
              <div class="canvas-space">
                <canvas ref="canvas" id="canvas" style="width:100%; height:100%;"></canvas>
              </div>
            </div>
          <!-- 右侧头像区域 -->
          <div class="right-box">
            <div class="users">
              <el-scrollbar>
                <ul class="ul-l">
                  <li v-for="user in users" :key="user.id">
                    <div class="user">
                      <i class="el-icon-microphone" v-if="user.status" :class="{microphone:user.status}"></i>
                      <div class="avatar " :class="{'cur-avatar':user.status}"></div>
                      <div class="info " :class="{'cur-info':user.status}">
                        <div class="nickname">{{user.username}}</div>
                        <div class="score">{{user.score}}分</div>
                      </div>
                      <!--不显示其他用户的这个按钮-->
                      <b-button variant="outline-primary" @click="startChallenge()" v-show="((!user.ready_status)&& user.isThis)" class="readyTag">开始挑战</b-button>
                      <el-tag type="error" class="readyTag" v-if="(!user.ready_status) && (!user.isThis)">未准备</el-tag>
                      <el-tag type="success" class="readyTag" v-if="user.ready_status">已准备</el-tag>
                    </div>
                  </li>
                  <li v-for="(n,i) in emptyNum" :key="i+'only'">
                    <div class="user">
                      <div class="avatar empty">
                        <i class="el-icon-user-solid"></i>
                      </div>
                      <div class="info info-empty">空位</div>
                    </div>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        <!--下侧输入区域-->
        <div v-show="(this.q_socket == this.socketId)" class="file-load">
          <el-switch
                  v-model="upload_value"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
          </el-switch>
          <div class="upload_audio">
            <el-upload
                    class="upload-demo"
                    multiple
                    action="#"
                    :limit="1"
                    :on-change="handleChange"
                    :file-list="fileList"
                    v-if="!upload_value">
              <el-button size="small" type="primary" class="click_sub" style="border-left: 3px">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传音频文件</div>
            </el-upload>
            <!--录音区域-->
            <div class="record_region" v-if="upload_value">
              <!--                  <el-button size="medium"  >record</el-button>-->
              <el-button type="primary" size='medium' icon="el-icon-microphone" class="record-btn"></el-button>
              <audio controls class="audio-player" id="myaudio"></audio>
            </div>
          </div>
          <div>
            <div style="display: flex" >
              <label style="margin-right: 10px">请输入答案:</label>
              <el-input v-model="result" placeholder="请输入内容" class="result_input"></el-input>
              <!--                  <el-button ></el-button>-->
              <b-button variant="outline-primary" @click="submit_result()">提交</b-button>
            </div>
          </div>
        </div>
        <div v-show="isAnswer" class="answer_result">
          <!--            //控制输出-->
          <label>请输入答案</label>
          <el-input v-model="self_result" placeholder="请输入内容" style="width: 200px"></el-input>
          <el-button @click="submit_self_result()">提交</el-button>
        </div>
        <div>
          {{judge_result}}
        </div>
      </div>
    </div>
</template>
<script scope>
// import Rhythm from '../../plugins/Rhythm.vue';
// import ChooseQestion from '../common/ChooseQestion.vue'
export default {
  name: 'Interaction',
  components: {
  },

  data () {
    return {
      s: '../../assets/kanong.mp3',
      audioSrc: '../../assets/kanong.mp3',
      buffer: '',
      finish_record: false,
      finish_result: false,
      upload_value: true,
      //socketId 每次发送请求都要携带
      socketId: '1',
      //房间成员
      room_mem: [],
      // status  socketid标记每个成员状态 是否准备好
      //     [
      //             { status: false, id: 'epXaT08UqmPz9BxNAAAF' },
      //             { status: true, id: 'Fl360SbysEi3l2EVAAAH' }
      //     ]
      status: [],
      //出题人socketId
      q_socket: '',
      //出题人username
      q_username: '',
      //上传文件
      fileList: [],
      // change次数
      change_file: 0,
      //是否在出题中
      isQing: false,
      //绑定组件答案
      result: '',
      //不绑定
      c_result: 'undefined',
      //是否可以开始答题
      isAnswer: false,
      //自己给出的答案
      self_result: '',
      //判断结果
      judge_result: '',
      input2: '',
      percentage: 0,
      allContent: [],
      items: [{ message: '快来和房间中的小伙伴们交流吧' }],
      users: [],
      userSelf: {
        username: 'lily',
        userType: 'player',
        ready: false
      },
      userNum: 6
    }
  },
  methods: {
    // 载入音量可视化
        loadMusicView(){
            // 获取音频
            var oAudio
            var dataArray
            var oCtx
            var analyser
            var audioSrc
            var bufferLength 
            var frameID
            // 利用cancas渐变进行音频绘制
            var canvas =document.getElementById('canvas')
            var ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.save();
            let  myContainer = []; //存储 需保持的图形(会动的)
            initAudio();
        function initAudio() {
            console.log(document)
            oAudio = document.getElementById('myaudio')
            oAudio.crossOrigin = "anonymous";
            oAudio.play();
        // 创建音频上下文对象
            oCtx = new AudioContext();
                // 创建分析机 
            analyser = oCtx.createAnalyser();
            // 创建媒体源
            audioSrc = oCtx.createMediaElementSource(oAudio);
            // 媒体源与分析机连接
            audioSrc.connect(analyser);
            // 输出的目标：将分析机分析出来的处理结果与目标点（耳机/扬声器）连接
            analyser.connect(oCtx.destination);
            // 设置傅里叶变化参数
            analyser.fftSize =128;
            //根据范围得到不同音频的数量的长度
            bufferLength = analyser.frequencyBinCount;
            dataArray= new Uint8Array(bufferLength);
            }
            class MusicBall {
                constructor(x, y, speedX, speedY, radius, color) {
                    this.x = x;
                    this.y = y;
                    this.SpdX = speedX;
                    this.SpdY = speedY;
                    this.radius = radius;
                    this.color = color;
                }
            static create(bufferLength, container, detail) {
                for (let i = 0; i < bufferLength; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let speedX = (Math.random() - 0.5) * 1;
                let speedY = (Math.random() - 0.5) * 1;
                let color =
                    detail.colorList[Math.floor(Math.random() * detail.colorList.length)];
                let radius = 0;
                container.push(new MusicBall(x, y, speedX, speedY, radius, color));
                }
            }

            static drawBall() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                myContainer.forEach((ball, index) => ball.update(dataArray[index]));
            }
            draw() {
                ctx.beginPath(); //开始绘制

            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            }
            update(frequencyVolume) {
                this.draw();
                if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.SpdX = -this.SpdX;
                this.x = this.x + this.SpdX;
                }
                if (this.y + this.radius > canvas.heyight || this.y - this.radius < 0) {
                this.SpdY = -this.SpdY;
                this.y = this.y + this.SpdY;
                }
                this.x = this.x + this.SpdX;
                this.y = this.y + this.SpdY;
                this.radius = frequencyVolume - 100 > 0 ? (frequencyVolume - 100) * 0.7 : 0;
            }
            }
            function rockMusic(drawFnc) 
            {
                // requestAnimationFrame 保证与屏幕刷新率一致,在每次执行时绘制canvas数据
                frameID = requestAnimationFrame(rockMusic.bind(this, drawFnc));
                analyser.getByteFrequencyData(dataArray);
                drawFnc();
            }
                ctx.restore();
                ctx.save();
                MusicBall.create(bufferLength, myContainer, {
                    colorList: ["#F7B2B78a", "#5FC1BF", "#DE639A8a", "#7F29828a", "#16001E8a",]
                });
                frameID ? cancelAnimationFrame(frameID) : "";
                rockMusic(MusicBall.drawBall);    
        },
    //   展开快捷会话的弹窗
    unfold () { //点击聊天气泡触发该函数
      // 将输入push到数组中
      if (this.input2 != '') {
        // //将消息显示
        // this.items.push({ message: this.input2 });
        //发送到后端
        this.$socket.emit('chat message', this.input2, this.socketId)
        //聊天框溢出事件触发
        this.chatUl();
        // this.items.push({ message: this.input2 });
        // console.log(document.querySelector('#chat-father'));
        //判断是否猜测正确
        // if(this.input2=='歌名'){
        //     alert('猜对了！');
        // }else{
        //     alert('请再接再厉');
        // }
        //2个元素 第一个显示发送者
        //如果猜测的内容正确，显示时会被加密
        this.input2 = '';
      } else {
        alert('请输入内容后再发送');
      }
    },
    chatUl () {
      let chatUl = this.$refs.chatUl;
      let chatInnerDiv = this.$refs.chatInnerDiv;
      if (chatUl.scrollHeight > chatInnerDiv.clientHeight) {
        chatUl.scrollTop = 490;
      }
    },
    exit () { },
    format (percentage) {
      return `${percentage}s`;
    },
    readyGame (e) {
      if (!this.userSelf.ready) {
        // console.log(e.target.innerText);
        e.target.innerText = '取消准备'
        // 点击后按钮变灰色，不能再点击
        this.userSelf.ready = true
        this.users.filter(user => {
          if (user.username == this.userSelf.username) {
            user.ready = true
          }
        })
      } else {
        e.target.innerText = '准备'
        // 点击后按钮变灰色，不能再点击
        this.userSelf.ready = false
        this.users.filter(user => {
          if (user.username == this.userSelf.username) {
            user.ready = false
          }
        })
      }
      //发送准备
    },
    //socket方法
    //try 发送room房间号
    sendRoomNum () {
      this.$socket.emit('room', this.socketId, '1')
    },
    //开始挑战方法
    startChallenge () {
      this.$socket.emit('start challenge', this.socketId)

    },
    sendFile () {
      this.$socket.emit('get exam', this.socketId, 'file')
    },
    //上传文件
    handleChange (file, fileList) {
      this.finish_result = true
      console.log('上传文件相关')
      console.log(file)
      console.log(fileList)
      let socket = this.$socket
      let _this = this
      // this.$socket.emit('audiobuffer', this.socketId, 'buffer')
      if(this.change_file < 1) {
        //发送文件
        socket.emit('audiobuffer', _this.socketId, file.raw)
        this.finish_record  = true
        this.buffer = file.raw
      }
      this.change_file++
      if(this.change_file == 3) {
        this.change_file = 0
      }
    },
    playSound(file){
      // var read = new FileReader();
      let context = new (window.AudioContext || window.webkitAudioContext)();
      this.audioSrc = this.s
      context.decodeAudioData(file, function(buffer) {
        console.log('transform')
        Array.prototype.reverse.call( buffer.getChannelData(0) );
        // Array.prototype.reverse.call( buffer.getChannelData(1) );
        //扬声器直接播放
        // 设置数据
        var source = context.createBufferSource();
        source.buffer = buffer;
        // connect到扬声器
        source.connect(context.destination);
        alert('三秒后将播放题目')
        let timer = setTimeout(()=> {
          source.start();
        }, 3000)
        //添加空间播放
        console.log(timer)
      })
    },
    //上传答案
    submit_result() {
      this.finish_result = true
      if(this.finish_result && this.finish_record) {
        this.$socket.emit('result', this.socketId, this.result)
        this.$socket.emit('audiobuffer', this.socketId, this.buffer)
      } else {
        alert('上传内容不全')
      }
      this.loadMusicView()
      this.result = ''
    },
    //回答-自己的答案
    submit_self_result() {
      if(this.self_result === this.c_result) {
        console.log('回答正确')
        this.self_result = ''
        this.judge_result = '回答正确'
        for(let i in this.users) {
          if(this.users[i].id === this.socketId) {
            this.users[i].score = parseInt(this.users[i].score) + 5
            this.$socket.emit('score', this.socketId, this.users[i].score)
          }
        }
      } else {
        this.judge_result = '回答错误'
      }
      this.isAnswer = false
    },
    //录制音频
    record() {
      const recordBtn = document.querySelector(".record-btn");
      const player = document.querySelector(".audio-player");
      if (navigator.mediaDevices.getUserMedia) {
        let chunks = [];
        const constraints = { audio: true };
        navigator.mediaDevices.getUserMedia(constraints).then(
                stream => {
                  console.log("授权成功！");
                  const mediaRecorder = new MediaRecorder(stream);
                  recordBtn.onclick = () => {
                    console.log('录制音频')
                    if (mediaRecorder.state === "recording") {
                      mediaRecorder.stop();
                      recordBtn.textContent = "录制";
                      console.log("录音结束");
                    }
                    else {
                      mediaRecorder.start();
                      console.log("录音中...");
                      recordBtn.textContent = "停止";
                    }
                    console.log("录音器状态：", mediaRecorder.state);
                  };
                  mediaRecorder.ondataavailable = e => {
                    chunks.push(e.data);
                  };
                  // eslint-disable-next-line no-unused-vars
                  mediaRecorder.onstop = (e) => {
                    this.finish_record = true
                    var blob = new Blob(chunks, { type: "audio/mpeg; codecs=opus" });
                    this.buffer = blob
                    // this.$socket.emit('audiobuffer', this.socketId, blob)
                    chunks = [];
                    var audioURL = window.URL.createObjectURL(blob);
                    player.src = audioURL;
                  };
                },
                () => {
                  console.error("授权失败！");
                }
        );
      }
      else {
        console.error("浏览器不支持 getUserMedia");
      }
    }

  },
  beforeCreate () {
  },
  created () {

  },
  mounted () {
    //连接成功 获取ID
    this.socketId = this.$socket.id
    console.log(this.socketId)
    //获取房间成员函数
    // this.sendRoomNum()
    //录制音频函数
    this.record()
    this.$socket.emit('get room', this.$socket.id)
    let audio = document.getElementById('myaudio')
    audio.src = "/Mojito.mp3"
    audio.volume = 0
    this.loadMusicView()
  },
  sockets: {
    room_member (arr, user_arr) {
      console.log('room_member')
      console.log(arr[0])
      console.log(arr[1])
      console.log(user_arr)
      this.room_mem = arr[0]
      this.users = [];

      for(let i=0;i<this.room_mem.length;i++){
          let obj = {
            id:'',
            status: 0,
            username: 'get from db',
            score: 0,
            userType: 'admin',
            ready_status: false,
            isThis: false
          }
            obj.id = this.room_mem[i];
            obj.username = arr[1][i]
            if(this.room_mem[i] == this.socketId) {
              obj.isThis = true
            } else {
              obj.isThis = false
            }
            this.users.push(obj);
      }
    },
    // 获取每个人的状态
    status(status) {
      console.log('get status')
      console.log(status)
      this.status = status
      console.log(this.users)
      console.log(status)
      for(let i in status) {
        for(let j in this.users) {
          if(this.users[j].id == status[i].id) {
            this.users[j].ready_status = status[i].status
          }
        }
      }
    },
    member (mem) {
      console.log('出题人socketId ' + mem)
      //修改变量正在出题
      this.isQing = true
      this.q_socket = mem
      this.finish_record = false
      this.finish_result = false
      //获取username
      for(let i in this.users) {
        if(this.users[i].id === mem) {
          this.q_username = this.users[i].username
        }
      }
      //初始化一些变量
      this.judge_result = ''
    },
    exam (file) {
      console.log('收到题目 ' + file)
    },
    reverse_exam (file) {
      console.log('出题人收到 ' + file)
      this.$socket.emit('answer', this.socketId)
    },
    time (time) {
      console.log(time)
      this.percentage = time
      if(time === 1) {
        this.isQing = false
      }
    },
    chat_message(msg) {
      console.log("收到聊天信息 " + msg)
      //将消息显示
      if(msg.indexOf(this.c_result) != -1) {
        this.items.push({ message: '**********' });
        alert('包含正确答案')
      } else{
        this.items.push({ message: msg });
      }
    },
    play(buffer) {
      //收到音频 可以开始答题
      console.log('收到buffer')
      this.playSound(buffer)
      //判断是否为出题方
      if(this.socketId != this.q_socket) {
        this.isAnswer = true
      } else {
        this.isAnswer = false
      }
    },
    final_result(re) {
      console.log('收到答案')
      this.c_result = re
    },
    end(msg) {
      console.log(msg)
      alert('挑战结束,即将返回首页')
      setTimeout( ()=> {
        this.$router.push({
          path: '/home'
        })
      }, 3000)

    },
    re_score(id) {
      for(let i in this.users) {
        if(this.users[i].id === id[0]) {
          this.users[i].score = id[1]
        }
      }
    }

  },
  computed: {
    emptyNum: function () {
      return this.userNum - this.users.length
    }
  },
  watch: {
  }
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.logo {
  font-size: 2em;
  text-align: center;
  background-color: #ffe652;
  padding: 5px 20px;
  margin: 10px 0;
  opacity: 0.8;
  border-radius: 10px;
}
/* body的8px要去掉 */
.interact {
  width:100%;
  height: 100%;
  background: rgb(244, 249, 249);
}

.interact-container{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.chat-father{
  height: 90%;
  background-color: white;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.room {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}
.right-box {
  width: 20%;
  height: 70%;
}
.left-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.chat {
  width: 100%;
  height: 92%;
  /*height: 500px;*/
  /*border: 1px solid rgba(255, 255, 255, 0.3);*/
  /*border: 1px solid;*/
  border-radius: 10px;
  /*background-color: rgba(255, 255, 255, 0.3);*/
  align-self: flex-end;
  top: 0px
}
.center-box {
  width: 50%;
  margin: 0 5% 0 5%;
}
.room {
  /* background-color: #0DF2DE; */
  background-color: white;
}
.room-title{
  width: 100%;
  height: 10%;
  text-align: center;
}
.room-left {
  display: flex;
  width: 15%;
  margin-left: 5%;
  /*background: url("~@/assets/img/1.png");*/
  align-self: center;
  flex-direction: row;
  height: 80%;
}
.chat-contain {
  padding: 10px;
  height: 10%;
  /*border: 1px solid;*/
}
.chat-footer {
  bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}
/* 显示所有的发言记录 */
#chat-content {
  /*border: solid 1px rgba(255, 255, 255, 0.3);*/
  font-size: 14px;
  height: 80%;
  width: 280px;
  border-radius: 10px;
  margin: 5px;
  padding: 5px;
  overflow: auto;
}
/* 每一条新发言 */
#chat-item {
  border: none;
  border-radius: 10px;
  height: fit-content;
  width: fit-content;
  margin: 5px;
  padding: 5px;
  /*background-color: #e1f5fe;*/
  color: black;
}
/* 发送按钮 */
/*#sendMessage {*/
/*  display: inline;*/
/*  border: none;*/
/*  border-radius: 10px;*/
/*  background-color: #0d47a1;*/
/*  color: white;*/
/*  padding: 3px 10px;*/
/*  margin-bottom: 10px;*/
/*  margin-left: 20px;*/
/*}*/

.input-content {
  width: 100%;
  height: 30px;
  border-radius: 20px;
}
::v-deep .el-input__inner {
  border-radius: 15px;
  height: 30px;
}
.shortcut {
  font-size: 31px;
  right: 0;
  float: right;
}
.music-bg {
  width: 300px;
  background-color: blue;
  height: 300px;
  border-radius: 10px;
}

.right-box {
  float: right;
  background-color: white;
}

.ul-l > li {
  border: 0px;
}
.exit {
  font-size: 31px;
  font-weight: bold;
  color: #fff;
}
::v-deep .el-scrollbar__wrap {
  /* 去掉横向滚动条 */
  overflow-x: hidden;
}
.users {
  width: 230px;
  height: 500px;
  border: 1px solid #fff;
  border-radius: 10px;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.7);
}
li {
  position: relative;
  list-style: none;
  height: 83px;
  border-bottom: 1px solid gray;
}
li:last-child {
  border: none;
}
.microphone {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 25px;
  color: #00bcf4;
  font-weight: bold;
}
.avatar {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #000;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: url("~@/assets/img/avatar.jpg");
  background-size: cover;
  text-align: center;
}
.info {
  position: absolute;
  left: 90px;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
}
.cur-avatar {
  border: 3px solid #00bcf4;
}
.cur-info {
  color: #00bcf4;
}
.empty {
  border: 3px solid gray;
  background: url();
  font-size: 37px;
  color: gray;
}
.info-empty {
  color: gray;
}
.choose-question {
  position: absolute;
  top: 99px;
  left: 348px;
}
.readyTag {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}

.readybtn {
  background-color: #e6e6e4;
}
.time {
  width: 50%;
  height: 8%;
  margin: 0 25% 0 25%;
  font-size: 30px;
  border: 3px solid #000;
  border-radius: 20px;
  background-color: rgb(255, 239, 120);
  padding-left: 30px;
  margin-top:9px
}
/*.el-button + .el-button {*/
/*  margin-left: 0;*/
/*}*/
.readyGame {
  width: 85px;
  height: 35px;
  position: absolute;
  top: 154px;
  left: 50%;
  transform: translateX(-50%);
}
.beginGame {
  width: 85px;
  height: 35px;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}
.choose-file {
  width: 85px;
  height: 35px;
  background-color: grey;
  /* position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%); */
}
.upload-demo {
  text-align: center;
}
.profile-space {
  display: flex;
  align-items: center;
  text-align: center;
  position: absolute;
  right: -200px;
  bottom: -55px;
  color: #fff;
}
#profile-name {
  margin-left: 10px;
}

  /*//录音相关*/
.record-btn {
  height: 20px;
}
  .record_region {
    display: flex;
    align-items: center;
    width:350px;
    margin-left: 20px;
  }
  .audio-player{
    height: 30px;
  }
  .upload_audio{
    /*display: flex;*/
    /*justify-content: space-around;*/
    height:70px;
    width: 350px;
  }
.result_input {
  width: 50%;
}
  .file-load{
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    margin-top: 20px;
    height: 10%;
  }

  .answer_result {
    display: flex;
  }

  .canvas-space{
    width: 100%;
    height: 100%;
    background-color: #A6E3E9;
    border-radius: 40px;
  }

</style>