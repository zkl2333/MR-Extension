import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  name: env.mode === "staging" ? "[INTERNAL] MR Extension" : "MR Extension",
  description: "MR的浏览器插件",
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  manifest_version: 3,
  action: {
    default_title: "点击打开弹框",
    default_popup: "popup.html",
  },
  host_permissions: ["*://*/*"],
  permissions: ["cookies", "storage"],
  icons: {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png",
  },
  // semver is OK in "version_name"
  version_name: version,
}));
