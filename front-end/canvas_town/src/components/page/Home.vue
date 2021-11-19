<template>
  <div class="container">
      <div class="bounce"  >
        <span class="letter">倒</span>
        <span class="letter">放</span>
        <span class="letter">挑</span>
        <span class="letter">战</span>

    </div>
    <div class="name-space">
      <label for="" id="name-label">你的名字:</label>
       <button class="noselect">
          <input type="text" name="name" v-model="name" id="username" placeholder="输入你的名字" @keyup.enter="onSubmit">
        </button>
     
      <label for="" id="name-tip">{{Tip}}</label>
    </div>
     <RadioC></RadioC>
  </div>
</template>
<script>
import RadioC from '../../plugins/Radio.vue'
export default {
  data () {
    return {
      name: "",
      Tip: ''
    }
  },
  
  components:{
    RadioC,
  },
  methods: {
    onSubmit () {
      // 检查是否重复
      // url:/registerName
      // method: post
      /**
       * code here
       */
      let that = this
      this.$axios({
        url: '/users/registerName',
        method: 'post',
        data: { username: this.name }
      }).then(res => {
        let code = res.data.code
        if (code === 0) {
          console.log("注册成功")
          // 前端保存
          localStorage.setItem("name", this.name)
          // 校验通过之后，进入gameHome
          this.$router.push({
            path: "/gameHome"
          })
        } else {
          that.Tip = res.data.msg
        }
      })

    }
  },
  computed: {

  }
}
</script>
<style scoped>
/** 全局为flex布局 */
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}


/* 名字label + input */
.name-space {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 150px;
  width: 100%;
}

/** 你的名字 label */
.name-space #name-label {
  text-align: end;
  width: 50%;
  font-size: 50px;
}

/** 输入名字 input */
.name-space #username {
  outline: none;
  width: 300px;
  height: 45px;
  padding: 10px;
  border-radius: 15px;
  font-size: 30px;
}
.name-space #name-tip {
  font-size: 20px;
  color: red;
}


/* 按钮样式 */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}


.noselect {
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
		-webkit-tap-highlight-color: transparent;
}

button {
  
	width: 304px;
	height: 50px;
	cursor: pointer;
	background: #6dd6d1;
	border: none;
border-radius: 15px;
	box-shadow: 0px 10px 25px #57aba7, 0px -10px 25px #a6fffa, inset 0px -5px 10px #57aba7, inset 0px 5px 10px #a6fffa;
	font-family: 'Damion', cursive;
	color: white;
	font-size: 20px;
	transition: 500ms;
}

button:hover {
		border: 2px solid #6dd6d1;
	animation: hueRotation 2s linear infinite;
}

@keyframes hueRotation {
	to {filter: hue-rotate(360deg);}
}

button:focus {
	outline: none;
}

/* 文字样式 */

.bounce {
   text-align: center;
  font-size: 200px;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
	color: #2d303a;
  height: 100%;
  font: normal bold 6rem "Product Sans", sans-serif;
  white-space: nowrap;
}

.letter {
  animation: bounce 0.75s cubic-bezier(0.05, 0, 0.2, 1) infinite alternate;
  display: inline-block;
  transform: translate3d(0, 0, 0);
  margin-top: 0.5em;
  text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
  font: normal 500 10rem 'Varela Round', sans-serif;
}
.letter:nth-child(1) {
  animation-delay: 0s;
}
.letter:nth-child(2) {
  animation-delay: 0.0833333333s;
}
.letter:nth-child(3) {
  animation-delay: 0.1666666667s;
}
.letter:nth-child(4) {
  animation-delay: 0.25s;
}
.letter:nth-child(5) {
  animation-delay: 0.3333333333s;
}
.letter:nth-child(6) {
  animation-delay: 0.4166666667s;
}


@keyframes bounce {
  0% {
    transform: translate3d(0, 0, 0);
    text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
  }
  100% {
    transform: translate3d(0, -1em, 0);
    text-shadow: rgba(255, 255, 255, 0.4) 0 1em 0.35em;
  }
}
</style>