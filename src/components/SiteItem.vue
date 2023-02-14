<template>
  <div class="site-item" @click.stop="!!siteSetting && (drawer = true)">
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
        :plain="!!siteSetting"
        @click.stop="submitSite"
      >
        {{ siteSetting ? "更新" : "提交" }}
      </el-button>
    </div>
    <el-drawer v-model="drawer" direction="btt" size="75%">
      <template #header="{ close, titleId, titleClass }" style="margin-bottom: 10px">
        <h4 :id="titleId" :class="titleClass">
          {{ siteConfig?.name }}
        </h4>
        <div v-if="siteSetting" class="site-info">
          <span>分享率: {{ siteSetting.share_rate }}</span>
          <span>上传量: {{ coverSize(siteSetting.upload_size) }}</span>
          <span>下载量: {{ coverSize(siteSetting.download_size) }}</span>
        </div>
      </template>

      <el-form :model="form" label-width="80px" size="small">
        <el-form-item label="Cookie">
          <el-input v-model="form.cookie" type="textarea" :rows="form.cookie ? 2 : 1" />
        </el-form-item>
        <el-form-item label="User-Agent">
          <el-input v-model="form.user_agent" type="textarea" :rows="form.user_agent ? 2 : 1" />
        </el-form-item>
        <el-form-item label="代理">
          <el-input v-model="form.proxies" type="textarea" :rows="1" />
        </el-form-item>
        <el-form-item label="流量管理">
          <el-select v-model="form.traffic_management_status" placeholder="请选择">
            <el-option label="关闭流量管理" :value="0" />
            <el-option label="主动积累上传量" :value="1" />
            <el-option label="被动按需养护" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传目标量">
          <el-input v-model="form.upload_kpi" type="number" />
        </el-form-item>
        <el-checkbox v-model="form.web_search" label="允许在Web搜索中使用" />
        <el-checkbox v-model="form.smart_download" label="允许在智能下载中使用" />
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitSite">提交</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { defaultSiteSetting } from "@/constant/constant";
  import { initSites } from "@/service/initSite";
  import { saveSite } from "@/service/mbot";
  import type { SiteConfig, SiteSetting } from "@/types/types";
  import { openUrl } from "@/utils/utils";
  import { ElNotification } from "element-plus";
  import "element-plus/theme-chalk/src/base.scss";
  import "element-plus/theme-chalk/src/notification.scss";
  import { ref, reactive } from "vue";
  import { coverSize } from "@/utils/utils";

  const { siteSetting, siteConfig, siteCookie } = defineProps<{
    siteConfig: SiteConfig;
    siteSetting: SiteSetting | null;
    siteCookie?: string;
  }>();

  const loading = ref(false);
  const drawer = ref(false);
  const form = reactive({
    ...(siteSetting ? siteSetting : defaultSiteSetting),
    cookie: siteCookie || siteSetting?.cookie || "",
    web_search: siteSetting?.web_search == 1 || false,
    smart_download: siteSetting?.smart_download == 1 || false,
  });

  const submitSite = async () => {
    if (!form.cookie) {
      if (drawer.value) {
        ElNotification({
          type: "error",
          title: siteConfig.name + "保存失败",
          message: "Cookie 不能为空",
        });
      } else {
        openUrl(siteConfig.domain);
      }
      return;
    }
    loading.value = true;
    const _siteSetting = {
      ...siteSetting,
      ...form,
    };
    const [res, error] = await saveSite({
      siteConfig,
      siteSetting: _siteSetting as SiteSetting,
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
      drawer.value = false;
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
    cursor: pointer;

    :deep(.el-drawer__header) {
      margin-bottom: 12px;
    }
    .site-info {
      text-align: center;
      margin-right: 24px;
      span + span {
        margin-left: 24px;
      }
    }

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
