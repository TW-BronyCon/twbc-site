<script setup lang="ts">
import Home from "~/pages/home.vue";
const { t } = useI18n();

definePageMeta({
  underDevelopment: false,
});

useHead({
  title: t("seo.title"),
  meta: [
    {
      name: "description",
      content: t("seo.description"),
    },
  ],
});
</script>

<template>
  <Home />
</template>
