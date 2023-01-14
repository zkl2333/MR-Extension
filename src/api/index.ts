import { useRequest } from "../service/request";
import { useStore } from "@/stores/main";
import { Userinfo } from "@/types/types";

const getAuthData = () => {
  const store = useStore();
  return store.authData;
};

const apis = {
  sites: "/api/common/sites",
  saveSite: "/api/site/save_site",
  getSites: "/api/site/get_sites",
  my_account: "/api/auth/my_account",
};

export const getSitesConfig = async () => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest(baseUrl + apis.sites + "?access_key=" + accessKey, {
    method: "GET",
  });
};

export const saveSite = async (siteConfig: any) => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest(baseUrl + apis.saveSite + "?access_key=" + accessKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(siteConfig),
  });
};

export const getSitesSetting = async () => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest(baseUrl + apis.getSites + "?access_key=" + accessKey, {
    method: "GET",
  });
};

export const getMyAccount = async () => {
  const { baseUrl, accessKey } = getAuthData();
  return await useRequest<Userinfo>(baseUrl + apis.my_account + "?access_key=" + accessKey, {
    method: "GET",
  });
};
