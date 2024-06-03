import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index.js";

import clickOutside  from "./directives/clickOutside";

const app = createApp(App);

app.directive('clickOutside', clickOutside);
app.use(router).mount("#app");
