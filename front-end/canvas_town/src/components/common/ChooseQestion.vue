<template>
  <div class="choose-question">
    <ul class="music-name">
      <li v-for="(music,i) in musics" :key="i+'only'" :class="{'choose-music':isChoose}" @click="chooseMusic($event)">
        {{music}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChooseQestion',
  data () {
    return {
      musics: ['美人鱼', '稻香', '破茧', '小幸运'],
      isChoose: false
    }
  },
  methods: {
    chooseMusic (event) {
      // 获取点击的音乐名
      var nusicName = event.target.innerText
      console.log(nusicName);
      this.isChoose = true
      //   点击完过几秒弹窗关闭
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.choose-question {
  width: 250px;
  height: 300px;
  background-color: #fff;
  /* border: 1px solid gray; */
  border-radius: 10px;
}
ul {
}
li {
  width: 70%;
  height: 35px;
  list-style: none;
  border: 1px solid gray;
  border-radius: 10px;
  text-align: center;
  line-height: 35px;
  margin: 31px 36px;
  background-color: #fffed5;
}
.choose-music {
  background-color: #ffd0a7;
}
</style>>
