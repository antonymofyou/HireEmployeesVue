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
}
* {
  font-family: Verdana, Tahoma, sans-serif;
}
body{
  margin: 0;
}
</style>
