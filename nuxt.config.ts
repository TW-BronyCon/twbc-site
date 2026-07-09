// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Global CSS
  css: ["~/assets/css/global.css"],

  app: {
    head: {
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=10",
    },
  },

  // Modules
  modules: ["@nuxtjs/i18n"],

  // i18n configuration
  i18n: {
    locales: [
      { code: "zh-TW", name: "繁體中文", file: "zh-TW.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
    defaultLocale: "zh-TW",
    langDir: "locales/",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
});
