<template>
  <div class="interact">
    <div class="interact-contain">
      <div class="header">
        <div class="logo">
          倒放挑战1号房间
        </div>
        <i class="el-icon-close exit" @click="exit"></i>
      </div>
      <div class="room">
        <!-- 左侧聊天区域 -->
        <div class="left-box">
          <div class="chat">
            <div id="chat-father" @scroll="scrollFun($event)" ref="chat-fa">
              <ul id="chat-content">
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
          <div class="music-bg">
          </div>
          <el-progress :percentage="percentage" :format="format"></el-progress>
          <div id="progressBar" style="width:100%;height:2px;background-color:teal;">&nbsp;</div>
          <el-button type="primary" v-if="userSelf.userType === 'admin'">开始游戏</el-button>
          <el-button type="success" @click="readyGame($event)" :class="{readybtn:userSelf.ready}">准备</el-button>
        </div>
        <!-- 右侧头像区域 -->
        <div class="right-box">
          <div class="users">
            <el-scrollbar style="height:100%">
              <ul>
                <li v-for="user in users" :key="user.id">
                  <div class="user">
                    <i class="el-icon-microphone" v-if="user.status" :class="{microphone:user.status}"></i>
                    <div class="avatar " :class="{'cur-avatar':user.status}"></div>
                    <div class="info " :class="{'cur-info':user.status}">
                      <div class="nickname">{{user.username}}</div>
                      <div class="score">{{user.score}}分</div>
                    </div>
                    <el-tag type="success" class="readyTag" v-if="user.ready">已准备</el-tag>
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
        <!-- <choose-qestion class="choose-question"></choose-qestion> -->
      </div>
    </div>
    <button @click="startChallenge()">开始挑战</button>
    <button @click="sendFile()">上传文件</button>

    <!--上传文件-->
    <el-upload
            class="upload-demo"
            multiple
            action="#"
            :limit="1"
            :on-change	="handleChange"
            :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <!--    <el-input type="file" id="file" accept="audio/x-wav,audio/mpeg"></el-input>-->
  </div>
</template>
<script>
// import ChooseQestion from '../common/ChooseQestion.vue'
export default {
  name: 'Interaction',
  components: {
    // ChooseQestion
  },
  data () {
    return {
      //socketId 每次发送请求都要携带
      socketId: '',
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
      //上传文件
      fileList: [],
      input2: '',
      percentage: 10,
      allContent: [],
      items: [{ message: 'test sentence1' }, { message: 'test sentence2' }],
      users: [
      // userSelf: {
      //   username: 'lily',
      //   userType: 'player',
      //   ready: false
      // },
      userNum: 6
    }
  },
  methods: {
    //   展开快捷会话的弹窗
    unfold () { //点击聊天气泡触发该函数
      // 将输入push到数组中
      if (this.input2 != '') {
        this.items.push({ message: this.input2 });
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
    scrollFun () {//溢出时保持滚动条在底部
      this.scrollIntoViewIfNeeded(true);
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
    // 倒计时
    countDown () {
      var count = 100
      setInterval(() => {
        this.percentage = count
      }, 100)
    },
    //socket方法
    //try 发送room房间号
    sendRoomNum () {
      this.$socket.emit('room', this.socketId, '1')
    },
    //开始挑战方法
    startChallenge() {
      this.$socket.emit('start challenge', this.socketId)
    },
    sendFile() {
      this.$socket.emit('get exam', this.socketId, 'file')
    },
    //上传文件
    handleChange(file, fileList) {
      console.log('上传文件相关')
      console.log(file)
      console.log(fileList)
    }

  },
  created () {

  },
  mounted () {
    console.log('page mounted')
    //连接成功 获取ID
    this.socketId = this.$socket.id
    console.log(this.socketId)
    //获取房间成员函数
    this.sendRoomNum()
  },
  sockets: {
    room_member (arr) {
      console.log('room_member')
      console.log(arr)
      this.room_mem = arr
      this.users = [];
        var obj = {
            id:'',
            status: 0,
            username: 'get from db',
            score: 0,
            userType: 'admin',

        }
        for(let i=0;i<this.room_mem.length;i++){
            obj.id = this.room_mem[i].id;
            this.users.push(obj);
        } 
    },
    //人数不够 获取每个人的状态
    status(status) {
      console.log('get status')
      console.log(status)
      this.status = status
    },
    member(mem) {
      console.log('出题人socketId ' + mem)
      this.q_socket = mem
    },
    exam(file) {
      console.log('收到题目 '+ file)
    },
    reverse_exam(file) {
      console.log('出题人收到 '+file)
      this.$socket.emit('answer', this.socketId)
    },
    time(time) {
      console.log(time)
      this.percentage = time*2
    }
  },
  computed: {
    emptyNum: function () {
      return this.userNum - this.users.length
    }
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
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: skyblue;
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
}
.header {
  display: flex;
  justify-content: space-between;
}
.room {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 842px;
  height: 518px;
}
.left-box {
}
.chat {
  position: relative;
  width: 300px;
  height: 500px;
  border: 1px solid #fff;
  border-radius: 10px;
  background-color: #fff;
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
  border: solid 1px #f5f5f5;
  font-size: 14px;
  height: 430px;
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
  background-color: #e1f5fe;
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
.right-box {
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
}
ul {
}
li {
  position: relative;
  list-style: none;
  background-color: #fff;
  height: 83px;
  border: 1px solid gray;
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
</style>