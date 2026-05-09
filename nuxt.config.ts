// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Global CSS
  css: ['~/assets/css/global.css'],

  app: {
    head: {
      titleTemplate: 'TWBC台灣馬聚-%s',
      title: '首頁',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=10',
      meta: [
        { name: 'description', content: 'Taiwan BronyCon 台灣馬聚是一場結合創作、市集與交流的粉絲活動，帶來商販、場地地圖、時間安排與完整活動資訊，邀請所有喜愛小馬與創作文化的你一同參與。' },
        { name: 'format-detection', content: 'telephone=no' },
        { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { 'http-equiv': 'Pragma', content: 'no-cache' },
        { 'http-equiv': 'Expires', content: '0' },
        // Open Graph
        { property: 'og:site_name', content: 'TWBC台灣馬聚' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://rhyme.twbronycon.org/' },
        { property: 'og:description', content: 'Taiwan BronyCon 台灣馬聚是一場結合創作、市集與交流的粉絲活動，帶來商販、場地地圖、時間安排與完整活動資訊，邀請所有喜愛小馬與創作文化的你一同參與。' },
        { property: 'og:image', content: 'https://rhyme.twbronycon.org/img/Mascot_101.avif' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '1200' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://rhyme.twbronycon.org/img/Mascot_101.avif' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap' }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-QN69QWDCDV',
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QN69QWDCDV');
          `,
          type: 'text/javascript'
        }
      ]
    }
  },

  // Modules
  modules: ['@nuxtjs/i18n'],

  // i18n configuration
  i18n: {
    locales: [
      { code: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'zh-TW',
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
