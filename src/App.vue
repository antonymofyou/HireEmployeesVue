<template>
  <router-view></router-view>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
*,
::before,
::after {
  font-family: Verdana, Tahoma, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --error-color: red;
  --success-color: #00d100;
  --white: #ffffff;
  --VKColor: #0077ff;
  --milk: #ecede8;
  --transparent-blue: #0000fc99;
  --light-violet: #8d6dd7;
  --cornflower-blue: #6666fd;
  --cinnabar: #e94141;
  --link-water: #ece9f9;
  --apple: #49bf49;
  --ronchi: #e7c950;
  --mine-shaft: #212121;
  --shark: #1f222a;
  --tundora: #4e4b4b;
  --black-squeeze: #edf6f9;
}

#app {
  padding: 0 20px;
}

@media screen and (max-width: 425px) {
  h1 {
  font-size: 1.3rem !important;
}
  h2 {
    font-size: 1rem !important;
  }

  p {
    font-size: 0.85rem !important;
  }
}
</style>
