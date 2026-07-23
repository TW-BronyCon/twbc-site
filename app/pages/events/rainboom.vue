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
      <div class="event-detail-container">
        <!-- Hero section with graphic and quick info -->
        <div class="event-hero">
          <div class="event-poster">
            <div class="poster-glow" />
            <div class="poster-inner">
              <i class="fa-solid fa-compact-disc disc-spinning" />
              <div class="poster-title">SONIC RAINBOOM</div>
              <div class="poster-subtitle">DJ MUSIC PARTY</div>
            </div>
          </div>

          <div class="event-summary">
            <div class="info-tag-list">
              <span class="info-tag">
                <i class="fa-solid fa-clock" />
                {{ t("events.rainboom.time") }}
              </span>
            </div>
            <p class="intro-text">
              {{ t("events.rainboom.intro") }}
            </p>
          </div>
        </div>

        <hr class="divider" />

        <!-- Highlights section -->
        <div class="event-highlights">
          <h3 class="section-title">
            <i class="fa-solid fa-star" />
            {{ t("events.rainboom.lineup") }}
          </h3>
          <div class="highlights-grid">
            <div class="highlight-card">
              <div class="card-icon">
                <i class="fa-solid fa-sliders" />
              </div>
              <div class="card-content">
                <h4>{{ t("events.rainboom.djVibe") }}</h4>
                <p>{{ t("events.rainboom.djVibeDesc") }}</p>
              </div>
            </div>

            <div class="highlight-card">
              <div class="card-icon">
                <i class="fa-solid fa-wand-magic-sparkles" />
              </div>
              <div class="card-content">
                <h4>{{ t("events.rainboom.lightShow") }}</h4>
                <p>{{ t("events.rainboom.lightShowDesc") }}</p>
              </div>
            </div>

            <div class="highlight-card">
              <div class="card-icon">
                <i class="fa-solid fa-people-group" />
              </div>
              <div class="card-content">
                <h4>{{ t("events.rainboom.singAlong") }}</h4>
                <p>{{ t("events.rainboom.singAlongDesc") }}</p>
              </div>
            </div>
          </div>
        </div>

        <hr class="divider" />

        <!-- Guidelines / Notice -->
        <div class="event-guidelines">
          <h3 class="section-title">
            <i class="fa-solid fa-circle-exclamation" />
            {{ t("events.rainboom.noticeTitle") }}
          </h3>
          <div class="guidelines-box">
            <p
              v-for="(line, idx) in t('events.rainboom.noticeContent').split(
                '\n',
              )"
              :key="idx"
            >
              {{ line }}
            </p>
          </div>
        </div>

        <!-- Back to Schedule Link -->
        <div class="back-action">
          <NuxtLink :to="localePath('/schedule')" class="back-link">
            <i class="fa-solid fa-arrow-left" />
            <span>{{ t("events.rainboom.backToSchedule") }}</span>
          </NuxtLink>
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
  display: inline-block;
  background: var(--color-tier-royale);
  color: #120b18;
  font-weight: 700;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.event-detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: var(--color-text-light);
}

/* Event Hero Layout */
.event-hero {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  gap: 2rem;
  align-items: center;
}

@media (max-width: 850px) {
  .event-hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Stylized Poster */
.event-poster {
  position: relative;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #2c1a4d, #140526);
  border-radius: 1rem;
  border: 1px solid rgba(255, 189, 222, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1.5rem;
}

.poster-glow {
  position: absolute;
  inset: -10%;
  background: radial-gradient(
    circle,
    rgba(238, 122, 176, 0.2) 0%,
    rgba(20, 155, 230, 0.2) 40%,
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
  font-size: 5rem;
  animation: spin 8s infinite linear;
  background: linear-gradient(45deg, var(--color-pink), var(--color-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(255, 189, 222, 0.5));
}

.poster-title {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  text-shadow: 0 0 10px rgba(255, 230, 167, 0.4);
}

.poster-subtitle {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  opacity: 0.8;
}

.event-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 850px) {
  .info-tag-list {
    justify-content: center;
  }
}

.info-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-gold);
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.9);
}

.divider {
  border: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 189, 222, 0.2),
    transparent
  );
  margin: 0.5rem 0;
}

/* Highlights Section */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-pink);
  margin-bottom: 1.25rem;
}

@media (max-width: 850px) {
  .section-title {
    justify-content: center;
  }
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.highlight-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(95, 45, 100, 0.25);
  border: 1px solid rgba(255, 189, 222, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 189, 222, 0.3);
  background: rgba(95, 45, 100, 0.35);
  box-shadow: 0 8px 24px rgba(95, 45, 100, 0.2);
}

.card-icon {
  font-size: 1.6rem;
  color: var(--color-gold);
  display: flex;
  align-items: flex-start;
  padding-top: 0.1rem;
}

.card-content h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.4rem 0;
}

.card-content p {
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Guidelines Section */
.guidelines-box {
  background: rgba(20, 10, 25, 0.4);
  border: 1px dashed rgba(255, 230, 167, 0.25);
  border-radius: 8px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.guidelines-box p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

/* Back Link Action */
.back-action {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.back-link:hover {
  color: #ffffff;
  background: rgba(255, 230, 167, 0.1);
  transform: translateX(-3px);
}

/* Animations */
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
