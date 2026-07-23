<script setup lang="ts">
import Home from "~/pages/home.vue";
const { t } = useI18n();

definePageMeta({
  underDevelopment: false,
});

const route = useRoute();
const siteUrl = "https://twbronycon.org";

useSeoMeta({
  title: () => t("seo.title"),
  ogTitle: () => t("seo.title"),
  twitterTitle: () => t("seo.title"),
  description: () => t("seo.description"),
  ogDescription: () => t("seo.description"),
  twitterDescription: () => t("seo.description"),
  ogImage: `${siteUrl}/img/text-logo.avif`,
  twitterImage: `${siteUrl}/img/text-logo.avif`,
  ogUrl: computed(() => `${siteUrl}${route.path}`),
});
</script>

<template>
  <Home />
</template>
