import { getSitesConfig, saveSite, getSitesSetting } from "../src/api/index";

// 用于获取站点的cookie
const getCookies = async (url) => {
    const cookie = await chrome.cookies.getAll({ url: url, });
    if (cookie.length == 0) {
        return "";
    }
    return cookie.map((item) => {
        return item.name + "=" + item.value;
    }).join(";") + ";";
}

const defaultSiteSetting = {
    "site_name": "",
    "cookie": "",
    "web_search": true,
    "smart_download": true,
    "traffic_management_status": 0,
    "upload_kpi": 1024,
    "proxies": "",
    "user_agent": ""
}

// 初始化
chrome.storage.sync.get(["baseUrl", "accessKey"], (result) => {
    if (result.baseUrl) {
        document.querySelector("#baseUrl").value = result.baseUrl;
    }
    if (result.accessKey) {
        document.querySelector("#accessKey").value = result.accessKey;
    }
});

const setLoading = (loading) => {
    if (loading) {
        document.querySelector("#start").setAttribute("disabled", "disabled");
        document.querySelector("#start").innerText = "正在保存...";
    } else {
        document.querySelector("#start").removeAttribute("disabled");
        document.querySelector("#start").innerText = "保存";
    }
}

document.querySelector("#start").addEventListener("click", async () => {
    const baseUrl = document.querySelector("#baseUrl").value;
    const accessKey = document.querySelector("#accessKey").value;
    document.querySelector("#baseUrl-error").innerText = "";
    document.querySelector("#accessKey-error").innerText = "" ;
    // 数值验证
    if (!baseUrl) {
        document.querySelector("#baseUrl-error").innerText = "请输入正确的网址";
        return
    }
    if (!accessKey) {
        document.querySelector("#accessKey-error").innerText = "请输入正确的秘钥";
        return;
    }
    setLoading(true);
  
    // 持久化
    chrome.storage.sync.set({
        baseUrl: baseUrl,
        accessKey: accessKey,
    });
    const sitesSettingMap = {}
    const [sitesConfig, getSitesConfigError] = await getSitesConfig({
        baseUrl: baseUrl,
        accessKey: accessKey,
    });
    if (getSitesConfigError) {
        alert(getSitesConfigError);
        setLoading(false);
        return;
    }
    const [sitesSetting, getSitesSettingError] = await getSitesSetting({
        baseUrl: baseUrl,
        accessKey: accessKey,
    });
    if (getSitesSettingError) {
        alert(getSitesSettingError);
        setLoading(false);
        return;
    }
    for (let i = 0; i < sitesConfig.length; i++) {
        const siteConfig = sitesConfig[i];
        if (siteConfig.login && siteConfig.login.required !== false) {
            const cookie = await getCookies(siteConfig.domain);
            const siteSetting = sitesSetting.find((setting) => {
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
        saveSitePromises.push(saveSite({
            baseUrl: baseUrl,
            accessKey: accessKey,
        }, sitesSettingMap[key]));
    }
    Promise.allSettled(saveSitePromises).then((results) => {
        let success = 0;
        let fail = 0;
        let errorMsg = "";
        for (let i = 0; i < results.length; i++) {
            if (results[i].status == "fulfilled") {
                const [res, err] = results[i].value;
                if (res) {
                    success++;
                }
                if (err) {
                    fail++;
                    errorMsg += err.message + "\n";
                }
            } else {
                fail++;
                errorMsg += results[i].reason.message + "\n";
            }
        }
        setLoading(false);
        alert(`成功保存${success}个站点配置，失败${fail}个，失败原因：\n${errorMsg}`);
    });
});

// 全局异常捕获
window.addEventListener("error", (e) => {
    alert(e.message);
});