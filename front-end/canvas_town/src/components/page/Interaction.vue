<template>
    <div class="interact">
      <div class="interact-contain">
        <div class="header">
          <div class="logo">
            倒放挑战1号房间
          </div>
          <div v-if="this.isQing">
            {{this.q_socket}}正在出题
          </div>
          <i class="el-icon-close exit" @click="exit"></i>
        </div>
        <div class="room">
          <!-- 左侧聊天区域 -->
          <div class="room-left">
            <div class="left-box">
              <div class="time">
                <i class="el-icon-alarm-clock"></i>10s
              </div>
              <el-progress :percentage="percentage" :format="format"></el-progress>
              <!--              <div id="progressBar" style="width:100%;height:2px;background-color:teal;">&nbsp;</div>-->
              <div class="chat">
                <div id="chat-father" ref="chatInnerDiv">
                  <ul id="chat-content" ref="chatUl">
                    <li v-for="item in items" :key="item.message" id="chat-item">
                      {{item.message}}
                    </li>
                  </ul>
                </div>
                <div class="chat-contain">
                  <div class="chat-footer">
                    <el-input class="input-content" placeholder="请输入聊天内容" @keyup.enter.native="unfold" prefix-icon="el-icon-edit" v-model="input2">
                    </el-input>
                    <button @click="unfold" id="sendMessage">发送</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 音乐可视化区域 -->
            <div class="center-box">
              <el-button type="primary" v-if="userSelf.userType === 'admin'">开始游戏</el-button>
              <!--          <el-button type="success" @click="readyGame($event)" :class="{readybtn:userSelf.ready}">准备</el-button>-->
              <!--上传文件-->

            </div>
          </div>
          <!-- 右侧头像区域 -->
          <div class="right-box">
            <div class="users">
              <el-scrollbar>
                <ul>
                  <li v-for="user in users" :key="user.id">
                    <div class="user">
                      <i class="el-icon-microphone" v-if="user.status" :class="{microphone:user.status}"></i>
                      <div class="avatar " :class="{'cur-avatar':user.status}"></div>
                      <div class="info " :class="{'cur-info':user.status}">
                        <div class="nickname">{{user.username}}</div>
                        <div class="score">{{user.score}}分</div>
                      </div>
                      <!--不显示其他用户的这个按钮-->
                      <button @click="startChallenge()" v-show="((!user.ready_status)&& user.isThis)">开始挑战</button>
                      <el-tag type="success" class="readyTag" v-if="(!user.ready_status) && (!user.isThis)">未准备</el-tag>
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
        </div>
        <!--下侧输入区域-->
        <div v-show="(this.q_socket == this.socketId)" class="file-load">
          <div class="upload_audio">
            <el-upload
                    class="upload-demo"
                    multiple
                    action="#"
                    :limit="1"
                    :on-change="handleChange"
                    :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传音频文件</div>
            </el-upload>
            <!--录音区域-->
            <div class="record_region">
              <!--                  <el-button size="medium"  >record</el-button>-->
              <el-button type="primary" size='medium' icon="el-icon-microphone" class="record-btn"></el-button>
              <audio controls class="audio-player"></audio>
            </div>
          </div>
          <div>

            <div style="display: flex">
              <label>请输入答案</label>
              <el-input v-model="result" placeholder="请输入内容" class="result_input"></el-input>
              <!--                  <el-button ></el-button>-->
              <b-button variant="outline-primary" @click="submit_result()">提交</b-button>
            </div>

          </div>
        </div>
        <div v-show="isAnswer">
          <!--            //控制输出-->
          <label>请输入答案</label>
          <el-input v-model="self_result" placeholder="请输入内容"></el-input>
          <el-button @click="submit_self_result()">提交</el-button>
        </div>
        <div>
          {{judge_result}}
        </div>
      </div>
    </div>
</template>
<script scope>
// import ChooseQestion from '../common/ChooseQestion.vue'
export default {
  name: 'Interaction',
  components: {
    // ChooseQestion
  },
  data () {
    return {
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
      c_result: '',
      //是否可以开始答题
      isAnswer: false,
      //自己给出的答案
      self_result: '',
      //判断结果
      judge_result: '',
      input2: '',
      percentage: 10,
      allContent: [],
      items: [{ message: 'test sentence1' }, { message: 'test sentence2' }],
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
      console.log('上传文件相关')
      console.log(file)
      console.log(fileList)
      let socket = this.$socket
      let _this = this
      // this.$socket.emit('audiobuffer', this.socketId, 'buffer')
      if(this.change_file < 1) {
        //发送文件
        socket.emit('audiobuffer', _this.socketId, file.raw)
      }
      this.change_file++
      if(this.change_file == 3) {
        this.change_file = 0
      }
    },
    audioBufferToBlob(audioBuffer) {
      // Float32Array samples
      const [left] =  [audioBuffer.getChannelData(0)]
      // interleaved
      const interleaved = new Float32Array(left.length)
      for (let src=0, dst=0; src < left.length; src++, dst+=1) {
        interleaved[dst] =   left[src]
        // interleaved[dst+1] = right[src]
      }
      // get WAV file bytes and audio params of your audio source
      const wavBytes = this.getWavBytes(interleaved.buffer, {
        isFloat: true,       // floating point or 16-bit integer
        numChannels: 1,
        sampleRate: 48000,
      })
      const wav = new Blob([wavBytes], { type: "audio/mpeg; codecs=opus" })
      return wav
    },
    getWavBytes(buffer, options) {
      const type = options.isFloat ? Float32Array : Uint16Array
      const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT

      const headerBytes = this.getWavHeader(Object.assign({}, options, { numFrames }))
      const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

      // prepend header, then add pcmBytes
      wavBytes.set(headerBytes, 0)
      wavBytes.set(new Uint8Array(buffer), headerBytes.length)

      return wavBytes
    },
// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
    getWavHeader(options) {
      const numFrames =      options.numFrames
      const numChannels =    options.numChannels || 2
      const sampleRate =     options.sampleRate || 44100
      const bytesPerSample = options.isFloat? 4 : 2
      const format =         options.isFloat? 3 : 1

      const blockAlign = numChannels * bytesPerSample
      const byteRate = sampleRate * blockAlign
      const dataSize = numFrames * blockAlign

      const buffer = new ArrayBuffer(44)
      const dv = new DataView(buffer)

      let p = 0

      function writeString(s) {
        for (let i = 0; i < s.length; i++) {
          dv.setUint8(p + i, s.charCodeAt(i))
        }
        p += s.length
      }

      function writeUint32(d) {
        dv.setUint32(p, d, true)
        p += 4
      }

      function writeUint16(d) {
        dv.setUint16(p, d, true)
        p += 2
      }

      writeString('RIFF')              // ChunkID
      writeUint32(dataSize + 36)       // ChunkSize
      writeString('WAVE')              // Format
      writeString('fmt ')              // Subchunk1ID
      writeUint32(16)                  // Subchunk1Size
      writeUint16(format)              // AudioFormat
      writeUint16(numChannels)         // NumChannels
      writeUint32(sampleRate)          // SampleRate
      writeUint32(byteRate)            // ByteRate
      writeUint16(blockAlign)          // BlockAlign
      writeUint16(bytesPerSample * 8)  // BitsPerSample
      writeString('data')              // Subchunk2ID
      writeUint32(dataSize)            // Subchunk2Size

      return new Uint8Array(buffer)
    },
    playSound(file){
      //需要判断type 是audiobuffer 还是 file
      // var read = new FileReader();
      let context = new (window.AudioContext || window.webkitAudioContext)();
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
      this.$socket.emit('result', this.socketId, this.result)
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
                    if (mediaRecorder.state === "recording") {
                      mediaRecorder.stop();
                      recordBtn.textContent = "record";
                      console.log("录音结束");
                    }
                    else {
                      mediaRecorder.start();
                      console.log("录音中...");
                      recordBtn.textContent = "stop";
                    }
                    console.log("录音器状态：", mediaRecorder.state);
                  };
                  mediaRecorder.ondataavailable = e => {
                    chunks.push(e.data);
                  };
                  // eslint-disable-next-line no-unused-vars
                  mediaRecorder.onstop = (e) => {
                    var blob = new Blob(chunks, { type: "audio/mpeg; codecs=opus" });
                    this.$socket.emit('audiobuffer', this.socketId, blob)
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

  },
  sockets: {
    room_member (arr) {
      console.log('room_member')
      console.log(arr)
      this.room_mem = arr
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
      this.percentage = time*2
      if(time === 1) {
        this.isQing = false
      }
    },
    chat_message(msg) {
      console.log("收到聊天信息 " + msg)
      //将消息显示
      this.items.push({ message: msg });
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
  /*display: flex;*/
  position: absolute;
  /*justify-content: center;*/
  /*align-items: center;*/
  width: 100%;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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
  
}
.left-box {

}
.chat {
  position: relative;
  width: 300px;
  /*height: 500px;*/
  /*border: 1px solid rgba(255, 255, 255, 0.3);*/
  /*border: 1px solid;*/
  border-radius: 10px;
  /*background-color: rgba(255, 255, 255, 0.3);*/
  align-self: flex-end;
  top: 0px
}
.center-box {

}
.room {
  background-color: #0DF2DE;
}
.room-left {
  flex: 1;
  /*background: url("~@/assets/img/1.png");*/
  align-self: center;
  display: flex;
  flex-direction: row;
  height: 498px;
}
.chat-contain {
  padding: 10px;
}
.chat-footer {
  position: absolute;
  bottom: 10px;
  width: 100%;
  width: 100%;
  box-sizing: border-box;
}
/* 显示所有的发言记录 */
#chat-content {
  /*border: solid 1px rgba(255, 255, 255, 0.3);*/
  font-size: 14px;
  height: 390px;
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
  color: white;
}
/* 发送按钮 */
#sendMessage {
  display: inline;
  border: none;
  border-radius: 10px;
  background-color: #0d47a1;
  color: white;
  padding: 3px 10px;
  margin-bottom: 10px;
  margin-left: 20px;
}

.input-content {
  width: 200px;
  height: 30px;
  border-radius: 20px;
  left: 0;
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
.center-box {
  position: relative;
}
.right-box {
  float: right;
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
  width: 150px;
  font-size: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 3px solid #000;
  border-radius: 20px;
  background-color: #a6e3e9;
  padding: 10px 20px;
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
  }
  .audio-player{
    height: 30px;
  }
  .upload_audio{
    display: flex;
    justify-content: space-around;
  }
.result_input {
  width: 50%;
}
</style>