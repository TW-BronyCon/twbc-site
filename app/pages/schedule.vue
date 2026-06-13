<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'

declare global {
  interface Window {
    renderExpoTimetable?: () => void
  }
}

const { t, locale } = useI18n()

useHead(() => ({
  title: t('schedule.title'),
}))

async function initLegacySchedule() {
  await nextTick()
  await import('~/composables/useTimeTable')
  await nextTick()

  window.renderExpoTimetable?.()
}

onMounted(async () => {
  await initLegacySchedule()
})

watch(locale, async () => {
  await nextTick()
  window.renderExpoTimetable?.()
})
</script>

<template>
  <div class="legacy-page-root">
    <div class="legacy-page-body">
      <section class="expo-tt">
        <div class="expo-tt-header">
          <h2>{{ t('schedule.title') }}</h2>
          <p>{{ t('schedule.hint') }}</p>
          <p class="touch-only">
            {{ t('schedule.mobilehint') }}
          </p>
          <p>{{ t('schedule.note') }}</p>
        </div>

        <div class="expo-tt-shell">
          <div id="expoTimetable" class="expo-tt-grid">
            <!-- useTimeTable.ts 生成 -->
          </div>
        </div>
      </section>

      <div
        id="expoTtModal"
        class="expo-tt-modal"
        aria-hidden="true"
      >
        <div
          class="expo-tt-modal-bg"
          data-close="true"
        />

        <div class="expo-tt-modal-box">
          <button
            id="expoTtModalClose"
            class="expo-tt-modal-close"
            type="button"
            :aria-label="t('common.close')"
          >
            ×
          </button>

          <div id="expoTtModalBody" />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="~/assets/css/font.css"></style>
<style src="~/assets/css/schedule.css"></style>

<style>
.legacy-page-root {
  position: relative;
  min-height: auto;
  padding-top: clamp(4.5rem, 7vw, 6.5rem);
  padding-bottom: 4rem;
}

.legacy-page-body {
  position: relative;
  z-index: 1;
}
</style>