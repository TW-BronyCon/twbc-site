<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";

const { t, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const id = route.params.id as string;

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
  if (!rawMd.value) return { meta: {} as Record<string, string>, html: "" };
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

  return { meta, html };
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
