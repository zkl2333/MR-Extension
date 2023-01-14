<template>
  <el-container>
    <el-aside>
      <el-menu
        active-text-color="#f2ae4f"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        text-color="#fff"
        :default-active="activeView"
        :collapse="isCollapse"
        @select="handleSelect"
      >
        <el-menu-item v-for="item in viewList" :key="item.key" :index="item.key">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 展开收起侧边栏 -->
        <div class="collaspse" @click="isCollapse = !isCollapse">
          <el-icon v-if="isCollapse">
            <el-icon-Expand />
          </el-icon>
          <el-icon v-else>
            <el-icon-Fold />
          </el-icon>
        </div>
      </el-header>
      <el-main>
        <div class="main">
          <component :is="viewComponent" />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import Login from "./view/Login.vue";
  import { User, Postcard, InfoFilled } from "@element-plus/icons-vue";

  const isCollapse = ref(true);
  const activeView = ref("user");

  const handleSelect = (key: string) => {
    activeView.value = key;
  };

  const viewList = [
    {
      title: "用户信息",
      icon: User,
      key: "user",
      comment: Login,
    },
    {
      title: "站点信息",
      icon: Postcard,
      key: "Site",
      comment: Login,
    },
    {
      title: "关于",
      icon: InfoFilled,
      key: "about",
      comment: Login,
    },
  ];

  const viewComponent = viewList.find((item) => item.key === activeView.value)?.comment;
</script>

<style lang="scss">
  :root {
    width: 500px;
    height: 400px;
  }
  body {
    padding: 0;
    margin: 0;
  }
  body,
  #app,
  .el-container,
  .el-menu,
  .el-main {
    height: 100%;
  }
</style>

<style lang="scss" scoped>
  .el-aside {
    width: initial;
  }

  .el-header {
    height: 56px;
    width: 100%;
    line-height: 56px;
    margin: 0;
    padding: 0;
    background: #f2f5f6;

    .collaspse {
      cursor: pointer;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      height: 56px;
      &:hover {
        background: #e6e6e6;
      }
    }
  }
</style>
