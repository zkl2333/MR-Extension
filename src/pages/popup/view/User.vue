<template>
  <div class="userinfo">
    <div class="info">
      <el-avatar class="avatar" :size="100" :src="avatarUrl">
        {{ userName }}
      </el-avatar>
      <div class="username">{{ userName }}</div>
    </div>
    <div class="logout">
      <!-- 退出 -->
      <el-button type="danger" @click="store.logout">退出</el-button>
    </div>
  </div>
  <!-- <pre class="user">{{ JSON.stringify(store.userinfo, null, 2) }}</pre> -->
</template>

<script lang="ts" setup>
  import { useStore } from "@/stores/main";
  import { getImageColor } from "@/utils/color";
  import { ref, computed } from "vue";

  const store = useStore();
  const userName = computed(() => {
    return store.userinfo?.nickname || store.userinfo?.username || "";
  });
  const avatarUrl = computed(() => {
    if (store.userinfo?.avatar) {
      return store.authData.baseUrl + store.userinfo?.avatar;
    }
    return "";
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
  }
</style>
