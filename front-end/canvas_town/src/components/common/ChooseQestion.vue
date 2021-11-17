<template>
  <div class="choose-question">
    <ul class="music-name">
      <li></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChooseQestion',
  data () {
    return {
      music: ['美人鱼', '稻香', '破茧', '小幸运']
    }
  }
}
</script>

<style scoped>
.choose-question {
  width: 400px;
  height: 500px;
  background-color: pink;
  border: 1px solid gray;
}
li {
  list-style: none;
}
</style>>
