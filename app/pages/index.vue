<script setup lang="ts">
const { t } = useI18n();

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
