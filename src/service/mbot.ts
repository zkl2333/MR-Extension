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
  siteCookie,
}: {
  siteConfig: SiteConfig;
  siteCookie: string;
  siteSetting: SiteSetting | null;
}) => {
  const { baseUrl, accessKey } = getAuthData();
  let newSiteSetting = {};
  if (!siteSetting) {
    newSiteSetting = Object.assign({}, defaultSiteSetting, {
      site_name: siteConfig.id,
      cookie: siteCookie,
    });
  } else {
    newSiteSetting = {
      site_name: siteConfig.id,
      cookie: siteCookie,
      proxies: siteSetting.proxies,
      user_agent: siteSetting.user_agent,
      web_search: siteSetting.web_search === 1,
      smart_download: siteSetting.smart_download === 1,
      traffic_management_status: siteSetting.traffic_management_status,
      upload_kpi: siteSetting.upload_kpi,
    };
  }

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
  return await useRequest<Userinfo>(baseUrl + apis.my_account + "?access_key=" + accessKey, {
    method: "GET",
  });
};
