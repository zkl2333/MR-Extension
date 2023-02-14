import { useRequest } from "../utils/request";
import { useStore } from "@/stores/store";
import { Userinfo, SiteConfig, SiteSetting } from "@/types/types";
import { apis } from "@/api";
import { defaultSiteSetting } from "@/constant/constant";

const getAuthData = () => {
  const store = useStore();
  return store.authData;
};

export const getSitesConfig = async () => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest<SiteConfig[]>(baseUrl + apis.sites + "?access_key=" + accessKey, {
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
  const { baseUrl, accessKey } = getAuthData();
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

  return await useRequest<any>(baseUrl + apis.saveSite + "?access_key=" + accessKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSiteSetting),
  });
};

export const getSitesSetting = async () => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest<any>(baseUrl + apis.getSites + "?access_key=" + accessKey, {
    method: "GET",
  });
};

export const getMyAccount = async () => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest<Userinfo>(baseUrl + apis.myAccount + "?access_key=" + accessKey, {
    method: "GET",
  });
};

export const getPluginCommandList = async () => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest<any>(baseUrl + apis.getPluginCommandList + "?access_key=" + accessKey, {
    method: "GET",
  });
};
