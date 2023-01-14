import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version.replace(/[^\d.-]+/g, "").split(/[.-]/);

export default defineManifest(async (env) => {
  return {
    name: env.mode === "development" ? "[开发环境] MR Extension" : "MR Extension",
    description: "MR的浏览器插件",
    version: `${major}.${minor}.${patch}.${label}`,
    manifest_version: 3,
    action: {
      default_title: "点击打开",
      default_popup: "popup.html",
    },
    host_permissions: ["*://*/*"],
    permissions: ["cookies", "storage"],
    icons: {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png",
    },
    version_name: version,
  };
});
