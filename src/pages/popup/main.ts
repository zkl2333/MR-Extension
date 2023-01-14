import { createApp } from "vue";
import App from "./Popup.vue";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");
