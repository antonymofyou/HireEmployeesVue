<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
//import HelloWorld from './components/HelloWorld.vue'
</script>

<style>
:root{
  --error-color:red;
  --white: #ffffff;
  --VKColor: #0077ff;

  --cornflower-blue: #6666fd;
  --cinnabar: #e94141;
  --link-water: #ece9f9;
  --apple: #49bf49;
}
* {
  font-family: Verdana, Tahoma, sans-serif;

  box-sizing: border-box;
}
body{
  margin: 0;
}
</style>