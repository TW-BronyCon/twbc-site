<script setup lang="ts">
const siteUrl = 'https://twbronycon.org'
const { t, locale } = useI18n()

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogSiteName: () => t('seo.ogSiteName'),
  ogType: 'website',
  ogUrl: siteUrl,
  ogDescription: () => t('seo.description'),
  // ogImage: `${siteUrl}/img/Mascot_101.avif`,
  ogImageWidth: 1200,
  ogImageHeight: 1200,
  ogTitle: () => t('seo.ogSiteName'),
  twitterTitle: () => t('seo.ogSiteName'),
  twitterDescription: () => t('seo.description'),
  twitterCard: 'summary_large_image',
  // twitterImage: `${siteUrl}/img/Mascot_101.avif`
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value === 'en' ? 'en' : 'zh-Hant')
  },
  titleTemplate: (title) => title ? `${t('seo.ogSiteName')} - ${title}` : t('seo.ogSiteName'),
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
