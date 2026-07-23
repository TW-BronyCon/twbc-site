<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import type { ComponentPublicInstance } from "vue";

/**
 * News Page Component
 * Displays list of letter envelopes that open on hover and click, leading to the news details page.
 */

// Configuration for persisting the opened/unopened state of letters
const rememberOpenedMail = true;
const openedStorageKey = "twbc-opened-news";

const { t, locale } = useI18n();
const localePath = useLocalePath();

definePageMeta({
  underDevelopment: false,
});

const route = useRoute();
const siteUrl = "https://twbronycon.org";

useSeoMeta({
  title: () => t("newsPage.title"),
  ogTitle: () => t("newsPage.title"),
  twitterTitle: () => t("newsPage.title"),
  description: () => t("newsPage.description"),
  ogDescription: () => t("newsPage.description"),
  twitterDescription: () => t("newsPage.description"),
  ogImage: `${siteUrl}/img/text-logo.avif`,
  twitterImage: `${siteUrl}/img/text-logo.avif`,
  ogUrl: computed(() => `${siteUrl}${route.path}`),
});

type NewsPost = {
  id: string;
  title: string;
  time: string;
  content: string;
};

type SealData = {
  angle: number;
  topClip: string;
  bottomClip: string;
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createRandomCrack() {
  const crack: string[] = [];
  const steps = Math.floor(randomBetween(10, 20));
  const baseY = randomBetween(45, 55);
  const minOffset = randomBetween(-10, -5);
  const maxOffset = randomBetween(5, 10);

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const y = baseY + randomBetween(minOffset, maxOffset);

    crack.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }

  const reversed = crack.slice().reverse();

  return {
    topClip: `polygon(
      0 0,
      100% 0,
      ${reversed.join(", ")}
    )`,

    bottomClip: `polygon(
      0 100%,
      100% 100%,
      ${reversed.join(", ")}
    )`,
  };
}

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

// Import all news markdown files eagerly
const newsMdFiles = import.meta.glob("/content/news/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const posts = computed<NewsPost[]>(() => {
  const list: {
    id: string;
    locale: string;
    title: string;
    time: string;
    content: string;
  }[] = [];

  for (const [path, raw] of Object.entries(newsMdFiles)) {
    const filename = path.split("/").pop() || "";
    const match = filename.match(/^(.+)\.(.+)\.md$/);
    if (!match) continue;

    const id = match[1];
    const fileLocale = match[2];
    if (!id || !fileLocale) continue;

    const { meta, content } = parseMarkdownWithFrontmatter(raw as string);

    list.push({
      id,
      locale: fileLocale,
      title: meta.title || "",
      time: meta.time || "",
      content,
    });
  }

  const uniqueIds = Array.from(new Set(list.map((p) => p.id)));
  const mapped = uniqueIds.flatMap((id) => {
    const postForLocale =
      list.find((p) => p.id === id && p.locale === locale.value) ||
      list.find((p) => p.id === id && p.locale === "zh-TW") ||
      list.find((p) => p.id === id && p.locale === "en");

    if (!postForLocale) return [];

    let formattedTime = postForLocale.time || "";
    if (postForLocale.time) {
      try {
        const date = new Date(postForLocale.time);
        if (!Number.isNaN(date.getTime())) {
          formattedTime = date.toLocaleDateString(locale.value, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "Asia/Taipei",
          });
        }
      } catch (err) {
        console.error("Failed to format date:", err);
      }
    }

    return [
      {
        id,
        title: postForLocale.title,
        time: formattedTime,
        rawTime: postForLocale.time || "",
        content: postForLocale.content,
      },
    ];
  });

  return mapped
    .sort((a, b) => {
      const timeA = a.rawTime ? Date.parse(a.rawTime) : 0;
      const timeB = b.rawTime ? Date.parse(b.rawTime) : 0;
      return timeB - timeA;
    })
    .map(({ rawTime, ...rest }) => rest);
});

const openedMap = ref<Record<string, boolean>>({});
const sealMap = ref<Record<string, SealData>>({});

const defaultSealTopClip = "polygon(0 0, 100% 0, 100% 50%, 0 50%)";
const defaultSealBottomClip = "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)";

const whyX = ref(0);
const whyY = ref(0);
const whyReady = ref(false);

const mailRefs = new Map<string, HTMLElement>();

let currentWhyPostId: string | null = null;
let whyIntroTimer: ReturnType<typeof setTimeout> | null = null;
let whyIdleTimer: ReturnType<typeof setTimeout> | null = null;

function setMailRef(
  postId: string,
  el: Element | ComponentPublicInstance | null,
) {
  if (el instanceof HTMLElement) {
    mailRefs.set(postId, el);
    return;
  }

  mailRefs.delete(postId);
}

function moveWhyOffscreen() {
  currentWhyPostId = null;
  whyX.value = document.documentElement.scrollWidth + 250;
  whyY.value = 300;
}

function getDefaultWhyPostId() {
  const unopened = posts.value.find((post) => !isMailOpened(post.id));
  return unopened?.id || posts.value[0]?.id || "";
}

function moveWhyToMail(postId: string) {
  const el = mailRefs.get(postId);

  if (!el) return;

  currentWhyPostId = postId;

  if (whyIdleTimer) {
    clearTimeout(whyIdleTimer);
    whyIdleTimer = null;
  }

  whyReady.value = true;

  const rect = el.getBoundingClientRect();

  whyX.value = rect.right + window.scrollX + 20;

  whyY.value = rect.top + window.scrollY + rect.height / 2 - 280;
}

function moveWhyToDefaultMail() {
  const postId = getDefaultWhyPostId();

  if (!postId) return;

  moveWhyToMail(postId);
  startWhyIdleTimer();
}

function startWhyIdleTimer() {
  if (whyIdleTimer) clearTimeout(whyIdleTimer);

  whyIdleTimer = setTimeout(() => {
    moveWhyOffscreen();
  }, 60 * 1000); // 1分鐘消失
}

function handleResize() {
  if (!whyReady.value) return;

  if (currentWhyPostId) {
    moveWhyToMail(currentWhyPostId);
    return;
  }

  moveWhyOffscreen();
}

function getPostNumber(postId: string) {
  const match = postId.match(/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function angleDiff(a: number, b: number) {
  return Math.abs(a - b);
}

function createSealAngle(postId: string) {
  const currentNo = getPostNumber(postId);

  for (let i = 0; i < 80; i++) {
    const angle = Math.round(randomBetween(-50, 50));

    if (currentNo === null) return angle;

    const prevId = `post_${String(currentNo - 1).padStart(3, "0")}`;
    const nextId = `post_${String(currentNo + 1).padStart(3, "0")}`;

    const prevAngle = sealMap.value[prevId]?.angle;
    const nextAngle = sealMap.value[nextId]?.angle;

    if (
      (prevAngle === undefined || angleDiff(angle, prevAngle) >= 15) &&
      (nextAngle === undefined || angleDiff(angle, nextAngle) >= 15)
    ) {
      return angle;
    }
  }

  return Math.round(randomBetween(-50, 50));
}

function getSealData(postId: string): SealData {
  const existing = sealMap.value[postId];

  if (existing) return existing;

  const crack = createRandomCrack();

  const data: SealData = {
    angle: createSealAngle(postId),
    topClip: crack.topClip,
    bottomClip: crack.bottomClip,
  };

  sealMap.value[postId] = data;

  return data;
}

watch(
  posts,
  (list) => {
    for (const post of list) {
      getSealData(post.id);
    }
  },
  { immediate: true },
);

function isMailOpened(postId: string) {
  return openedMap.value[postId] === true;
}

function trimText(text = "", max = 90) {
  const clean = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function saveOpenedMap() {
  if (!rememberOpenedMail) return;

  localStorage.setItem(openedStorageKey, JSON.stringify(openedMap.value));
}

function loadOpenedMap() {
  if (!rememberOpenedMail) {
    localStorage.removeItem(openedStorageKey);
    openedMap.value = {};
    return;
  }

  const saved = localStorage.getItem(openedStorageKey);

  if (!saved) {
    openedMap.value = {};
    return;
  }

  try {
    const parsed = JSON.parse(saved);

    openedMap.value =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};
  } catch {
    openedMap.value = {};
  }
}

function openMail(post: NewsPost) {
  openedMap.value[post.id] = true;
  saveOpenedMap();
  navigateTo(localePath("/news/" + post.id));
}

onMounted(() => {
  loadOpenedMap();

  window.addEventListener("resize", handleResize);

  nextTick(() => {
    moveWhyOffscreen();

    whyIntroTimer = setTimeout(() => {
      moveWhyToDefaultMail();
    }, 1000); //1秒載入
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);

  document.body.style.overflow = "";

  if (whyIntroTimer) clearTimeout(whyIntroTimer);
  if (whyIdleTimer) clearTimeout(whyIdleTimer);
});
</script>

<template>
  <PageLayout>
    <img
      src="/img/Why.avif"
      alt=""
      aria-hidden="true"
      class="why"
      :class="{ 'why-ready': whyReady }"
      :style="{
        '--why-x': `${whyX}px`,
        '--why-y': `${whyY}px`,
      }"
    />

    <template #title>
      <h1>{{ t("newsPage.heading") }}</h1>
      <p>{{ t("newsPage.description") }}</p>
    </template>

    <section class="news-wrap">
      <div class="mail-list">
        <div
          v-for="post in posts"
          :key="post.id"
          :ref="(el) => setMailRef(post.id, el)"
          class="mail-trigger"
          tabindex="0"
          role="button"
          :aria-label="
            t('newsPage.readPost', { title: post.title }) || post.title
          "
          @mouseenter="moveWhyToMail(post.id)"
          @mouseleave="startWhyIdleTimer"
          @click="openMail(post)"
          @keydown.enter.space.prevent="openMail(post)"
        >
          <article class="mail" :class="{ opened: openedMap[post.id] }">
            <div class="stamp"></div>

            <div
              class="wax-seal"
              :style="{
                '--seal-angle': `${sealMap[post.id]?.angle ?? 0}deg`,
                '--crack-top': sealMap[post.id]?.topClip ?? defaultSealTopClip,
                '--crack-bottom':
                  sealMap[post.id]?.bottomClip ?? defaultSealBottomClip,
              }"
            >
              <img
                v-if="!isMailOpened(post.id)"
                src="/img/WaxSeal.avif"
                class="wax-closed"
                alt=""
              />

              <template v-else>
                <div class="wax-top">
                  <div class="wax-piece-img"></div>
                </div>

                <div class="wax-bottom">
                  <div class="wax-piece-img"></div>
                </div>
              </template>
            </div>

            <h3>{{ post.title }}</h3>

            <div class="preview">
              {{ trimText(post.content, 90) }}
            </div>

            <div class="mail-meta">
              <div class="time">{{ post.time }}</div>
              <div class="author">{{ t("news.author") }}</div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<style scoped>
/* Scoped styles for News Page */
:deep(.page-layout) {
  overflow-x: clip;
}

@supports not (overflow: clip) {
  :deep(.page-layout) {
    overflow-x: hidden;
  }
}

/* 暗遮罩 */
.bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
}

/* 主容器 */
.news-wrap {
  width: min(900px, 92%);
  margin: 0 auto -1rem;
  padding: 0;
}

/* 信件列表 */
.mail-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: stretch;
  width: min(900px, 100%);
  max-width: 600px;
  margin: 0 auto 5rem;
}

/* Trigger wrapper – stays in place so the cursor never leaves */
.mail-trigger {
  cursor: pointer;
}

/* 信封 */
.mail {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  grid-template-rows: 5em auto auto;
  grid-template-areas:
    "blank blank"
    "title preview"
    "meta meta";
  gap: 0.75rem;

  min-height: clamp(230px, 22vw, 300px);
  background: var(--color-paper-bg-gradient);
  border-radius: 1rem;
  padding: 1.2rem 1.35rem 1rem;
  color: var(--color-paper-text);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.35);
  transition: 0.25s ease;
  overflow: hidden;
}

.mail-trigger:hover .mail,
.mail-trigger:focus-visible .mail {
  transform: translateY(-8px) rotate(-0.5deg);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.45),
    0 0 20px rgba(255, 120, 220, 0.4),
    0 0 55px rgba(255, 120, 220, 0.25),
    0 0 110px rgba(255, 120, 220, 0.15);

  animation: magicPulse 1.2s ease-in-out infinite;
}

.mail-trigger:focus-visible .mail {
  outline: 3px solid rgba(255, 130, 225, 0.85);
  outline-offset: 4px;
}

.mail-trigger:hover .mail::after,
.mail-trigger:focus-visible .mail::after {
  content: "";
  position: absolute;
  inset: -12px;
  border-radius: 1.4rem;
  pointer-events: none;
  z-index: 6;
  border: 2px solid rgba(255, 130, 225, 0.65);
  box-shadow:
    0 0 15px rgba(255, 231, 249, 0.9),
    0 0 30px rgba(201, 125, 183, 0.55),
    0 0 60px rgba(201, 125, 183, 0.3),
    0 0 90px rgba(201, 125, 183, 0.12);
  animation: magicOutline 1.2s ease-in-out infinite;
}

/* 上方倒三角封口區 */
.mail::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(
    135deg,
    rgba(250, 250, 250, 0.25) 0%,
    rgba(250, 250, 250, 0.25) 45%,
    rgba(250, 250, 250, 0.5) 50%,
    rgba(250, 250, 250, 0.25) 55%,
    rgba(250, 250, 250, 0.25) 100%
  );
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  pointer-events: none;
  z-index: 0;
}

.mail.opened::before {
  height: 35px;
  background: rgba(185, 153, 130, 0.25);
}

/* 郵票 */
.stamp {
  position: absolute;
  top: 0.85rem;
  right: 1rem;
  width: 52px;
  height: 52px;
  border: 2px dashed rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  background: var(--color-purple-light);
  opacity: 0.95;
  z-index: 2;
}

.mail h3 {
  grid-area: title;
  margin: 0;
  align-self: start;
  font-size: 1.25rem;
  line-height: 1.45;
  padding-top: 0.5rem;
  position: relative;
  z-index: 1;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview {
  grid-area: preview;
  margin: 0;
  align-self: center;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-paper-text-muted);
  position: relative;
  z-index: 1;
  text-align: justify;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
}

.mail-meta {
  grid-area: meta;
  margin-top: 0.15rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  font-size: 0.82rem;
  opacity: 0.72;
  position: relative;
  z-index: 1;
}

.mail-meta .time {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  color: var(--color-paper-text-dark);
}

.mail-meta .author {
  text-align: right;
  font-weight: 600;
  margin-left: auto;
  font-size: 0.9rem;
}

/* 圓形封蠟 */
.wax-seal {
  position: absolute;
  top: 2.05rem;
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translateX(-50%) translateY(-25px);
  transform-origin: center;
  z-index: 5;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))
    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.055))
    drop-shadow(0 5px 10px rgba(0, 0, 0, 0.01));
}

.wax-closed {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  transform: rotate(var(--seal-angle, 0deg));
  transform-origin: center;
}

.wax-top,
.wax-bottom {
  position: absolute;
  inset: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  transition:
    transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1),
    opacity 0.35s ease;
}

.wax-piece-img {
  position: absolute;
  inset: 0;
  background-image: url("/img/WaxSeal.avif");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  transform: rotate(var(--seal-angle, 0deg));
  transform-origin: center;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))
    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.105))
    drop-shadow(0 5px 10px rgba(0, 0, 0, 0.01));
}

.wax-top {
  clip-path: var(--crack-top);
}

.wax-bottom {
  clip-path: var(--crack-bottom);
}

.mail.opened .wax-top {
  transform: translateY(-20px) rotate(-5deg);
}

.mail.opened .wax-bottom {
  transform: translateY(0px) rotate(10deg);
}

.why {
  z-index: 5;
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  width: 300px;
  margin: 0;
  padding: 0;
  pointer-events: none;
  transform: translate3d(var(--why-x, 120vw), var(--why-y, 40vh), 0);
  transition:
    transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1),
    opacity 0.5s ease;
  animation: why-float 5s ease-in-out infinite;
}

.why.why-ready {
  opacity: 1;
}

@keyframes why-float {
  0% {
    margin-top: 0;
  }

  50% {
    margin-top: 10px;
  }

  100% {
    margin-top: 0;
  }
}

@media (max-width: 1000px) {
  .why {
    display: none;
  }
}

/* Vivid Hover Magic Animations for Envelopes */
@keyframes magicPulse {
  0%,
  100% {
    transform: translateY(-8px) rotate(-0.5deg) scale(1.02);
    box-shadow:
      0 0 12px rgba(255, 255, 255, 0.55),
      0 0 25px rgba(255, 120, 220, 0.5),
      0 0 55px rgba(255, 120, 220, 0.3),
      0 0 110px rgba(255, 120, 220, 0.2);
  }

  50% {
    transform: translateY(-8px) rotate(-0.5deg) scale(1);
    box-shadow:
      0 0 8px rgba(255, 255, 255, 0.35),
      0 0 15px rgba(255, 120, 220, 0.3),
      0 0 45px rgba(255, 120, 220, 0.2),
      0 0 90px rgba(255, 120, 220, 0.1);
  }
}

@keyframes magicOutline {
  0%,
  100% {
    border-color: rgba(255, 130, 225, 0.85);
    box-shadow:
      0 0 18px rgba(255, 231, 249, 1),
      0 0 35px rgba(201, 125, 183, 0.65),
      0 0 70px rgba(201, 125, 183, 0.4),
      0 0 100px rgba(201, 125, 183, 0.2);
  }

  50% {
    border-color: rgba(255, 130, 225, 0.45);
    box-shadow:
      0 0 12px rgba(255, 231, 249, 0.7),
      0 0 25px rgba(201, 125, 183, 0.45),
      0 0 50px rgba(201, 125, 183, 0.2),
      0 0 80px rgba(201, 125, 183, 0.08);
  }
}

/* 手機 */
@media (max-width: 700px) {
  .news-wrap {
    padding-top: 0;
  }

  .mail-list {
    grid-template-columns: 1fr;
  }

  .mail {
    grid-template-columns: 1fr;
    grid-template-rows: 78px auto auto auto;
    grid-template-areas:
      "blank"
      "title"
      "preview"
      "meta";
    gap: 0.7rem;
    min-height: auto;
    padding: 1.1rem 1.1rem 0.95rem;
  }

  .mail::before {
    height: 82px;
  }

  .mail h3,
  .preview {
    align-self: start;
  }

  .mail h3 {
    font-size: 1.12rem;
    padding-top: 0;
    line-clamp: 3;
    -webkit-line-clamp: 3;
  }

  .preview {
    font-size: 0.93rem;
    line-height: 1.65;
    line-clamp: 3;
    -webkit-line-clamp: 3;
  }

  .mail-meta {
    font-size: 0.78rem;
  }
}
</style>
