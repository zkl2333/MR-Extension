import { useRequest } from "../service/request";

const apis = {
  sites: "/api/common/sites",
  saveSite: "/api/site/save_site",
  getSites: "/api/site/get_sites",
};

interface AuthData {
  baseUrl: string;
  accessKey: string;
}

export const getSitesConfig = async ({ baseUrl, accessKey }: AuthData) => {
  return await useRequest(baseUrl + apis.sites + "?access_key=" + accessKey, {
    method: "GET",
  });
};

export const saveSite = async ({ baseUrl, accessKey }: AuthData, siteConfig: any) => {
  return await useRequest(baseUrl + apis.saveSite + "?access_key=" + accessKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(siteConfig),
  });
};

export const getSitesSetting = async ({ baseUrl, accessKey }: AuthData) => {
  return await useRequest(baseUrl + apis.getSites + "?access_key=" + accessKey, {
    method: "GET",
  });
};
