<script setup lang="ts">
useSeoMeta({
  title: '首頁',
  description: 'Taiwan BronyCon 台灣馬聚是一場結合創作、市集與交流的粉絲活動，帶來商販、場地地圖、時間安排與完整活動資訊，邀請所有喜愛小馬與創作文化的你一同參與。',
  ogSiteName: 'TWBC台灣馬聚',
  ogType: 'website',
  ogUrl: 'https://twbronycon.org/',
  ogDescription: 'Taiwan BronyCon 台灣馬聚是一場結合創作、市集與交流的粉絲活動，帶來商販、場地地圖、時間安排與完整活動資訊，邀請所有喜愛小馬與創作文化的你一同參與。',
  ogImage: '/img/Mascot_101.avif',
  ogImageWidth: 1200,
  ogImageHeight: 1200,
  ogTitle: 'TWBC台灣馬聚',
  twitterTitle: 'TWBC台灣馬聚',
  twitterDescription: 'Taiwan BronyCon 台灣馬聚是一場結合創作、市集與交流的粉絲活動，帶來商販、場地地圖、時間安排與完整活動資訊，邀請所有喜愛小馬與創作文化的你一同參與。',
  twitterCard: 'summary_large_image',
  twitterImage: '/img/Mascot_101.avif'
})

useHead({
  htmlAttrs: {
    lang: 'zh-Hant'
  },
  titleTemplate: 'TWBC台灣馬聚-%s',
  meta: [
    { name: 'format-detection', content: 'telephone=no' },
    { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
    { 'http-equiv': 'Pragma', content: 'no-cache' },
    { 'http-equiv': 'Expires', content: '0' }
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
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
