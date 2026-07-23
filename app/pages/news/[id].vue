<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";

const { t, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const id = route.params.id as string;

// Lightbox state
const isLightboxOpen = ref(false);
const currentImage = ref("");

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    isLightboxOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

// Locale suffix for file resolution
const localeSuffix = computed(() => {
  return locale.value === "zh-TW" ? "zh-TW" : "en";
});

// Import all news markdown files lazily/dynamically
const newsMdFiles = import.meta.glob("/content/news/**/*.md", {
  query: "?raw",
  import: "default",
});

// Fetch raw markdown file content dynamically at runtime
const { data: rawMd } = await useAsyncData(
  `news-md-${id}-${locale.value}`,
  async () => {
    const pathWithLocale = `/content/news/${id}.${localeSuffix.value}.md`;
    if (newsMdFiles[pathWithLocale]) {
      const loader = newsMdFiles[pathWithLocale] as () => Promise<string>;
      return await loader();
    }
    const defaultPath = `/content/news/${id}.md`;
    if (newsMdFiles[defaultPath]) {
      const loader = newsMdFiles[defaultPath] as () => Promise<string>;
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
        let cleanVal = value;
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          cleanVal = value.slice(1, -1);
        }
        meta[key] = cleanVal;
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

const hasNews = computed(() => !!rawMd.value);

const newsTitle = computed(() => {
  return parsed.value.meta.title || "";
});

const newsTime = computed(() => {
  if (!parsed.value.meta.time) return "";
  try {
    const date = new Date(parsed.value.meta.time);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(locale.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Taipei",
      });
    }
  } catch (err) {
    console.error("Failed to format date:", err);
  }
  return parsed.value.meta.time;
});

useHead(() => ({
  title: hasNews.value
    ? `${newsTitle.value} - Taiwan BronyCon`
    : t("news.notFound.title"),
  meta: [
    {
      name: "description",
      content: hasNews.value
        ? parsed.value.meta.intro || newsTitle.value
        : t("news.notFound.message"),
    },
  ],
}));
</script>

<template>
  <PageLayout>
    <template #title>
      <div class="news-header" v-if="hasNews">
        <h1>{{ newsTitle }}</h1>
      </div>
      <div class="news-header" v-else>
        <h1>{{ t("news.notFound.title") }}</h1>
      </div>
    </template>

    <template #surface>
      <div v-if="hasNews" class="news-detail-container">
        <!-- Letter Page -->
        <article class="news-paper">
          <div class="news-paper-meta">
            {{ t("news.labels.time") }}：{{ newsTime }}
            <span class="news-paper-author">
              {{ t("news.labels.author") }}：{{ t("news.author") }}
            </span>
          </div>

          <div class="news-paper-content" v-html="parsed.html"></div>
        </article>

        <!-- Attachments Grid (Images parsed from News Markdown) -->
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
              :aria-label="img.alt || newsTitle"
            >
              <div class="thumbnail-wrapper">
                <img :src="img.src" :alt="img.alt || newsTitle" />
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

        <!-- Back Actions -->
        <div class="actions-section">
          <NuxtLink :to="localePath('/news')" class="back-list-btn">
            <i class="fa-solid fa-envelope" />
            <span>{{ t("news.backToList") }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="not-found-state">
        <p class="not-found-message">{{ t("news.notFound.message") }}</p>
        <NuxtLink :to="localePath('/news')" class="back-list-btn">
          <i class="fa-solid fa-envelope" />
          <span>{{ t("news.backToList") }}</span>
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
              <img :src="currentImage" :alt="newsTitle" class="lightbox-img" />
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </PageLayout>
</template>

<style scoped>
.news-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.news-detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  width: 100%;
}

/* Paper letter layout */
.news-paper {
  width: min(760px, 100%);
  background: var(--color-paper-bg-gradient);
  color: var(--color-paper-text-dark);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.news-paper-meta {
  font-size: 0.95rem;
  color: var(--color-paper-text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.7;
  border-bottom: 1px dashed rgba(185, 153, 130, 0.4);
  padding-bottom: 0.75rem;
}

.news-paper-author {
  float: right;
  font-weight: 600;
}

.news-paper-content {
  line-height: 1.65;
  text-align: justify;
}

.news-paper-content :deep(p) {
  margin-bottom: 1.2rem;
  font-size: 1.05rem;
}

.news-paper-content :deep(h1),
.news-paper-content :deep(h2),
.news-paper-content :deep(h3) {
  color: var(--color-purple-accent);
  margin-top: 1.8rem;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  font-weight: 700;
}

.news-paper-content :deep(ul),
.news-paper-content :deep(ol) {
  margin-bottom: 1.2rem;
  padding-left: 1.5rem;
}

.news-paper-content :deep(li) {
  margin-bottom: 0.6rem;
  font-size: 1.05rem;
}

.news-paper-content :deep(a) {
  color: var(--color-purple-accent);
  font-weight: 700;
  text-decoration: underline;
  word-break: break-all;
}

.news-paper-content :deep(a:hover) {
  opacity: 0.75;
}

/* Info card container */
.info-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(20, 10, 25, 0.55);
  border: 1px solid rgba(255, 230, 167, 0.08);
  width: min(760px, 100%);
  box-sizing: border-box;
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
  cursor: pointer;
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

/* Actions Section */
.actions-section {
  display: flex;
  justify-content: center;
  width: 100%;
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

@media (max-width: 700px) {
  .news-paper {
    padding: 1.5rem 1.2rem;
  }
}
</style>
