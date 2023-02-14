<template>
  <el-container v-loading="loading">
    <template v-if="store.isLogin">
      <el-aside>
        <el-menu
          active-text-color="#f2ae4f"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          text-color="#fff"
          :default-active="activeKey"
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
          <div class="view-title">
            {{ activeView?.title }}
          </div>
        </el-header>
        <el-scrollbar height="100%">
          <el-main v-loading="viewLoading">
            <div class="main">
              <component :is="activeView?.component" />
            </div>
          </el-main>
        </el-scrollbar>
      </el-container>
    </template>
    <Login v-else class="login-container" />
  </el-container>
</template>

<script lang="ts" setup>
  import { ref, computed, watchEffect } from "vue";
  import { User, Postcard, InfoFilled } from "@element-plus/icons-vue";
  import Login from "../../components/Login.vue";
  import About from "./view/About.vue";
  import Sites from "./view/Sites.vue";
  import UserView from "./view/User.vue";
  import { useStore } from "@/stores/store";
  import { initUserInfo } from "@/service/initUserInfo";
  import { initSites } from "@/service/initSite";

  const loading = initUserInfo();
  const viewLoading = ref(false);
  const store = useStore();
  watchEffect(() => {
    if (store.isLogin) {
      viewLoading.value = true;
      initSites().finally(() => {
        viewLoading.value = false;
      });
    }
  });
  const isCollapse = ref(true);
  const activeKey = ref("site");

  const handleSelect = (key: string) => {
    activeKey.value = key;
  };

  const viewList = [
    {
      title: "站点信息",
      icon: Postcard,
      key: "site",
      component: Sites,
    },
    {
      title: "用户信息",
      icon: User,
      key: "user",
      component: UserView,
    },
    {
      title: "关于",
      icon: InfoFilled,
      key: "about",
      component: About,
    },
  ];

  const activeView = computed(() => viewList.find((item) => item.key === activeKey.value));
</script>

<style lang="scss">
  :root {
    width: 500px;
    overflow: hidden;
    --root-height: 600px;
    --header-height: 56px;
    height: var(--root-height);
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
  .login-container {
    padding: 50px;
  }
  .el-aside {
    width: initial;
  }

  .main {
    display: flex;
    flex-direction: column;
    min-height: calc(
      var(--root-height) - var(--header-height) - var(--el-main-padding) - var(--el-main-padding)
    );
  }
  .el-header {
    height: 56px;
    width: 100%;
    line-height: 56px;
    margin: 0;
    padding: 0;
    background: #f2f5f6;
    display: flex;

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

    .view-title {
      font-weight: bolder;
      font-size: 14px;
      margin-left: 10px;
    }
  }
</style>
