<template>
  <div class="about">
    <div class="title"><img src="@/assets/logo.svg" alt="logo" width="50" />MR Extension</div>
    <div class="content">
      <p>
        MR Extension 是一个 Chrome 插件，需要与 Movie Bot 配合使用。
        用于将当前浏览器登陆过的PT站点提交到 Movie Bot 中。
      </p>
    </div>
    <div class="footer">
      如果你有任何问题，欢迎在
      <el-button type="text" @click="openUrl('https://github.com/zkl2333/MR-Extension/issues')">
        GitHub
      </el-button>
      上提出。
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { openUrl } from "@/utils/utils";
</script>

<style lang="scss" scoped>
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 30px;
    flex: 1;
    .title {
      font-size: 30px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .content {
      text-align: center;
      line-height: 1.5;
      flex: 1;
      p {
        margin: 0;
      }
    }
    .footer {
      text-align: center;
    }
  }
</style>
