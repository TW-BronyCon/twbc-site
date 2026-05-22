<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { t, tm } = useI18n()
const localePath = useLocalePath()

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

const isLayoutHidden = ref(false)
const toggleLayout = () => {
  isLayoutHidden.value = !isLayoutHidden.value
}

// Mobile Nav
const isNavOpen = ref(false)
const openSubmenu = ref<string | null>(null)

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
  if (!isNavOpen.value) openSubmenu.value = null
}

const toggleSubmenu = (name: string) => {
  openSubmenu.value = openSubmenu.value === name ? null : name
}

const closeMenus = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.top-nav') && !target.closest('.nav-toggle')) {
    isNavOpen.value = false
    openSubmenu.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>

<template>
  <div class="homepage-root" :class="{ 'layout-hidden': isLayoutHidden }">
    <SharedBackground variant="homepage" />

    <button class="nav-toggle invisible" :class="{ active: isNavOpen }" @click.stop="toggleNav">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="top-nav invisible" :class="{ open: isNavOpen }">
      <ul class="menu">
        <li class="menu-group" :class="{ open: openSubmenu === 'apply' }">
          <span @click="toggleSubmenu('apply')">{{ $t('menu.apply') }}</span>
          <ul class="submenu">
            <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSc-oA7Cbqis71Azd_7ZF2i6e7OqMr9h5pXCwP8D7IZFfIiCFg/viewform" target="_blank">{{ $t('apply.volunteer') }}</a></li>
            <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSe_AH-DG67VmJxCAm8Dt07m8IosoE765XZKukSn5AIWN-HIvQ/viewform" target="_blank">{{ $t('apply.vendor') }}</a></li>
            <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSf1h5OaWHYf2cdqkEwWk_SWcNioLj89ilOAtr1g1sbupTPk1w/viewform" target="_blank">{{ $t('apply.event') }}</a></li>
          </ul>
        </li>
      </ul>
      <!-- unfinished pages use disable btn instead -->
      <!-- <NuxtLink :to="localePath('/timetable')">{{ $t('menu.timetable') }} ({{ $t('apply.comingSoon') }})</NuxtLink>
      <NuxtLink :to="localePath('/location')">{{ $t('menu.location') }} ({{ $t('apply.comingSoon') }})</NuxtLink> -->
      <span class="disabled">{{ $t('menu.timetable') }} ({{ $t('apply.comingSoon') }})</span>
      <span class="disabled">{{ $t('menu.location') }} ({{ $t('apply.comingSoon') }})</span>

    </nav>

    <main class="container">
      <section class="hero">
        <img class="logo translucent" src="/img/text-logo.avif" alt="TWBC" @click="toggleLayout">

        <div class="date translucent">{{ $t('home.subtitle') }}</div>

        <div class="count-title translucent">{{ $t('home.countdown.title') }}</div>
        <div class="countdown translucent">
          <span v-if="translatedCountdownMsg" class="countdown-message">{{ translatedCountdownMsg }}</span>
          <template v-else>
            <span>{{ days }}</span> {{ $t('home.countdown.days') }}
            <span>{{ hours }}</span> {{ $t('home.countdown.hours') }}
            <span>{{ minutes }}</span> {{ $t('home.countdown.minutes') }}
            <span>{{ seconds }}</span> {{ $t('home.countdown.seconds') }}
          </template>
        </div>

        <NuxtLink class="buy-btn translucent" :to="localePath('/ticket')">{{ $t('home.nav.tickets') }}</NuxtLink>
      </section>

      <div class="spacer"></div>

      <section class="info-card invisible">
        <h2>{{ $t('home.about.title') }}</h2>
        <h4>{{ $t('home.about.content') }}</h4>
        <h4 class="pinkie-quote align-right">{{ $t('home.about.pinkiequote') }}</h4>
      </section>

      <section class="info-card invisible">
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

      <section class="info-card large invisible">
        <h2>{{ $t('home.faq.title') }}</h2>
        <div v-for="i in 4" :key="i">
          <h4>Q：{{ $t(`home.faq.q${i}`) }}</h4>
          <p>A：{{ $t(`home.faq.a${i}`) }}</p>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped src="~/assets/css/homepage.css"></style>
