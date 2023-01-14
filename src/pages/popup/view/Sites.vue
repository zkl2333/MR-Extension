<template>
  <ul>
    <li v-for="item in sitesConfig" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import { getSitesConfig, getSitesSetting } from "@/api";
  import { SiteConfig } from "@/types/types";
  import { ref } from "vue";

  const sitesConfig = ref<SiteConfig[]>([]);
  const sitesSetting = ref([]);

  const fetchDatas = async () => {
    const [_sitesConfig, getSitesConfigError] = await getSitesConfig();
    const [_sitesSetting, getSitesSettingError] = await getSitesSetting();
    if (getSitesConfigError || getSitesSettingError) {
      return;
    }
    if (!_sitesConfig || !_sitesSetting) {
      return;
    }
    sitesConfig.value = _sitesConfig;
    sitesSetting.value = _sitesSetting;
  };
  fetchDatas();
</script>

<style scoped lang="scss">
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
  }
  li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
</style>
