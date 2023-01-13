<template>
  <div class="wrap">
    <h2 class="title">MR 自动更新站点 Cookie</h2>
    <el-form :model="form" label-width="80px">
      <el-form-item label="网址" prop="baseUrl">
        <el-input v-model="form.baseUrl" placeholder="请输入网址 eg:http://localhost:3000" />
      </el-form-item>
      <el-form-item label="秘钥" prop="accessKey">
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
    <div class="help">使用文档：<a href="">点我直达</a></div>
  </div>
</template>

<style lang="scss" scoped>
  .wrap {
    .title {
      padding-left: 30px;
      text-align: center;
    }
  }
  .help {
    text-align: right;
  }
</style>

<script lang="ts" setup>
  import { ref, reactive } from "vue";
  const loading = ref(false);
  const form = reactive({
    baseUrl: "",
    accessKey: "",
  });
  const submit = async () => {
    loading.value = true;
    console.log({
      baseUrl: form.baseUrl,
      accessKey: form.accessKey,
    });
    // delay 2s
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("submit");
    loading.value = false;
  };
</script>
