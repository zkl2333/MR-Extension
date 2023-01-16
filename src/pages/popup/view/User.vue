<template>
  <div class="userinfo">
    <div class="info">
      <el-avatar class="avatar" :size="100" :src="avatarUrl">
        {{ userName }}
      </el-avatar>
      <div class="username">{{ userName }}</div>
    </div>
    <div class="pt-info" v-if="store.sitesSetting">
      <div>
        总下载量：{{
          coverSize(store.sitesSetting?.reduce((acc, cur) => (acc += cur.download_size), 0))
        }}
      </div>
      <div>
        总上传量：{{
          coverSize(store.sitesSetting?.reduce((acc, cur) => (acc += cur.upload_size), 0))
        }}
      </div>
    </div>
    <div class="site-info">
      <div>
        您在 MR 中配置了 {{ configNum }} 个站点的配置文件，设置了 {{ settingNum }} 个站点，其中有
        {{ errorNum }} 个站点异常。
      </div>
      <div>
        您在当前浏览器中有 {{ cookieNum }} 个站点的 Cookie，其中
        {{ cookieNum - settingNum }} 个站点的 Cookie 可以新增到 MR 保存。
      </div>
    </div>
    <div class="logout">
      <!-- 退出 -->
      <el-button type="danger" @click="store.logout">退出</el-button>
    </div>
  </div>
  <!-- <pre class="user">{{ JSON.stringify(store.userinfo, null, 2) }}</pre> -->
</template>

<script lang="ts" setup>
  import { useStore } from "@/stores/store";
  import { getImageColor } from "@/utils/color";
  import { ref, computed } from "vue";
  import { coverSize } from "@/utils/utils";

  const store = useStore();
  const userName = computed(() => {
    return store.userInfo?.nickname || store.userInfo?.username || "";
  });
  const avatarUrl = computed(() => {
    if (store.userInfo?.avatar) {
      return store.authData.baseUrl + store.userInfo?.avatar;
    }
    return "";
  });
  const cookieNum = computed(() => {
    return Object.values(store.siteCookieMap).filter(Boolean).length;
  });
  const configNum = computed(() => {
    return store.sitesConfig?.length || 0;
  });
  const settingNum = computed(() => {
    return store.sitesSetting?.length || 0;
  });
  const errorNum = computed(() => {
    return store.sitesSetting?.filter((s) => s.status !== 1).length || 0;
  });

  const avatarColor = ref("#fff");
  const setColor = (url: string) => {
    if (url) {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = avatarUrl.value;
      img.onload = () => {
        const color = getImageColor(canvas, img);
        console.log("color", color);
        if (color) avatarColor.value = color;
      };
    }
  };
  setColor(avatarUrl.value);
</script>

<style lang="scss" scoped>
  .userinfo {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    margin-bottom: 20px;
    flex: 1;

    .info {
      .avatar {
        box-shadow: 0 0 4px 1px v-bind(avatarColor);
        &:hover {
          box-shadow: 0 0 10px 5px v-bind(avatarColor);
        }
      }
      .username {
        margin-top: 10px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
    }

    .pt-info {
      font-size: 14px;
      div {
        display: inline-block;
        margin: 0 5px;
      }
    }

    .site-info {
      width: 300px;
      margin-bottom: 120px;
      div + div {
        margin-top: 10px;
      }
    }
  }
</style>
