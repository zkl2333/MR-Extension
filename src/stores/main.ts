import { AuthData, Userinfo } from "@/types/types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getMyAccount } from "@/api";

export const useStore = defineStore("main", () => {
  // 状态
  const authData = ref<AuthData>({
    baseUrl: "",
    accessKey: "",
  });
  const userinfo = ref<Userinfo | null>(null);
  const siteInfo = ref({});

  // 计算属性
  const isLogin = computed(() => {
    if (!userinfo.value) return false;
    return userinfo.value.username !== "";
  });
  const init = computed(() => {
    return authData.value.baseUrl !== "";
  });

  // 获取本地存储的数据
  const getAuthData = async () => {
    const { baseUrl, accessKey } = await chrome.storage.sync.get(["baseUrl", "accessKey"]);
    console.log(baseUrl, accessKey);
    if (!baseUrl || !accessKey) return;
    authData.value = { baseUrl, accessKey };
    const [res] = await getMyAccount();
    if (res) {
      userinfo.value = res;
    }
  };

  // 监听本地存储变化
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync") {
      if (changes.baseUrl || changes.accessKey) getAuthData();
    }
  });

  // 清空数据
  const logout = () => {
    userinfo.value = null;
    chrome.storage.sync.remove(["baseUrl", "accessKey"]);
  };

  // 初始化
  getAuthData();

  return {
    userinfo,
    init,
    isLogin,
    authData,
    siteInfo,
    logout,
  };
});
