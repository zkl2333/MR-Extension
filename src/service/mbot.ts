import { useRequest } from "../utils/request";
import { useStore } from "@/stores/store";
import { Userinfo, SiteConfig, SiteSetting } from "@/types/types";
import { apis } from "@/api";

const getAuthData = () => {
  const store = useStore();
  return store.authData;
};

// 生成 fetch 请求的参数，自动处理query参数和body
const useRequestWithAuth = <T>(api: string, options: RequestInit) => {
  const { baseUrl, accessKey, accessToken, loginType } = getAuthData();
  const url =
    baseUrl + api + (loginType === "accessKey" ? "?=" + new URLSearchParams({ accessKey }) : "");
  if (loginType === "accessToken") {
    options.headers = { Authorization: "Bearer " + accessToken, ...options.headers };
  }
  return useRequest<T>(url, options);
};

export const getSitesConfig = async () => {
  return await useRequestWithAuth<SiteConfig[]>(apis.sites, {
    method: "GET",
  });
};

export const saveSite = async ({
  siteConfig,
  siteSetting,
}: {
  siteConfig: SiteConfig;
  siteSetting: SiteSetting;
}) => {
  const newSiteSetting = {
    site_name: siteConfig.id,
    cookie: siteSetting.cookie,
    proxies: siteSetting.proxies,
    user_agent: siteSetting.user_agent,
    web_search:
      typeof siteSetting.web_search === "boolean"
        ? siteSetting.web_search
        : siteSetting.web_search === 1,
    smart_download:
      typeof siteSetting.smart_download === "boolean"
        ? siteSetting.smart_download
        : siteSetting.smart_download === 1,
    traffic_management_status: siteSetting.traffic_management_status,
    upload_kpi: siteSetting.upload_kpi,
  };
  return await useRequestWithAuth(apis.saveSite, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSiteSetting),
  });
};

export const getSitesSetting = async () => {
  return await useRequestWithAuth<any>(apis.getSites, {
    method: "GET",
  });
};

export const getMyAccount = async () => {
  return await useRequestWithAuth<Userinfo>(apis.my_account, {
    method: "GET",
  });
};
