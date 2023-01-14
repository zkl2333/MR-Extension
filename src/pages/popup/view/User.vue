<template>
  <pre class="user">{{ JSON.stringify(store.userinfo, null, 2) }}</pre>
  <div>
    <!-- 退出 -->
    <el-button type="danger" @click="store.logout">退出</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { useStore } from "@/stores/main";
  const store = useStore();
</script>
