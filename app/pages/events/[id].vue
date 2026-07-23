<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { events } from "~/data/scheduleData";

const { t, te, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const id = route.params.id as string;
const isEn = computed(() => locale.value.startsWith("en"));

// Find the event in schedule data
const event = computed(() => events.find((e) => e.id === id));

// Translations checks and getters
function hasTranslation(key: string): boolean {
  return te(`events.${id}.${key}`);
}

function getTranslation(key: string): string {
  return te(`events.${id}.${key}`) ? t(`events.${id}.${key}`) : "";
}

// Fallbacks for schedule events properties
const eventTitle = computed(() => {
  if (hasTranslation("title")) return getTranslation("title");
  return event.value
    ? isEn.value
      ? event.value.title.en
      : event.value.title.zh
    : "";
});

const eventDetailText = computed(() => {
  if (hasTranslation("intro")) return getTranslation("intro");
  return event.value && event.value.detail
    ? isEn.value
      ? event.value.detail.en
      : event.value.detail.zh
    : "";
});

const eventTimeRange = computed(() => {
  if (hasTranslation("time")) return getTranslation("time");
  return event.value ? `${event.value.start} - ${event.value.end}` : "";
});

const eventArea = computed(() => {
  if (!event.value) return "";
  // Resolve localized track label from columns if available, or fall back to track key
  return event.value.track;
});

useHead(() => ({
  title: event.value
    ? `${eventTitle.value} - Taiwan BronyCon`
    : t("event.notFound.title"),
  meta: [
    {
      name: "description",
      content: event.value
        ? eventDetailText.value
        : t("event.notFound.message"),
    },
  ],
}));
</script>

<template>
  <PageLayout>
    <template #title>
      <div class="event-header" v-if="event">
        <span class="event-badge" v-if="hasTranslation('subtitle')">
          {{ getTranslation("subtitle") }}
        </span>
        <h1>{{ eventTitle }}</h1>
      </div>
      <div class="event-header" v-else>
        <h1>{{ t("event.notFound.title") }}</h1>
      </div>
    </template>

    <template #surface>
      <div v-if="event" class="event-detail-container">
        <!-- Hero section with graphic and quick info -->
        <div class="event-hero info-card">
          <div class="event-poster">
            <div class="poster-glow" />
            <div class="poster-inner">
              <i class="fa-solid fa-compact-disc disc-spinning" />
              <div class="poster-title">{{ eventTitle.toUpperCase() }}</div>
              <div class="poster-subtitle">SPECIAL EVENT</div>
            </div>
          </div>

          <div class="event-summary">
            <div class="info-tag-list">
              <span class="info-tag">
                <i class="fa-solid fa-clock" />
                <span>{{ eventTimeRange }}</span>
              </span>
              <span class="info-tag" v-if="eventArea">
                <i class="fa-solid fa-location-dot" />
                <span>{{ eventArea }}</span>
              </span>
            </div>
            <p class="intro-text">
              {{ eventDetailText }}
            </p>
          </div>
        </div>

        <!-- Highlights section -->
        <div v-if="hasTranslation('lineup')" class="event-highlights info-card">
          <h3 class="section-title">
            <i class="fa-solid fa-star" />
            <span>{{ getTranslation("lineup") }}</span>
          </h3>
          <div class="highlights-grid">
            <div v-if="hasTranslation('djVibe')" class="highlight-item-box">
              <div class="item-header">
                <i class="fa-solid fa-sliders" />
                <h4>{{ getTranslation("djVibe") }}</h4>
              </div>
              <p class="description-text">
                {{ getTranslation("djVibeDesc") }}
              </p>
            </div>

            <div v-if="hasTranslation('lightShow')" class="highlight-item-box">
              <div class="item-header">
                <i class="fa-solid fa-wand-magic-sparkles" />
                <h4>{{ getTranslation("lightShow") }}</h4>
              </div>
              <p class="description-text">
                {{ getTranslation("lightShowDesc") }}
              </p>
            </div>

            <div v-if="hasTranslation('singAlong')" class="highlight-item-box">
              <div class="item-header">
                <i class="fa-solid fa-people-group" />
                <h4>{{ getTranslation("singAlong") }}</h4>
              </div>
              <p class="description-text">
                {{ getTranslation("singAlongDesc") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Guidelines / Notice -->
        <div
          v-if="hasTranslation('noticeTitle')"
          class="event-guidelines info-card"
        >
          <h3 class="section-title">
            <i class="fa-solid fa-circle-exclamation" />
            <span>{{ getTranslation("noticeTitle") }}</span>
          </h3>
          <div class="guidelines-box">
            <p
              v-for="(line, idx) in getTranslation('noticeContent').split('\n')"
              :key="idx"
              class="description-text"
            >
              {{ line }}
            </p>
          </div>
        </div>

        <!-- Back to Schedule Link -->
        <div class="actions-section">
          <NuxtLink :to="localePath('/schedule')" class="back-list-btn">
            <i class="fa-solid fa-list" />
            <span>{{
              getTranslation("backToSchedule") || t("event.backToSchedule")
            }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="not-found-state">
        <p class="not-found-message">{{ t("event.notFound.message") }}</p>
        <NuxtLink :to="localePath('/schedule')" class="back-list-btn">
          <i class="fa-solid fa-list" />
          <span>{{ t("event.backToSchedule") }}</span>
        </NuxtLink>
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

.event-detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(20, 10, 25, 0.55);
  border: 1px solid rgba(255, 230, 167, 0.08);
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
  aspect-ratio: 3 / 2;
  background: linear-gradient(135deg, #2c1a4d, #140526);
  border-radius: 10px;
  border: 1px solid rgba(255, 230, 167, 0.15);
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
  border: 1px solid rgba(255, 230, 167, 0.12);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-gold);
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.95);
}

/* Highlights Section */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.15rem;
  color: var(--color-gold);
  border-bottom: 1px solid rgba(255, 230, 167, 0.15);
  padding-bottom: 0.5rem;
  margin: 0 0 1rem 0;
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

.highlight-item-box {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 230, 167, 0.06);
  border-radius: 8px;
  transition: all 0.25s ease;
}

.highlight-item-box:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 230, 167, 0.25);
  transform: translateY(-2px);
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

.item-header h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.description-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

/* Guidelines Section */
.guidelines-box {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Actions Section */
.actions-section {
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

/* Not Found styles */
.not-found-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.not-found-message {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
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
