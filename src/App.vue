<template>
  <main>
    <router-view></router-view>
  </main>
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
  --cinnabar: #e94141;
  --link-water: #ece9f9;
  --apple: #49bf49;
  --ronchi: #e7c950;
  --mine-shaft: #212121;
  --shark: #1f222a;
  --tundora: #4e4b4b;
  --black-squeeze: #edf6f9;

}
* {
  font-family: Verdana, Tahoma, sans-serif;

  box-sizing: border-box;
}
body {
  margin: 0;
}

main {
  padding: 0 20px;
}

h1 {
  font-weight: 400;
  font-size: 30px;
}

h2 {
  font-size: 22px;
}

@media screen and (max-width: 425px) {
  h1 {
    font-size: 21px;
  }
  h2 {
    font-size: 16px;
  }
  p, span {
    font-size: 13px;
  }
}
</style>
