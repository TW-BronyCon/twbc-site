<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { events, columns } from "~/data/scheduleData";

const { t, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const id = route.params.id as string;
const isEn = computed(() => locale.value.startsWith("en"));

// Find the event in schedule data (fallback)
const event = computed(() => events.find((e) => e.id === id));

// Locale suffix for file resolution
const localeSuffix = computed(() => {
  return locale.value === "zh-TW" ? "zh-TW" : "en";
});

// Import all event markdown files lazily/dynamically
const eventMdFiles = import.meta.glob("../../content/events/**/*.md", {
  query: "?raw",
  import: "default",
});

// Fetch raw markdown file content dynamically at runtime
const { data: rawMd } = await useAsyncData(
  `event-md-${id}-${locale.value}`,
  async () => {
    const pathWithLocale = `../../content/events/${id}.${localeSuffix.value}.md`;
    if (eventMdFiles[pathWithLocale]) {
      const loader = eventMdFiles[pathWithLocale] as () => Promise<string>;
      return await loader();
    }
    const defaultPath = `../../content/events/${id}.md`;
    if (eventMdFiles[defaultPath]) {
      const loader = eventMdFiles[defaultPath] as () => Promise<string>;
      return await loader();
    }
    return null;
  },
);

// Simple yaml-like frontmatter parser
function parseMarkdownWithFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) {
    const yamlBlock = match[1] || "";
    const markdownContent = match[2] || "";

    const meta: Record<string, string> = {};
    yamlBlock.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        meta[key] = value;
      }
    });

    return { meta, content: markdownContent };
  }
  return { meta: {} as Record<string, string>, content: raw };
}

// Compute parsed content and metadata
const parsed = computed(() => {
  if (!rawMd.value) return { meta: {} as Record<string, string>, html: "" };
  const { meta, content } = parseMarkdownWithFrontmatter(rawMd.value);
  const html = marked.parse(content) as string;
  return { meta, html };
});

const hasEvent = computed(() => !!event.value || !!rawMd.value);

// Resolve properties with fallbacks
const eventTitle = computed(() => {
  if (parsed.value.meta.title) return parsed.value.meta.title;
  return event.value
    ? isEn.value
      ? event.value.title.en
      : event.value.title.zh
    : "";
});

const eventSubtitle = computed(() => {
  return parsed.value.meta.subtitle || "";
});

const eventTimeRange = computed(() => {
  // if (parsed.value.meta.time) return parsed.value.meta.time;
  return event.value ? `${event.value.start} - ${event.value.end}` : "";
});

const eventArea = computed(() => {
  const currentEvent = event.value;
  if (!currentEvent) return "";
  const matchingCol = columns.find((col) => col.key === currentEvent.track);
  if (matchingCol?.label) {
    return isEn.value ? matchingCol.label.en : matchingCol.label.zh;
  }
  return currentEvent.track;
});

const eventDetailText = computed(() => {
  // If there's no compiled markdown HTML, we fallback to event.detail from JSON
  return event.value && event.value.detail
    ? isEn.value
      ? event.value.detail.en
      : event.value.detail.zh
    : "";
});

const eventType = computed(() => {
  return event.value?.type || "";
});

// Map event type to FontAwesome icon
const posterIcon = computed(() => {
  switch (eventType.value) {
    case "entry":
      return "fa-solid fa-door-open";
    case "opening":
      return "fa-solid fa-flag";
    case "community":
      return "fa-solid fa-users";
    case "break":
      return "fa-solid fa-film";
    case "talk":
      return "fa-solid fa-chalkboard-user";
    case "music":
      return "fa-solid fa-compact-disc";
    case "sing":
      return "fa-solid fa-music";
    case "photo":
      return "fa-solid fa-camera";
    case "workshop":
      return "fa-solid fa-palette";
    case "vendor":
      return "fa-solid fa-store";
    case "social":
      return "fa-solid fa-comments";
    case "social-special":
      return "fa-solid fa-dice";
    default:
      return "fa-solid fa-star";
  }
});

// Get the localized type label for the poster subtitle
const posterSubtitle = computed(() => {
  if (parsed.value.meta.subtitle)
    return parsed.value.meta.subtitle.toUpperCase();
  if (eventType.value) {
    const key = `schedule.types.${eventType.value}`;
    const localized = t(key);
    if (localized && localized !== key) {
      return localized.toUpperCase();
    }
    return eventType.value.toUpperCase();
  }
  return "SPECIAL EVENT";
});

useHead(() => ({
  title: hasEvent.value
    ? `${eventTitle.value} - Taiwan BronyCon`
    : t("event.notFound.title"),
  meta: [
    {
      name: "description",
      content: hasEvent.value
        ? parsed.value.meta.intro || eventDetailText.value
        : t("event.notFound.message"),
    },
  ],
}));
</script>

<template>
  <PageLayout>
    <template #title>
      <div class="event-header" v-if="hasEvent">
        <h1>{{ eventTitle }}</h1>
      </div>
      <div class="event-header" v-else>
        <h1>{{ t("event.notFound.title") }}</h1>
      </div>
      <!-- Back to Schedule Link -->
      <div class="actions-section">
        <NuxtLink :to="localePath('/schedule')" class="back-list-btn">
          <i class="fa-solid fa-list" />
          <span>{{ t("event.backToSchedule") }}</span>
        </NuxtLink>
      </div>
    </template>

    <template #surface>
      <div v-if="hasEvent" class="event-detail-container">
        <!-- Hero section with graphic and quick info -->
        <div class="event-hero info-card">
          <div class="event-poster">
            <div class="poster-glow" />
            <div class="poster-inner">
              <i
                class="poster-icon"
                :class="[posterIcon, { spin: eventType === 'music' }]"
              />
              <div class="poster-title">{{ eventTitle.toUpperCase() }}</div>
              <div class="poster-subtitle" v-if="eventSubtitle">
                {{ eventSubtitle }}
              </div>
              <div class="poster-subtitle" v-else>{{ posterSubtitle }}</div>
            </div>
          </div>

          <div class="event-summary">
            <div class="info-tag-list">
              <span class="info-tag" v-if="eventTimeRange">
                <i class="fa-solid fa-clock" />
                <span>{{ eventTimeRange }}</span>
              </span>
              <span class="info-tag" v-if="eventArea">
                <i class="fa-solid fa-location-dot" />
                <span>{{ eventArea }}</span>
              </span>
            </div>
            <!-- If we have parsed HTML, we render it below in a standard markdown area. 
                 Otherwise, fall back to showing the simple intro text. -->
            <p class="intro-text">
              {{ eventDetailText }}
            </p>
          </div>
        </div>

        <!-- Compiled Markdown Content Area -->
        <div
          v-if="parsed.html"
          class="event-markdown-content info-card"
          v-html="parsed.html"
        ></div>
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

.poster-icon {
  font-size: 4.5rem;
  background: linear-gradient(45deg, var(--color-pink), var(--color-gold));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(255, 189, 222, 0.5));
}

.poster-icon.spin {
  animation: spin 8s infinite linear;
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

/* Dynamic Markdown Content Styling */
.event-markdown-content :deep(h1),
.event-markdown-content :deep(h2),
.event-markdown-content :deep(h3) {
  color: var(--color-gold);
  border-bottom: 1px solid rgba(255, 230, 167, 0.15);
  padding-bottom: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.15rem;
  font-weight: 700;
}

.event-markdown-content :deep(h1:first-child),
.event-markdown-content :deep(h2:first-child),
.event-markdown-content :deep(h3:first-child) {
  margin-top: 0;
}

.event-markdown-content :deep(p) {
  font-size: 0.95rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.25rem;
}

.event-markdown-content :deep(ul),
.event-markdown-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.event-markdown-content :deep(li) {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.event-markdown-content :deep(strong) {
  color: #ffffff;
  font-weight: 700;
}

/* Actions Section */
.actions-section {
  display: flex;
  justify-content: flex-end;
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
