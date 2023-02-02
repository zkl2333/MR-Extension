<template>
  <div class="plugin">
    icon icon icon
    <Icon iconName="NotInterestedRounded" />
  </div>
</template>

<script lang="ts" setup>
  import { getPluginCommandList } from "@/service/mbot";
  const run = async () => {
    const pluginCommandList = await getPluginCommandList();
    console.log(pluginCommandList);
  };
  run();
</script>

<style lang="scss" scoped>
  .plugin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 30px;
    flex: 1;
  }
</style>
