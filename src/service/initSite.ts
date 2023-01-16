import { getSitesConfig, getSitesSetting } from "./mbot";
import { useStore } from "../stores/store";
import { getCookies } from "@/utils/utils";

export const initSites = async () => {
  const [_sitesConfig, getSitesConfigError] = await getSitesConfig();
  const [_sitesSetting, getSitesSettingError] = await getSitesSetting();
  console.log("initSites", _sitesConfig, _sitesSetting);
  if (getSitesConfigError || getSitesSettingError) {
    return false;
  }
  const store = useStore();
  if (_sitesSetting && _sitesConfig && _sitesConfig.length > 0) {
    _sitesConfig.forEach((siteConfig) => {
      getCookies(siteConfig.domain).then((cookies) => {
        store.siteCookieMap[siteConfig.id] = cookies;
      });
    });
  }
  store.sitesConfig = _sitesConfig;
  store.sitesSetting = _sitesSetting;
};
