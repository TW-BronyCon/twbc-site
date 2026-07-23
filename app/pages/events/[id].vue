<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { events, columns } from "~/data/scheduleData";

const { t, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const id = route.params.id as string;
const isEn = computed(() => locale.value.startsWith("en"));

// Lightbox state
const isLightboxOpen = ref(false);
const currentImage = ref("");

function handleContentClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target && target.tagName === "IMG") {
    currentImage.value = (target as HTMLImageElement).src;
    isLightboxOpen.value = true;
  }
}

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
  if (!rawMd.value) {
    return {
      meta: {} as Record<string, string>,
      html: "",
      images: [] as { src: string; alt: string }[],
    };
  }
  const { meta, content } = parseMarkdownWithFrontmatter(rawMd.value);
  let html = marked.parse(content) as string;

  // Resolve references to the public folder (e.g. src="/public/img/..." or src="../../../public/img/...")
  html = html.replace(
    /(src|href)=["']\/?(?:\.\.\/)*public\/([^"']+)["']/g,
    '$1="/$2"',
  );

  // Map /events/[id]/image.png to /img/events/[id]/image.png for event-relative images
  const imageExtensionPattern =
    /\.(png|jpe?g|gif|svg|webp|avif)(?:\?[^"']*)?$/i;
  html = html.replace(/src=["']\/events\/([^"']+)["']/g, (match, p1) => {
    if (imageExtensionPattern.test(p1)) {
      return `src="/img/events/${p1}"`;
    }
    return match;
  });

  // Extract all images from the HTML
  const images: { src: string; alt: string }[] = [];
  const imgTagRegex = /<img([^>]+)>/gi;
  let imgMatch;
  while ((imgMatch = imgTagRegex.exec(html)) !== null) {
    const attributes = imgMatch[1];
    if (attributes) {
      const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
      const altMatch = attributes.match(/alt=["']([^"']*)["']/i);

      if (srcMatch && srcMatch[1]) {
        images.push({
          src: srcMatch[1],
          alt: altMatch && altMatch[1] ? altMatch[1] : "",
        });
      }
    }
  }

  // Remove paragraphs containing only images and whitespace
  html = html.replace(
    /<p>(?:\s|<br\s*\/?>)*<img[^>]+src=["']([^"']+)["'][^>]*>(?:\s|<br\s*\/?>)*<\/p>/gi,
    "",
  );
  // Remove standalone <img> tags
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, "");

  return { meta, html, images };
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

const siteUrl = "https://twbronycon.org";

const pageTitle = computed(() =>
  hasEvent.value
    ? `${eventTitle.value} - Taiwan BronyCon`
    : t("event.notFound.title"),
);

const pageDesc = computed(() =>
  hasEvent.value
    ? parsed.value.meta.intro || eventDetailText.value
    : t("event.notFound.message"),
);

const pageImage = computed(() => {
  const firstImg = parsed.value.images[0];
  const img = firstImg ? firstImg.src : null;
  if (!img) return `${siteUrl}/img/text-logo.avif`;
  if (
    img.startsWith("http://") ||
    img.startsWith("https://") ||
    img.startsWith("data:")
  ) {
    return img;
  }
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  return `${siteUrl}${cleanPath}`;
});

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  twitterTitle: pageTitle,
  description: pageDesc,
  ogDescription: pageDesc,
  twitterDescription: pageDesc,
  ogImage: pageImage,
  twitterImage: pageImage,
  ogUrl: computed(() => `${siteUrl}${route.path}`),
  ogImageWidth: null,
  ogImageHeight: null,
});
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
          @click="handleContentClick"
        ></div>

        <!-- Attachments Section -->
        <div
          v-if="parsed.images && parsed.images.length > 0"
          class="attachments-card info-card"
        >
          <h2 class="attachments-title">
            <i class="fa-solid fa-paperclip" />
            <span>{{ t("event.attachments") }}</span>
          </h2>
          <div class="attachments-grid">
            <div
              v-for="(img, idx) in parsed.images"
              :key="idx"
              class="attachment-thumbnail"
              @click="
                currentImage = img.src;
                isLightboxOpen = true;
              "
              @keydown.enter="
                currentImage = img.src;
                isLightboxOpen = true;
              "
              @keydown.space.prevent="
                currentImage = img.src;
                isLightboxOpen = true;
              "
              tabindex="0"
              role="button"
              :aria-label="img.alt || eventTitle"
            >
              <div class="thumbnail-wrapper">
                <img :src="img.src" :alt="img.alt || eventTitle" />
                <div class="thumbnail-overlay">
                  <i class="fa-solid fa-magnifying-glass-plus" />
                </div>
              </div>
              <div class="attachment-info" v-if="img.alt">
                <span class="attachment-name">{{ img.alt }}</span>
              </div>
            </div>
          </div>
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

      <!-- Lightbox Modal -->
      <Teleport to="body">
        <Transition name="lightbox-fade">
          <div
            v-if="isLightboxOpen && currentImage"
            class="lightbox-overlay"
            @click="isLightboxOpen = false"
          >
            <button
              class="lightbox-close"
              type="button"
              @click="isLightboxOpen = false"
              :aria-label="t('common.close')"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="lightbox-content" @click.stop>
              <img :src="currentImage" :alt="eventTitle" class="lightbox-img" />
            </div>
          </div>
        </Transition>
      </Teleport>
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

.event-markdown-content :deep(img) {
  display: block;
  max-width: min(100%, 650px);
  max-height: 480px;
  width: auto;
  height: auto;
  object-fit: contain;
  margin: 1.5rem auto;
  border-radius: 12px;
  border: 1px solid rgba(255, 230, 167, 0.15);
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  cursor: zoom-in;
  transition:
    transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    border-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.event-markdown-content :deep(img:hover) {
  transform: scale(1.01);
  border-color: rgba(255, 230, 167, 0.5);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.45),
    0 0 15px rgba(255, 230, 167, 0.1);
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

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 5, 20, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 230, 167, 0.15);
  color: #ffffff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 1010;
}

.lightbox-close:hover {
  background: var(--color-gold);
  color: #120b18;
  border-color: var(--color-gold);
  transform: scale(1.1);
}

.lightbox-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 230, 167, 0.15);
  cursor: default;
  transition: transform 0.3s ease;
}

/* Lightbox Fade Transition */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-fade-enter-active .lightbox-img {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lightbox-fade-enter-from .lightbox-img {
  transform: scale(0.9);
}

/* Attachments Section */
.attachments-card {
  margin-top: 1rem;
}

.attachments-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-gold);
  border-bottom: 1px solid rgba(255, 230, 167, 0.15);
  padding-bottom: 0.75rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.attachments-title i {
  font-size: 1.1rem;
  color: var(--color-pink);
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.attachment-thumbnail {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 230, 167, 0.12);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.attachment-thumbnail:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 230, 167, 0.4);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 0 12px rgba(255, 189, 222, 0.08);
}

.attachment-thumbnail:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

.thumbnail-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: rgba(10, 5, 20, 0.4);
}

.thumbnail-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.attachment-thumbnail:hover .thumbnail-wrapper img {
  transform: scale(1.05);
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(18, 11, 24, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.thumbnail-overlay i {
  color: var(--color-gold);
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 230, 167, 0.6));
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.attachment-thumbnail:hover .thumbnail-overlay {
  opacity: 1;
}

.attachment-thumbnail:hover .thumbnail-overlay i {
  transform: scale(1);
}

.attachment-info {
  padding: 0.75rem;
  border-top: 1px solid rgba(255, 230, 167, 0.08);
  background: rgba(20, 10, 25, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.attachment-name {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
