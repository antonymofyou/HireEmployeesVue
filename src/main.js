import { createApp } from "vue";
import VueKonva from 'vue-konva';

import App from "./App.vue";
import router from "@/router/index.js";

const app = createApp(App);

app.use(router).use(VueKonva).mount("#app");
