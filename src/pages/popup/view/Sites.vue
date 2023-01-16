<template>
  <div class="filter">
    <el-checkbox-group v-model="checkboxGroup" size="small">
      <el-checkbox label="isLogin">在浏览器中</el-checkbox>
      <el-checkbox label="isExist">在 MR 中</el-checkbox>
      <el-checkbox label="isNeedUpdate">MR 需要更新</el-checkbox>
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
  import { ref, computed } from "vue";

  const checkboxGroup = ref(["isNeedUpdate"]);

  const store = useStore();

  const filterSites = computed(() => {
    if (!store.sitesConfig) return [];
    return store.sitesConfig
      .map((siteConfig) => {
        const siteSetting = store.sitesSetting?.find((s) => s.site_name === siteConfig.id) || null;
        const siteCookie = store.siteCookieMap[siteConfig.id];
        return {
          siteConfig,
          siteSetting,
          siteCookie,
        };
      })
      .filter((site) => {
        const getIsNeedUpdate = () => {
          if (!site.siteCookie) return false;
          if (site.siteSetting) {
            return site.siteSetting.status !== 1;
          } else {
            return true;
          }
        };
        const isNeedUpdate = getIsNeedUpdate();
        if (checkboxGroup.value.includes("isExist") && !site.siteSetting) return false;
        if (checkboxGroup.value.includes("isLogin") && !site.siteCookie) return false;
        if (checkboxGroup.value.includes("isNeedUpdate") && !isNeedUpdate) return false;
        return true;
      });
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
