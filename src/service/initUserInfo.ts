import { getMyAccount } from "@/service/mbot";
import { useStore, Store } from "@/stores/store";
import { ref } from "vue";

// 获取本地存储的数据
const setAuthData = async (store: Store) => {
  const {
    baseUrl,
    accessKey,
    loginType = "accessKey",
    accessToken,
  } = await chrome.storage.sync.get(["baseUrl", "accessKey", "loginType", "accessToken"]);
  if (loginType === "accessKey") {
    if (!baseUrl || !accessKey) return;
  } else {
    if (!accessToken || !baseUrl) return;
  }
  store.authData = { baseUrl, accessKey, loginType, accessToken };
  const [res] = await getMyAccount();
  if (res) {
    store.userInfo = res;
  }
};

export const initUserInfo = () => {
  const loading = ref(true);
  // 初始化
  const store = useStore();
  setAuthData(store).finally(() => {
    loading.value = false;
  });
  // 监听本地存储变化
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync") {
      if (changes.baseUrl || changes.accessKey || changes.loginType || changes.accessToken) {
        setAuthData(store);
      }
    }
  });
  return loading;
};
