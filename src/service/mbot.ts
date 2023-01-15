import { useRequest } from "../utils/request";
import { useStore } from "@/stores/store";
import { Userinfo, SiteConfig } from "@/types/types";
import { apis } from "@/api";

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

export const saveSite = async (siteConfig: any) => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest<any>(baseUrl + apis.saveSite + "?access_key=" + accessKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(siteConfig),
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
