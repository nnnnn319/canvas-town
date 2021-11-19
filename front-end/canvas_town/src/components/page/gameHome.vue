<template>
  <div class="game-hoom-container">
    <div>
      <b-modal  title="Add Room"  v-model="openAdd"  @show="resetModal" @ok="addRoom">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group id="select-group-1" label="请输入您要加入的房间号:" label-for="input-1">
            <b-input id="input-1" v-model="roomNumber"></b-input>
          </b-form-group>
        </form>
      </b-modal>
    </div>
    <div class="title-img">
      <img id="title-img" src="../../assets/img/字体.png" alt="">
    </div>
    <div class="button-group">
      <div class="button-space">
        <b-button variant="outline-primary" class="room-button"  @click="guessMusic" >冲关挑战</b-button>
      </div>
      <div class="button-space">
        <b-button variant="outline-primary" class="room-button" @click="openAdd">倒放挑战</b-button>
      </div>
    </div>
    <div class="qier-img">
      <div id="qier-img">
        <img height="300px;" src="../../assets/img/企鹅.png" alt="">
      </div>
      <div class="profile-space">
        <b-img rounded="circle" alt="Circle image" src="https://picsum.photos/125/125/?image=58" style="width: 70px;"></b-img>
        <p id="profile-name">{{username}}</p>
        <button @click="logout">退出登录</button>
    </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        gameType: '猜歌挑战',
        playerNumber: 2
      },
      gameTypes: [{
        value: '猜歌挑战',
        text: '猜歌挑战'
      },
      {
        value: '倒放挑战',
        text: '倒放挑战'
      }],
      gamePlay: [2, 3, 4, 5, 6],
      roomNumber: "",
      openAdd: false
    }
  },
  mounted(){
  },
  methods: {
    guessMusic: function () {
      this.$router.push({
        path:'/guessMusic'
      })
    },
    addRoom: function () {
      console.log("你加入了房间")
      console.log("房间信息", this.roomNumber)
      //加入房间  发送socketio请求
      if(this.roomNumber === ""){
        this.$message.error(`请输入房间号`)
      }
      else{
        this.$socket.emit('room', this.$socket.id, this.roomNumber, localStorage.getItem("name"))
        this.$router.push({
        path: '/interaction'
      })
      }
    },
    resetModal: function () {
      this.form = {
        gameType: '猜歌挑战',
        playerNumber: 2
      }
      this.roomNumber = ""
    },
    logout () {
      this.$axios({
        url: `/users/logout`,
        method: 'post',
        data: { username: localStorage.getItem(`name`) }
      }).then((res) => {
        let code = res.data.code
        if (code === 0) {
          alert("退出登录成功")
        } else {
          alert("退出登录成功,但有错误：" + res.data.msg)
        }
      })
      // 移除缓存
      localStorage.removeItem("name")
      // 跳转到引导页
      this.$router.push("/")
    }
  },
  sockets: {
    msg(len) {
      if(len > 6) {
        alert('房间人数已达上限')
      } else {
        this.$router.push({
          path: '/interaction'
        })
      }
    }
  },
  computed: {
    username: function () { return localStorage.getItem(("name")) }
  }
}
</script>
<style scoped>
.title-img{
  display: flex;
  justify-content: center;
  height: 40%;
}

#title-img{
}

.qier-img{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30%;
}

#qier-img{
  margin-left: 300px;
}
.button-group {
  width: 100%;
  height: 30%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.button-space {
  width: 100%;
  display: flex;
  justify-content: center;
}
.room-button {
  width: 30%;
  font-size: 50px;
  border-radius: 20px;
  font-size: 50px;
  margin: 20px;
}
.profile-space {
  margin-top: 2%;
  padding-right: 10%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
}

#profile-name {
  font-size: 50px;
  padding: 20px;
}

.game-hoom-container{
  height: 100%;
  overflow: hidden;
}
</style>