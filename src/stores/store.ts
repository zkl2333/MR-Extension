import { AuthData, SiteConfig, Userinfo, SiteSetting } from "@/types/types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStore = defineStore("main", () => {
  // 状态
  const authData = ref<AuthData>({
    baseUrl: "",
    accessKey: "",
  });
  const userInfo = ref<Userinfo | null>(null);
  const sitesSetting = ref<SiteSetting[] | null>(null);
  const sitesConfig = ref<SiteConfig[] | null>(null);
  const siteCookieMap = ref<{
    [key: string]: string;
  }>({});

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
    sitesSetting,
    sitesConfig,
    siteCookieMap,
  };
});

export type Store = ReturnType<typeof useStore>;
