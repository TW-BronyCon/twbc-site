import { defineNuxtPlugin } from "#app";
import { resolveTags } from "unhead/utils";

export default defineNuxtPlugin((nuxtApp) => {
  // Retrieve the unhead instance injected by Nuxt
  const head =
    nuxtApp.$unhead ||
    nuxtApp.vueApp.config.globalProperties.$unhead ||
    (nuxtApp.vueApp._context?.provides?.usehead as any);

  if (head && typeof head.resolveTags !== "function") {
    head.resolveTags = async function () {
      return resolveTags(head);
    };
  }
});
