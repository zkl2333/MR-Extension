import { Ref } from "vue";
import { getSitesConfig, saveSite, getSitesSetting } from "../api/index";

// 用于获取站点的cookie
const getCookies = async (url: any) => {
  const cookie = await chrome.cookies.getAll({ url: url });
  if (cookie.length == 0) {
    return "";
  }
  return (
    cookie
      .map((item) => {
        return item.name + "=" + item.value;
      })
      .join(";") + ";"
  );
};

const defaultSiteSetting = {
  site_name: "",
  cookie: "",
  web_search: true,
  smart_download: true,
  traffic_management_status: 0,
  upload_kpi: 1024,
  proxies: "",
  user_agent: "",
};

// 用于获取站点的配置并保存
export const getCookiesAndSaveSite = async (
  form: { baseUrl: string; accessKey: string },
  loading: Ref<boolean>
) => {
  const baseUrl = form.baseUrl;
  const accessKey = form.accessKey;
  //   document.querySelector("#baseUrl-error").innerText = "";
  //   document.querySelector("#accessKey-error").innerText = "";
  //   // 数值验证
  //   if (!baseUrl) {
  //     document.querySelector("#baseUrl-error").innerText = "请输入正确的网址";
  //     return;
  //   }
  //   if (!accessKey) {
  //     document.querySelector("#accessKey-error").innerText = "请输入正确的秘钥";
  //     return;
  //   }
  //   setLoading(true);
  loading.value = true;
  const sitesSettingMap: { [key: string]: typeof defaultSiteSetting } = {};
  const [sitesConfig, getSitesConfigError] = await getSitesConfig({
    baseUrl: baseUrl,
    accessKey: accessKey,
  });
  if (getSitesConfigError) {
    alert(getSitesConfigError);
    loading.value = false;
    return;
  }
  const [sitesSetting, getSitesSettingError] = await getSitesSetting({
    baseUrl: baseUrl,
    accessKey: accessKey,
  });
  if (getSitesSettingError) {
    alert(getSitesSettingError);
    loading.value = false;
    return;
  }
  for (let i = 0; i < sitesConfig.length; i++) {
    const siteConfig = sitesConfig[i];
    if (siteConfig.login && siteConfig.login.required !== false) {
      const cookie = await getCookies(siteConfig.domain);
      const siteSetting = sitesSetting.find((setting: { site_name: any }) => {
        return setting.site_name == siteConfig.id;
      });
      if (cookie) {
        if (!siteSetting) {
          const newSiteSetting = Object.assign({}, defaultSiteSetting, {
            site_name: siteConfig.id,
            cookie: cookie,
          });
          sitesSettingMap[siteConfig.id] = newSiteSetting;
        } else {
          const newSiteSetting = {
            site_name: siteConfig.id,
            cookie: cookie,
            proxies: siteSetting.proxies,
            user_agent: siteSetting.user_agent,
            web_search: siteSetting.web_search === 1,
            smart_download: siteSetting.smart_download === 1,
            traffic_management_status: siteSetting.traffic_management_status,
            upload_kpi: siteSetting.upload_kpi,
          };
          sitesSettingMap[siteConfig.id] = newSiteSetting;
        }
      }
    }
  }
  const saveSitePromises = [];
  for (let key in sitesSettingMap) {
    saveSitePromises.push(
      saveSite(
        {
          baseUrl: baseUrl,
          accessKey: accessKey,
        },
        sitesSettingMap[key]
      )
    );
  }

  Promise.allSettled(saveSitePromises).then((results) => {
    let success = 0;
    let fail = 0;
    let errorMsg = "";
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === "fulfilled") {
        const [res, err] = (results[i] as PromiseFulfilledResult<any>).value;
        if (res) {
          success++;
        }
        if (err) {
          fail++;
          errorMsg += err.message + "\n";
        }
      } else {
        fail++;
        errorMsg += (results[i] as PromiseRejectedResult).reason.message + "\n";
      }
    }
    loading.value = false;
    alert(`成功保存${success}个站点配置，失败${fail}个，失败原因：\n${errorMsg}`);
  });
};
