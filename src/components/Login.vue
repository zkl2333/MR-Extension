<template>
  <div class="wrap">
    <h2 class="title">配置您的 Movie Bot</h2>
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
    baseUrl: "",
    accessKey: "",
  });

  chrome.storage.sync.get(["baseUrl", "accessKey"], (result) => {
    form.baseUrl = result.baseUrl;
    form.accessKey = result.accessKey;
  });

  const submit = async () => {
    loading.value = true;
    chrome.storage.sync.set({
      baseUrl: form.baseUrl,
      accessKey: form.accessKey,
    });
    loading.value = false;
  };
</script>
