import { AuthData, Userinfo } from "@/types/types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStore = defineStore("main", () => {
  // 状态
  const authData = ref<AuthData>({
    baseUrl: "",
    accessKey: "",
  });
  const userInfo = ref<Userinfo | null>(null);

  // 计算属性
  const isLogin = computed(() => {
    return !!userInfo.value;
  });

  // 清空数据
  const logout = () => {
    userInfo.value = null;
    chrome.storage.sync.remove(["baseUrl", "accessKey"]);
  };

  return {
    userInfo,
    isLogin,
    authData,
    logout,
  };
});
