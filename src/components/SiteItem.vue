<template>
  <div class="site-item">
    <div class="left">
      <div class="name" @click.stop="openUrl(siteConfig.domain)">{{ siteConfig?.name }}</div>
      <span class="status-text">
        <template v-if="siteSetting">
          <el-tag v-if="siteSetting.status === 1" size="small" type="success">可用</el-tag>
          <el-tag v-else-if="siteSetting.status === 2" size="small" type="danger">异常</el-tag>
          <el-tag v-else type="warning" size="small">未知</el-tag>
        </template>
        <template v-else>
          <el-tag size="small" type="info">可提交</el-tag>
        </template>
      </span>
    </div>
    <div class="right">
      <el-button v-if="!siteCookie" type=" " size="small" @click.stop="openUrl(siteConfig.domain)">
        去登录
      </el-button>
      <el-button
        v-else
        type="primary"
        size="small"
        :loading="loading"
        :plain="siteSetting"
        @click.stop="submitSite"
      >
        {{ siteSetting ? "更新" : "提交" }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { initSites } from "@/service/initSite";
  import { saveSite } from "@/service/mbot";
  import type { SiteConfig, SiteSetting } from "@/types/types";
  import { openUrl } from "@/utils/utils";
  import { ElNotification } from "element-plus";
  import "element-plus/theme-chalk/src/base.scss";
  import "element-plus/theme-chalk/src/notification.scss";
  import { ref } from "vue";

  const loading = ref(false);

  const { siteSetting, siteConfig, siteCookie } = defineProps<{
    siteConfig: SiteConfig;
    siteSetting: SiteSetting | null;
    siteCookie?: string;
  }>();

  const submitSite = async () => {
    if (!siteCookie) {
      openUrl(siteConfig.domain);
      return;
    }
    loading.value = true;
    const [res, error] = await saveSite({
      siteConfig,
      siteSetting: siteSetting,
      siteCookie,
    });
    if (error) {
      ElNotification({
        type: "error",
        title: siteConfig.name + "保存失败",
        message: error.message,
      });
    } else {
      ElNotification({
        type: "success",
        title: siteConfig.name + "保存成功",
        message: "站点" + siteConfig.name + "保存成功",
      });
      initSites();
    }
    loading.value = false;
  };
</script>

<style lang="scss" scoped>
  .site-item {
    padding: 10px;
    // border: 1px solid #ccc;
    box-shadow: 0 0 2px #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      flex: 1;
      display: flex;
      // flex-direction: column;
      // justify-content: center;
      align-items: center;

      .name {
        font-size: 16px;
        font-weight: bold;
        // margin-bottom: 8px;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
</style>
