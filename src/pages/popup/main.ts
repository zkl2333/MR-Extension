import { createApp } from "vue";
import App from "./Popup.vue";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");

// 发出一个消息，告诉content-script，popup已经加载完毕
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  if (tabs[0].id) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { greeting: "你好，我是popup，我已经加载完毕了" },
      function (response) {
        console.log(response);
      }
    );
  }
});
