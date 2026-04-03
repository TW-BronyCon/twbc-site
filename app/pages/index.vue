<script setup lang="ts">
import { ref, computed } from 'vue'

const { t, tm } = useI18n()

// ---------- Head Config (SEO & Fonts) ----------
useHead({
  title: 'TWBC',
  meta: [
    { name: 'description', content: '' },
    { property: 'og:site_name', content: 'TWBC' },
    { property: 'og:url', content: '' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: '' },
    { property: 'og:description', content: '' },
    { property: 'og:image', content: '' },
    { property: 'og:image:width', content: '630' },
    { property: 'og:image:height', content: '1200' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:domain', content: '' },
    { property: 'twitter:url', content: '' },
    { name: 'twitter:title', content: 'TWBC' },
    { name: 'twitter:description', content: '' },
    { name: 'twitter:image', content: '' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=10' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC&family=Outfit:wght@400;700&display=swap' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css' }
  ]
})

// ---------- Controllers (Composables) ----------
const { countdownMsg, days, hours, minutes, seconds } = useCountdown(
  '2026-08-15T10:00:00+08:00',
  '2026-08-15T21:00:00+08:00'
)

// Translate countdown status message (composable returns keys like 'eventEnded')
const translatedCountdownMsg = computed(() => {
  if (!countdownMsg.value) return ''
  return t(`home.countdown.${countdownMsg.value}`)
})

// Get quotes from locale file as a reactive array
const quotes = computed(() => {
  const raw = tm('home.quotes')
  if (!Array.isArray(raw)) return []
  return raw.map((q) => (typeof q === 'string' ? q : String(q.value || '')))
})
const { currentQuote, isQuoteFadingOut } = useQuotes(quotes.value)

const bgEl = ref(null)
const bg2El = ref(null)
useParallax(bgEl, bg2El)
</script>

<template>
  <div class="homepage-root">
    <!-- Parallax Backgrounds -->
    <div class="bg" ref="bgEl"></div>
    <div class="bg2" ref="bg2El"></div>

    <div class="container">
      <div class="title">
        Taiwan BronyCon
        <div class="subtitle">{{ $t('home.subtitle') }}</div>
        <div class="countdown">
          <span v-if="translatedCountdownMsg" class="countdown-message">{{ translatedCountdownMsg }}</span>
          <template v-else>
            <span>{{ days }}</span> {{ $t('home.countdown.days') }}
            <span>{{ hours }}</span> {{ $t('home.countdown.hours') }}
            <span>{{ minutes }}</span> {{ $t('home.countdown.minutes') }}
            <span>{{ seconds }}</span> {{ $t('home.countdown.seconds') }}
          </template>
        </div>
      </div>

      <NavBlock to="/ticket">
        {{ $t('home.nav.title') }}<br>{{ $t('home.nav.titleSub') }}
      </NavBlock>
      <NavBlock to="/ticket">{{ $t('home.nav.tickets') }}</NavBlock>
      <NavBlock to="/news">{{ $t('home.nav.news') }}</NavBlock>
      <NavBlock to="/about">{{ $t('home.nav.about') }}</NavBlock>
      <NavBlock to="/events">{{ $t('home.nav.events') }}</NavBlock>
      <NavBlock to="/apply">{{ $t('home.nav.apply') }}</NavBlock>
    </div>

    <!-- Footer -->
    <footer class="overlay">
      <div class="footer">
        <div class="cr">{{ $t('home.footer.copyright') }}<br>{{ $t('home.footer.copyrightNotice') }}</div>
        <div class="Quotes">
          <p :class="['quote-text', isQuoteFadingOut ? 'fade-out' : 'fade-in']">
            {{ currentQuote }}
          </p>
        </div>
        <div class="footer-links">
          <a href="https://www.youtube.com/@TWBronyCon2" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          <a href="https://discord.gg/k83NMPUKxG" target="_blank" aria-label="Discord"><i class="fa-brands fa-discord"></i></a>
          <a href="https://www.facebook.com/profile.php?id=61583292256078" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://x.com/TWBronycon2" target="_blank" aria-label="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.instagram.com/taiwanbronycon2" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped src="~/assets/css/homepage.css"></style>
