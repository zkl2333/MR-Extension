<template>
  <div class="wrap">
    <h2 class="title">配置您的 Movie Bot</h2>
    <el-form :model="form">
      <!-- 登陆方式 -->
      <el-form-item label="登陆方式">
        <el-radio-group v-model="form.loginType">
          <el-radio label="accessKey">accessKey</el-radio>
          <el-radio label="accessToken">accessToken</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="baseUrl">
        <el-input v-model="form.baseUrl" placeholder="请输入网址 eg:http://localhost:3000" />
      </el-form-item>
      <el-form-item v-if="form.loginType === 'accessKey'" prop="accessKey">
        <el-input v-model="form.accessKey" placeholder="请输入accessKey" />
      </el-form-item>
      <el-form-item v-if="form.loginType === 'accessToken'" prop="accessToken">
        <el-input v-model="form.accessToken" placeholder="请输入accessToken" />
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
    <div v-if="form.loginType === 'accessToken'">
      <!-- 一键获取 -->
      <el-button type="primary" @click="autoGet()">一键获取</el-button>
    </div>
    <div class="help">
      <el-link type="primary" @click="openUrl('https://github.com/zkl2333/MR-Extension')">
        使用文档
      </el-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .wrap {
    flex: 1;
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
  import { openUrl } from "../utils/utils";

  const loading = ref(false);
  const form = reactive({
    loginType: "",
    baseUrl: "",
    accessKey: "",
    accessToken: "",
  });

  chrome.storage.sync.get(["loginType", "baseUrl", "accessKey", "accessToken"], (result) => {
    form.baseUrl = result.baseUrl;
    form.loginType = result.loginType || "accessToken";
    form.accessKey = result.accessKey;
    form.accessToken = result.accessToken;
  });

  const autoGet = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log("tabs", tabs);
      if (tabs.length > 0 && tabs[0].id) {
        // 获取当前页面的localstorage
        chrome.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            func: function () {
              return JSON.stringify({
                url: window.location.href,
                accessToken: localStorage.getItem("accessToken"),
              });
            },
          })
          .then((injectionResults) => {
            injectionResults.forEach((injectionResult) => {
              const { result } = injectionResult;
              const { url, accessToken } = JSON.parse(result);
              console.log("result", { url, accessToken });
              form.baseUrl = url;
              form.loginType = "accessToken";
              form.accessToken = accessToken;
              console.log("form", form);
            });
          });
      }
    });
  };

  const submit = async () => {
    loading.value = true;
    chrome.storage.sync.set({
      baseUrl: form.baseUrl,
      loginType: form.loginType,
      accessKey: form.accessKey,
      accessToken: form.accessToken,
    });
    loading.value = false;
  };
</script>
