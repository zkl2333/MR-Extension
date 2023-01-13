<template>
  <div class="wrap">
    <h2 class="title"><img src="@/assets/logo.svg" alt="logo" width="50" /> 自动更新站点 Cookie</h2>
    <el-form :model="form">
      <el-form-item prop="baseUrl">
        <el-input v-model="form.baseUrl" placeholder="请输入网址 eg:http://localhost:3000" />
      </el-form-item>
      <el-form-item prop="accessKey">
        <el-input v-model="form.accessKey" placeholder="请输入秘钥" />
      </el-form-item>
      <el-form-item>
        <el-button
          style="width: 100%"
          type="primary"
          auto-insert-space
          :loading="loading"
          @click="submit"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
    <div class="help">
      <el-button type="text" @click="openUrl('https://github.com/zkl2333/MR-Extension')">
        使用文档
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .wrap {
    padding: 20px;
    .title {
      img {
        margin-right: 10px;
      }
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
    }
  }
  .help {
    text-align: right;
  }
</style>

<script lang="ts" setup>
  import { ref, reactive } from "vue";
  import { getCookiesAndSaveSite } from "./utils";
  const loading = ref(false);
  const form = reactive({
    baseUrl: "",
    accessKey: "",
  });
  // 初始化
  chrome.storage.sync.get(["baseUrl", "accessKey"], (result) => {
    if (result.baseUrl) {
      form.baseUrl = result.baseUrl;
    }
    if (result.accessKey) {
      form.accessKey = result.accessKey;
    }
  });
  const openUrl = (url: string) => {
    chrome.tabs.create({ url });
  };
  const submit = async () => {
    loading.value = true;
    // 持久化
    chrome.storage.sync.set({
      baseUrl: form.baseUrl,
      accessKey: form.accessKey,
    });
    // delay 2s
    await getCookiesAndSaveSite(form, loading);
    loading.value = false;
  };
</script>
