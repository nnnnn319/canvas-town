<template>
  <div class="interact">
    <div class="interact-contain">
      <div class="header">
        <div class="logo">
          猜歌名
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
        <choose-qestion class="choose-question"></choose-qestion>
      </div>
    </div>

  </div>
</template>
<script>
import ChooseQestion from '../common/ChooseQestion.vue'
export default {
  name: 'Interaction',
  components: {
    ChooseQestion
  },
  data () {
    return {
      input2: '',
      percentage: 10,
      allContent:[],
      items:[{message:'test sentence1'},{message:'test sentence2'}],
      users: [
        {
          id: 0,
          status: 1,
          username: 'xiaoming',
          score: 24
        },
        {
          id: 1,
          status: 0,
          username: 'lily',
          score: 20
        },
        {
          id: 3,
          status: 0,
          username: 'hhhhh',
          score: 30
        }
      ],
      userNum: 6
    }
  },
  methods: {
    //   展开快捷会话的弹窗
    unfold () { //点击聊天气泡触发该函数
        
        // 将输入push到数组中
        if(this.input2!=''){
            this.items.push({message:this.input2});
            
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
        }else{
            alert('请输入内容后再发送');
        }
        
    },
    scrollFun(){//溢出时保持滚动条在底部
        this.scrollIntoViewIfNeeded(true);
    },
    exit () { },
    format (percentage) {
      return `${percentage}s`;
    },
    // 倒计时
    countDown () {
      var count = 100
      setInterval(() => {
        this.percentage = count
      }, 100)
    }
  },
  created () { },
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
#chat-content{
    border: solid 1px #F5F5F5;
    font-size: 14px;
    height: 430px;
    width: 280px;
    border-radius: 10px;
    margin: 5px;
    padding: 5px;
    overflow:auto;
}
/* 每一条新发言 */
#chat-item{
    border: none;
    border-radius: 10px;
    height: fit-content;
    width: fit-content;
    margin: 5px;
    padding: 5px;
    background-color: #E1F5FE;
}
/* 发送按钮 */
#sendMessage{
    display: inline;
    border: none;
    border-radius: 10px;
    background-color: #0D47A1;
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
  width: 200px;
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
</style>