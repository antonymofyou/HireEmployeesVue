<template>
  <router-view></router-view>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
:root {
  --error-color: red;
  --success-color: #00d100;
  --white: #ffffff;
  --VKColor: #0077ff;
  --milk: #ecede8;
  --transparent-blue: #0000fc99;
  --light-violet: #8d6dd7;
  --cornflower-blue: #6666fd;
  --cornflower-blue-opacity-08: rgba(102, 102, 253, 0.8);
  --cinnabar: #e94141;
  --link-water: #ece9f9;
  --apple: #49bf49;
  --ronchi: #e7c950;
  --mine-shaft: #212121;
  --shark: #1f222a;
  --tundora: #4e4b4b;
  --black-squeeze: #edf6f9;
  --light-gray: #d4d4d4;
  --your-pink: #ffbcbc;

}
* {
  font-family: 'Nunito', sans-serif;
  font-weight: 300;
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6, b, strong{
  font-weight: 700
}

body {
  margin: 0;
  overflow-y: scroll;
}

main {
  padding: 0 20px;
}

h1 {
  font-size: 22px;
}

h2 {
  font-size: 18px;
}

@media screen and (max-width: 425px) {
  h1 {
    font-size: 20px;
  }
  h2 {
    font-size: 16px;
  }
  p, span {
    font-size: 13px;
  }
}
</style>
