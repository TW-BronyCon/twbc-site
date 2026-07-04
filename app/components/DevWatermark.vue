<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const { t } = useI18n()

// Check if page/route metadata has 'underDevelopment' set to true
const isDev = computed(() => !!route.meta.underDevelopment)

// Get localized text for watermark and ribbon
const watermarkText = computed(() => t('development.watermark'))
const ribbonText = computed(() => t('development.ribbon'))

// Dynamic SVG background for repeating watermark text
const svgBackground = computed(() => {
  const text = watermarkText.value || 'UNDER DEVELOPMENT'
  const svg = `<svg width="280" height="180" viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg">
    <text x="140" y="90" fill="rgba(255, 189, 222, 0.05)" font-size="13" font-weight="bold" font-family="'Noto Sans TC', system-ui, -apple-system, sans-serif" text-anchor="middle" transform="rotate(-25 140 90)">${text}</text>
  </svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
})
</script>

<template>
  <ClientOnly>
    <div v-if="isDev" class="dev-watermark-container">
      <!-- Full screen repeating background watermark -->
      <div 
        class="dev-watermark-bg" 
        :style="{ backgroundImage: svgBackground }"
      />

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

.dev-watermark-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background-repeat: repeat;
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
  background: linear-gradient(135deg, rgba(255, 189, 222, 0.9), rgba(255, 230, 167, 0.9));
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
