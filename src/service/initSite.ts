import { getSitesConfig, getSitesSetting } from "./mbot";
import { useStore } from "../stores/store";

export const initSites = async () => {
  const [_sitesConfig, getSitesConfigError] = await getSitesConfig();
  const [_sitesSetting, getSitesSettingError] = await getSitesSetting();
  console.log("initSites", _sitesConfig, _sitesSetting);
  if (getSitesConfigError || getSitesSettingError) {
    return false;
  }
  const store = useStore();
  store.sitesConfig = _sitesConfig;
  store.sitesSetting = _sitesSetting;
};
