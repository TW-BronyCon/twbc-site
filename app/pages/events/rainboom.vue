<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

definePageMeta({
  underDevelopment: false,
});

useHead(() => ({
  title: `${t("events.rainboom.title")} - Taiwan BronyCon`,
  meta: [
    {
      name: "description",
      content: t("events.rainboom.intro"),
    },
  ],
}));
</script>

<template>
  <PageLayout>
    <template #title>
      <div class="event-header">
        <span class="event-badge">{{ t("events.rainboom.subtitle") }}</span>
        <h1>{{ t("events.rainboom.title") }}</h1>
      </div>
    </template>

    <template #surface>
      <div class="event-detail-grid">
        <!-- Visual Media Column -->
        <div class="event-media-col">
          <div class="main-image-container">
            <div class="poster-glow" />
            <div class="poster-inner">
              <i class="fa-solid fa-compact-disc disc-spinning" />
              <div class="poster-title">SONIC RAINBOOM</div>
              <div class="poster-subtitle">DJ MUSIC PARTY</div>
            </div>
          </div>
        </div>

        <!-- Info Column -->
        <div class="event-info-col">
          <!-- Time & Intro Card -->
          <div class="info-card">
            <h4 class="section-title">
              <i class="fa-solid fa-clock" />
              <span>{{ t("events.rainboom.time") }}</span>
            </h4>
            <p class="description-text">
              {{ t("events.rainboom.intro") }}
            </p>
          </div>

          <!-- Highlights Card -->
          <div class="info-card">
            <h4 class="section-title">
              <i class="fa-solid fa-star" />
              <span>{{ t("events.rainboom.lineup") }}</span>
            </h4>
            <div class="highlights-list">
              <div class="highlight-item">
                <div class="item-header">
                  <i class="fa-solid fa-sliders" />
                  <h5>{{ t("events.rainboom.djVibe") }}</h5>
                </div>
                <p class="description-text">
                  {{ t("events.rainboom.djVibeDesc") }}
                </p>
              </div>

              <div class="highlight-item">
                <div class="item-header">
                  <i class="fa-solid fa-wand-magic-sparkles" />
                  <h5>{{ t("events.rainboom.lightShow") }}</h5>
                </div>
                <p class="description-text">
                  {{ t("events.rainboom.lightShowDesc") }}
                </p>
              </div>

              <div class="highlight-item">
                <div class="item-header">
                  <i class="fa-solid fa-people-group" />
                  <h5>{{ t("events.rainboom.singAlong") }}</h5>
                </div>
                <p class="description-text">
                  {{ t("events.rainboom.singAlongDesc") }}
                </p>
              </div>
            </div>
          </div>

          <!-- Guidelines Card -->
          <div class="info-card">
            <h4 class="section-title">
              <i class="fa-solid fa-circle-exclamation" />
              <span>{{ t("events.rainboom.noticeTitle") }}</span>
            </h4>
            <div class="guidelines-list">
              <p
                v-for="(line, idx) in t('events.rainboom.noticeContent').split(
                  '\n',
                )"
                :key="idx"
                class="description-text"
              >
                {{ line }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions-section">
            <NuxtLink :to="localePath('/schedule')" class="back-list-btn">
              <i class="fa-solid fa-list" />
              <span>{{ t("events.rainboom.backToSchedule") }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<style scoped>
.event-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.event-badge {
  background: var(--color-gold);
  color: #120b18;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.event-detail-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 850px) {
  .event-detail-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.event-media-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 230, 167, 0.15);
  background: linear-gradient(135deg, #2c1a4d, #140526);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.poster-glow {
  position: absolute;
  inset: -10%;
  background: radial-gradient(
    circle,
    rgba(238, 122, 176, 0.15) 0%,
    rgba(20, 155, 230, 0.15) 40%,
    transparent 70%
  );
  animation: pulse-glow 6s infinite alternate ease-in-out;
}

.poster-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-pink);
  text-align: center;
}

.disc-spinning {
  font-size: 4.5rem;
  animation: spin 8s infinite linear;
  background: linear-gradient(45deg, var(--color-pink), var(--color-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(255, 189, 222, 0.5));
}

.poster-title {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  text-shadow: 0 0 10px rgba(255, 230, 167, 0.4);
}

.poster-subtitle {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  opacity: 0.8;
}

.event-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(20, 10, 25, 0.55);
  border: 1px solid rgba(255, 230, 167, 0.08);
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.15rem;
  color: var(--color-gold);
  border-bottom: 1px solid rgba(255, 230, 167, 0.15);
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.description-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.highlights-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.highlight-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gold);
}

.item-header i {
  font-size: 1rem;
}

.item-header h5 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.guidelines-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.actions-section {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}

.back-list-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: transparent;
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 700;
  transition: all 0.25s ease;
  border: 1px solid var(--color-gold);
  cursor: pointer;
}

.back-list-btn:hover {
  background: var(--color-gold);
  color: #120b18;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 230, 167, 0.25);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-glow {
  0% {
    opacity: 0.7;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1.05);
  }
}
</style>
