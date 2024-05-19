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
  --milk:#ecede8;
  --transparent-blue:rgba(0, 0, 252, .6);
  --light-violet:#8D6DD7;
}
* {
  font-family: Verdana, Tahoma, sans-serif;
}
body{
  margin: 0;
}
</style>
