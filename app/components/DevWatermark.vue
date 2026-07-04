<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const { t } = useI18n()

const isPreview = computed(() => {
  if (import.meta.client) {
    const hostname = window.location.hostname
    // Show watermark if we are not on the primary production domain (e.g. localhost, staging, preview, etc.)
    return hostname !== 'twbronycon.org' && hostname !== 'www.twbronycon.org'
  }
  return false
})

// Check if page/route metadata has 'underDevelopment' set to true (checking both direct meta and matched records)
// OR if the site is not on the primary domain 'twbronycon.org'
const isDev = computed(() => {
  const routeMetaDev = route.meta.underDevelopment || route.matched.some(r => r.meta.underDevelopment)
  if (routeMetaDev) return true
  return false
})

// Get localized text for watermark and ribbon
const watermarkText = computed(() => t('development.watermark'))
const ribbonText = computed(() => t('development.ribbon'))
const previewBuildText = computed(() => t('development.preview'))
</script>

<template>
  <ClientOnly>
    <div v-if="isDev || isPreview" class="dev-watermark-container" aria-hidden="true">
      <!-- Grid of glassmorphic watermark cards with backdrop filter -->
      <div class="dev-watermark-grid">
        <div v-for="i in 80" :key="i" class="dev-watermark-item">
          <div class="dev-watermark-text">
            {{ isPreview ? previewBuildText : watermarkText }}
          </div>
        </div>
      </div>

      <!-- Diagonal corner ribbon -->
      <div class="dev-ribbon-wrapper">
        <div class="dev-ribbon" :title="ribbonText">
          {{ ribbonText }}
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.dev-watermark-container {
  position: relative;
  pointer-events: none;
}

/* Full screen grid of watermarks */
.dev-watermark-grid {
  position: fixed;
  inset: -20%; /* Offset slightly to handle rotation overflow and larger text */
  pointer-events: none;
  z-index: 9998;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  padding: 50px;
  overflow: hidden;
}

.dev-watermark-item {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(-18deg);
  user-select: none;
}

/* Glassmorphic watermark card */
.dev-watermark-text {
  /* Text styling */
  color: #ffffff;
  mix-blend-mode: difference;
  opacity: 0.12; /* Subtle opacity so it remains a background watermark */
  font-size: 80px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
}

.dev-ribbon-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  width: 160px;
  height: 160px;
  overflow: hidden;
  pointer-events: none;
  z-index: 9999;
}

.dev-ribbon {
  position: absolute;
  top: 30px;
  right: -42px;
  width: 220px;
  padding: 8px 0;
  background: linear-gradient(135deg, rgba(255, 189, 222, 0.95), rgba(255, 230, 167, 0.95));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1.5px solid rgba(255, 255, 255, 0.4);
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  color: #120b18;
  text-align: center;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transform: rotate(45deg);
  transform-origin: center;
  pointer-events: auto;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dev-ribbon:hover {
  background: linear-gradient(135deg, rgba(255, 189, 222, 1), rgba(255, 230, 167, 1));
  box-shadow: 0 4px 25px rgba(255, 189, 222, 0.5);
  letter-spacing: 0.18em;
}
</style>
