<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <Home></Home> -->
    <router-view />
  </div>
</template>

<script>
// import Home from './components/common/Home.vue'

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  height: 100%;
}

html,body{
              width: 100%;
              height: 100%;         }
</style>
