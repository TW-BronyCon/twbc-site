<script setup lang="ts">
import { computed } from 'vue'

const { t, tm, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

// ---------- Head Config ----------
useHead({
  title: t('seo.title')
})

// ---------- Controllers ----------
const { countdownMsg, days, hours, minutes, seconds } = useCountdown(
  '2026-08-15T10:00:00+08:00',
  '2026-08-15T21:00:00+08:00'
)

const translatedCountdownMsg = computed(() => {
  if (!countdownMsg.value) return ''
  return t(`home.countdown.${countdownMsg.value}`)
})

</script>

<template>
  <div class="homepage-root">
    <main class="container">
      <section class="hero">
        <img class="logo" src="/img/text-logo.avif" alt="TWBC">

        <div class="date">{{ $t('home.subtitle') }}</div>

        <div class="count-title">{{ $t('home.countdown.title') }}</div>
        <div class="countdown">
          <span v-if="translatedCountdownMsg" class="countdown-message">{{ translatedCountdownMsg }}</span>
          <template v-else>
            <span>{{ days }}</span> {{ $t('home.countdown.days') }}
            <span>{{ hours }}</span> {{ $t('home.countdown.hours') }}
            <span>{{ minutes }}</span> {{ $t('home.countdown.minutes') }}
            <span>{{ seconds }}</span> {{ $t('home.countdown.seconds') }}
          </template>
        </div>

        <NuxtLink class="buy-btn" :to="localePath('/ticket')">{{ $t('home.nav.tickets') }}</NuxtLink>
      </section>

      <!-- <div class="spacer"></div> -->

      <section class="info-card">
        <h2>{{ $t('home.about.title') }}</h2>
        <h4>{{ $t('home.about.content') }}</h4>
        <h4 class="pinkie-quote align-right">{{ $t('home.about.pinkiequote') }}</h4>
      </section>

      <section class="info-card">
        <h2>{{ $t('home.location.title') }}</h2>
        <h4 style="text-align: center;">
          {{ $t('home.location.name') }}<br>
          {{ $t('home.location.address') }}
        </h4>
        <iframe 
          class="map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d903.4343855604266!2d121.4858447!3d25.0768833!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a8d751f69539%3A0x3363e968c8ea913!2zQXNpIFNwYWNlIFJlbnRhbCDpmL_mlq_nlJ_mtLvnqbrplpPloLTlnLDlh7rnp58!5e0!3m2!1szh-TW!2stw!4v1777220130926!5m2!1szh-TW!2stw"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </section>

      <section class="info-card large">
        <h2>{{ $t('home.faq.title') }}</h2>
        <div v-for="i in 4" :key="i">
          <h4>Q：{{ $t(`home.faq.q${i}`) }}</h4>
          <p>A：{{ $t(`home.faq.a${i}`) }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped src="~/assets/css/homepage.css"></style>
