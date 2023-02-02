<template>
  ?
  <!-- <img :src="Icon" :alt="iconName" /> -->
</template>

<script lang="ts" setup>
  import { defineProps, ref } from "vue";
  const { iconName } = defineProps<{
    iconName: string;
  }>();
  const styles = ["filled", "outlined", "round", "sharp", "two-tone"];
  const pascalStyles = ["Filled", "Outlined", "Rounded", "Sharp", "TwoTone"];
  // kabab to pascal
  const toPascal = (str: string) =>
    styles.findIndex((s) => s === str) > -1
      ? pascalStyles[styles.findIndex((s) => s === str)]
      : str
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join("");

  // pascel to kabab
  const toKabab = (str: string) =>
    str
      .split(/(?=[A-Z])/)
      .map((s) => s.toLowerCase())
      .join("-");

  let style = "filled";
  let icon = "face";
  for (const _style of styles) {
    const pascalStyle = toPascal(_style);
    if (iconName.includes(pascalStyle)) {
      style = style;
      icon = toKabab(iconName.replace(pascalStyle, ""));
      continue;
    }
  }

  const getPath = (icon: string, style: string) => {
    return `@material-design-icons/svg/${style}/${icon}.svg`;
  };

  // 动态引入
  const path = getPath(icon, style);
  const run = async () => {
    const Icon = await import(/* @vite-ignore */ path);
    console.log(Icon);
  };
  run();
</script>
