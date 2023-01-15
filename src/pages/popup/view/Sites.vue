<template>
  <div class="filter">
    <el-checkbox-group v-model="checkboxGroup" size="small">
      <el-checkbox label="isLogin">在浏览器中</el-checkbox>
      <el-checkbox label="isExist">在 MR 中</el-checkbox>
    </el-checkbox-group>
  </div>
  <ul>
    <li v-for="site in filterSites" :key="site.siteConfig.id">
      <SiteItem
        :siteConfig="site.siteConfig"
        :siteSetting="site.siteSetting"
        :siteCookie="site.siteCookie"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import SiteItem from "@/components/SiteItem.vue";
  import { useStore } from "@/stores/store";
  import { getCookies } from "@/utils/utils";
  import { ref, watchEffect, computed } from "vue";

  const checkboxGroup = ref(["isLogin"]);

  const store = useStore();
  const siteCookieMap = ref<{
    [key: string]: string;
  }>({});

  const filterSites = computed(() => {
    if (!store.sitesConfig) return [];
    return store.sitesConfig
      .map((siteConfig) => {
        const siteSetting = store.sitesSetting?.find((s) => s.site_name === siteConfig.id) || null;
        const siteCookie = siteCookieMap.value[siteConfig.id];
        return {
          siteConfig,
          siteSetting,
          siteCookie,
        };
      })
      .filter((site) => {
        if (checkboxGroup.value.includes("isExist") && !site.siteSetting) return false;
        if (checkboxGroup.value.includes("isLogin") && !site.siteCookie) return false;
        return true;
      });
  });

  watchEffect(() => {
    if (store.sitesConfig && store.sitesConfig.length > 0) {
      store.sitesConfig.forEach((siteConfig) => {
        getCookies(siteConfig.domain).then((cookies) => {
          siteCookieMap.value[siteConfig.id] = cookies;
        });
      });
    }
  });
</script>

<style scoped lang="scss">
  .filter {
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
  }
</style>
