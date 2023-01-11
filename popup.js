// 用于获取站点的cookie
const getCookiePromise = (url) => {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll({ url: url, }, (cks) => {
            if (cks.length == 0) {
                resolve("");
                return;
            }
            let cookie = cks.map((item) => {
                return item.name + "=" + item.value;
            }).join(";") + ";";
            resolve(cookie);
        });
    });
}

let baseUrl = "";
let Authorization = ""

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

const apis = {
    sites: "/api/common/sites",
    saveSite: "/api/site/save_site",
    getSites: "/api/site/get_sites",
}

const getSitesSetting = async () => {
    const res = await fetch(baseUrl + apis.getSites + '?access_key=' + Authorization, {
        method: "GET",
        headers: {
            // Authorization: 'Bearer ' + Authorization,
        },
    });
    const data = await res.json();
    if (data.code == 0) {
        return data.data;
    }
    alert(data.msg || data.message);
    return [];
}

const saveSite = async (siteConfig) => {
    const res = await fetch(baseUrl + apis.saveSite + '?access_key=' + Authorization, {
        method: "POST",
        headers: {
            // Authorization: 'Bearer ' + Authorization,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(siteConfig),
    });
    const data = await res.json();
    if (data.code == 0) {
        return data.data;
    }
    throw new Error(data.msg || data.message);
}

const getSitesConfig = async () => {
    const res = await fetch(baseUrl + apis.sites + '?access_key=' + Authorization, {
        method: "GET",
        headers: {
            // Authorization: 'Bearer ' + Authorization,
        },
    });
    const data = await res.json();
    if (data.code == 0) {
        return data.data;
    }
    return [];
}

// 初始化
chrome.storage.sync.get(["baseUrl", "Authorization"], (result) => {
    if (result.baseUrl) {
        document.querySelector("#baseUrl").value = result.baseUrl;
        baseUrl = result.baseUrl;
    }
    if (result.Authorization) {
        document.querySelector("#Authorization").value = result.Authorization;
        Authorization = result.Authorization;
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
    setLoading(true);
    baseUrl = document.querySelector("#baseUrl").value;
    Authorization = document.querySelector("#Authorization").value;
    // 持久化
    chrome.storage.sync.set({
        baseUrl: baseUrl,
        Authorization: Authorization,
    });
    const sitesSettingMap = {}
    const sitesConfig = await getSitesConfig();
    const sitesSetting = await getSitesSetting();
    for (let i = 0; i < sitesConfig.length; i++) {
        const siteConfig = sitesConfig[i];
        if (siteConfig.login && siteConfig.login.required !== false) {
            const cookie = await getCookiePromise(siteConfig.domain);
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
        saveSitePromises.push(saveSite(sitesSettingMap[key]));
    }
    Promise.allSettled(saveSitePromises).then((results) => {
        let success = 0;
        let fail = 0;
        let errorMsg = "";
        for (let i = 0; i < results.length; i++) {
            if (results[i].status == "fulfilled") {
                success++;
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