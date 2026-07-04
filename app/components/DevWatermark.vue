<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const { t } = useI18n()

// Check if page/route metadata has 'underDevelopment' set to true (checking both direct meta and matched records)
const isDev = computed(() => {
  return !!(route.meta.underDevelopment || route.matched.some(r => r.meta.underDevelopment))
})

// Get localized text for watermark and ribbon
const watermarkText = computed(() => t('development.watermark'))
const ribbonText = computed(() => t('development.ribbon'))
</script>

<template>
  <ClientOnly>
    <div v-if="isDev" class="dev-watermark-container">
      <!-- Grid of glassmorphic watermark cards with backdrop filter -->
      <div class="dev-watermark-grid">
        <div v-for="i in 80" :key="i" class="dev-watermark-item">
          <div class="dev-watermark-card">
            {{ watermarkText }}
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
  inset: -10%; /* Offset slightly to handle rotation overflow */
  pointer-events: none;
  z-index: 9998;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
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
.dev-watermark-card {
  padding: 14px 28px;
  background: rgba(255, 189, 222, 0.02);
  border: 1px solid rgba(255, 189, 222, 0.08);
  border-radius: 12px;
  /* Apply backdrop filter to stand out on dark/complex backgrounds */
  backdrop-filter: blur(4px) brightness(1.25) contrast(0.95);
  -webkit-backdrop-filter: blur(4px) brightness(1.25) contrast(0.95);
  
  /* Text styling */
  color: rgba(255, 189, 222, 0.22);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
  
  /* Subtle drop shadows for high legibility */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
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
