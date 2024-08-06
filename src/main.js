import { createApp } from "vue";

import VueKonva from 'vue-konva';

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import App from "./App.vue";
import router from "@/router/index.js";

const app = createApp(App);

app.use(router).use(VueKonva);
app.component('QuillEditor', QuillEditor);

app.mount("#app");
