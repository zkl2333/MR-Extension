import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";
import IconsResolver from "unplugin-icons/resolver";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    crx({ manifest }),
    AutoImport({
      resolvers: [
        IconsResolver({
          enabledCollections: ["ep"],
        }),
        ElementPlusResolver(),
      ],
    }),
    Components({
      dts: true,
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
