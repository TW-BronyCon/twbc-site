<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

/**
 * News Page Component
 * Displays list of letter envelopes that open on hover and click, showing the detailed news post content in an interactive modal.
 */

// Configuration for persisting the opened/unopened state of letters
const rememberOpenedMail = true 
const openedStorageKey = 'twbc-opened-news'
const openedCookie = useCookie<Record<string, boolean> | null>(
  openedStorageKey,
  {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax'
  }
)

const { t, locale } = useI18n()

useHead({
  title: () => t('newsPage.title')
})

type RawNewsPost = {
  id: string
  title: string
  author: string
  time: string
  content: string
  url: string
}

type NewsPost = {
  id: string
  title: string
  author: string
  time: string
  content: string
  url: string
}

type ContentPart =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string }

type SealData = {
  angle: number
  topClip: string
  bottomClip: string
}

const { data: rawPosts, refresh: refreshPosts } = useAsyncData(
  () => `news-posts-${locale.value}`,
  async () => {
    try {
      return await $fetch<RawNewsPost[]>(
        `/content/news/posts.${locale.value}.json`,
        {
          query: {
            t: Date.now()
          }
        }
      )
    } catch (err) {
      console.error('Failed to load news posts:', err)
      return []
    }
  },
  {
    server: false,
    immediate: false,
    default: () => [],
    watch: [locale]
  }
)

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function createRandomCrack() {
  const crack: string[] = []
  const steps = Math.floor(randomBetween(10, 20))
  const baseY = randomBetween(45, 55)
  const minOffset = randomBetween(-10, -5)
  const maxOffset = randomBetween(5, 10)

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100
    const y = baseY + randomBetween(minOffset, maxOffset)

    crack.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`)
  }

  const reversed = crack.slice().reverse()

  return {
    topClip: `polygon(
      0 0,
      100% 0,
      ${reversed.join(', ')}
    )`,

    bottomClip: `polygon(
      0 100%,
      100% 100%,
      ${reversed.join(', ')}
    )`
  }
}

const posts = computed<NewsPost[]>(() => {
  const list = rawPosts.value

  if (!Array.isArray(list)) return []

  return list
    .map((post, index) => {
      const id = post.id || `post_${String(index + 1).padStart(3, '0')}`

      return {
        id,
        title: post.title || '',
        author: post.author || '',
        time: post.time || '',
        content: post.content || '',
        url: post.url || '#'
      }
    })
    .sort((a, b) => {
      const toTime = (raw: string) => {
        const parts = raw.split(/[\/-]/).map(part => part.trim())

        if (parts.length !== 3) return 0

        const p1 = parts[0]!
        const p2 = parts[1]!
        const p3 = parts[2]!

        const iso = /^\d{4}$/.test(p1)
          ? `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`
          : /^\d{4}$/.test(p3)
            ? `${p3}-${p1.padStart(2, '0')}-${p2.padStart(2, '0')}`
            : raw

        const time = Date.parse(iso)

        return Number.isNaN(time) ? 0 : time
      }

      return toTime(b.time) - toTime(a.time)
    })
})

const selectedPost = ref<NewsPost | null>(null)
const openedMap = ref<Record<string, boolean>>({})
const sealMap = ref<Record<string, SealData>>({})

const defaultSealTopClip = 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
const defaultSealBottomClip = 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)'

const whyX = ref(0)
const whyY = ref(0)
const whyReady = ref(false)

const mailRefs = new Map<string, HTMLElement>()

let currentWhyPostId: string | null = null
let whyIntroTimer: ReturnType<typeof setTimeout> | null = null
let whyIdleTimer: ReturnType<typeof setTimeout> | null = null

function setMailRef(
  postId: string,
  el: Element | ComponentPublicInstance | null
) {
  if (el instanceof HTMLElement) {
    mailRefs.set(postId, el)
    return
  }

  mailRefs.delete(postId)
}

function moveWhyOffscreen() {
  currentWhyPostId = null
  whyX.value = document.documentElement.scrollWidth + 250
  whyY.value = 300
}

function getDefaultWhyPostId() {
  const unopened = posts.value.find(post => !isMailOpened(post.id))
  return unopened?.id || posts.value[0]?.id || ''
}

function moveWhyToMail(postId: string) {
  const el = mailRefs.get(postId)

  if (!el) return

  currentWhyPostId = postId

  if (whyIdleTimer) {
    clearTimeout(whyIdleTimer)
    whyIdleTimer = null
  }

  whyReady.value = true

  const rect = el.getBoundingClientRect()

  whyX.value =
    rect.right +
    window.scrollX +
    20

  whyY.value =
    rect.top +
    window.scrollY +
    rect.height / 2 -
    280
}

function moveWhyToDefaultMail() {
  const postId = getDefaultWhyPostId()

  if (!postId) return

  moveWhyToMail(postId)
  startWhyIdleTimer()
}

function startWhyIdleTimer() {
  if (whyIdleTimer) clearTimeout(whyIdleTimer)

  whyIdleTimer = setTimeout(() => {
    moveWhyOffscreen()
  }, 60 * 1000) // 1分鐘消失
}

function handleResize() {
  if (!whyReady.value) return

  if (currentWhyPostId) {
    moveWhyToMail(currentWhyPostId)
    return
  }

  moveWhyOffscreen()
}

function getPostNumber(postId: string) {
  const match = postId.match(/(\d+)$/)
  return match ? Number(match[1]) : null
}

function angleDiff(a: number, b: number) {
  return Math.abs(a - b)
}

function createSealAngle(postId: string) {
  const currentNo = getPostNumber(postId)

  for (let i = 0; i < 80; i++) {
    const angle = Math.round(randomBetween(-50, 50))

    if (currentNo === null) return angle

    const prevId = `post_${String(currentNo - 1).padStart(3, '0')}`
    const nextId = `post_${String(currentNo + 1).padStart(3, '0')}`

    const prevAngle = sealMap.value[prevId]?.angle
    const nextAngle = sealMap.value[nextId]?.angle

    if (
      (prevAngle === undefined || angleDiff(angle, prevAngle) >= 15) &&
      (nextAngle === undefined || angleDiff(angle, nextAngle) >= 15)
    ) {
      return angle
    }
  }

  return Math.round(randomBetween(-50, 50))
}

function getSealData(postId: string): SealData {
  const existing = sealMap.value[postId]

  if (existing) return existing

  const crack = createRandomCrack()

  const data: SealData = {
    angle: createSealAngle(postId),
    topClip: crack.topClip,
    bottomClip: crack.bottomClip
  }

  sealMap.value[postId] = data

  return data
}

watch(
  posts,
  (list) => {
    for (const post of list) {
      getSealData(post.id)
    }
  },
  { immediate: true }
)

function isMailOpened(postId: string) {
  return openedMap.value[postId] === true
}

const contentParts = computed<ContentPart[]>(() => {
  const text = selectedPost.value?.content ?? ''
  const urlRegex = /(https?:\/\/[^\s]+)/g

  const parts: ContentPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: text.slice(lastIndex, match.index)
      })
    }

    parts.push({
      type: 'link',
      value: match[0]
    })

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      value: text.slice(lastIndex)
    })
  }

  return parts
})

function trimText(text = '', max = 90) {
  const clean = text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return clean.length > max
    ? `${clean.slice(0, max)}...`
    : clean
}

function saveOpenedMap() {
  if (!rememberOpenedMail) {
    openedCookie.value = null
    return
  }

  const value = JSON.stringify(openedMap.value)
  openedCookie.value = openedMap.value

  try {
    localStorage.setItem(openedStorageKey, value)
  } catch {
    // Cookie fallback still preserves opened mail state.
  }
}

function parseOpenedMap(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, isOpened]) => isOpened === true)
  ) as Record<string, boolean>
}

function loadOpenedMap() {
  if (!rememberOpenedMail) {
    try {
      localStorage.removeItem(openedStorageKey)
    } catch {
      // Ignore storage cleanup failures.
    }

    openedCookie.value = null
    openedMap.value = {}
    return
  }

  let saved: string | null = null

  try {
    saved = localStorage.getItem(openedStorageKey)
  } catch {
    saved = null
  }

  try {
    openedMap.value = saved
      ? parseOpenedMap(JSON.parse(saved))
      : parseOpenedMap(openedCookie.value)
  } catch {
    openedMap.value = parseOpenedMap(openedCookie.value)
  }

  saveOpenedMap()
}

function openMail(post: NewsPost) {
  openedMap.value[post.id] = true
  saveOpenedMap()

  selectedPost.value = post
  document.body.style.overflow = 'hidden'
}

function closeMail() {
  selectedPost.value = null
  document.body.style.overflow = ''
}

async function copyLink(url?: string) {
  try {
    await navigator.clipboard.writeText(url || '#')
    alert(t('news.messages.copied'))
  } catch {
    alert(t('news.messages.copyFailed'))
  }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeMail()
  }
}

onMounted(async () => {
  loadOpenedMap()
  await refreshPosts()

  window.addEventListener('keydown', handleEsc)
  window.addEventListener('resize', handleResize)

  await nextTick()

  moveWhyOffscreen()

  whyIntroTimer = setTimeout(() => {
    moveWhyToDefaultMail()
  }, 1000) //1秒載入
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  window.removeEventListener('resize', handleResize)

  document.body.style.overflow = ''

  if (whyIntroTimer) clearTimeout(whyIntroTimer)
  if (whyIdleTimer) clearTimeout(whyIdleTimer)
})
</script>

<template>
  <div class="legacy-page-root">
    <img
    src="/img/Why.avif"
    alt=""
    aria-hidden="true"
    class="why"
    :class="{ 'why-ready': whyReady }"
    :style="{
      '--why-x': `${whyX}px`,
      '--why-y': `${whyY}px`
    }"
    >

    <div class="legacy-page-body">
      <section class="news-wrap">
        <div class="news-head">
          <h1>{{ t('newsPage.heading') }}</h1>
          <p>{{ t('newsPage.description') }}</p>
        </div>
        
        <div class="mail-list">
          <article
            v-for="post in posts"
            :key="post.id"
            :ref="el => setMailRef(post.id, el)"
            class="mail"
            :class="{ opened: openedMap[post.id] }"
            @mouseenter="moveWhyToMail(post.id)"
            @mouseleave="startWhyIdleTimer"
            @click="openMail(post)"
          >
            <div class="stamp"></div>

            <div
              class="wax-seal"
              :style="{
                '--seal-angle': `${sealMap[post.id]?.angle ?? 0}deg`,
                '--crack-top': sealMap[post.id]?.topClip ?? defaultSealTopClip,
                '--crack-bottom': sealMap[post.id]?.bottomClip ?? defaultSealBottomClip
              }"
            >
              <img
                v-if="!isMailOpened(post.id)"
                src="/img/WaxSeal.avif"
                class="wax-closed"
                alt=""
              >

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
              <div class="author">{{ post.author }}</div>
            </div>
          </article>
        </div>
      </section>

      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="selectedPost"
            class="modal show"
            @click.self="closeMail"
          >
            <div class="paper">
              <button
                class="close-btn"
                type="button"
                @click="closeMail"
              >
                ✕
              </button>

              <div id="paperBody">
                <h2>{{ selectedPost.title }}</h2>

                <div class="paper-meta">
                  {{ t('news.labels.time') }}：{{ selectedPost.time }}

                  <span style="float: right;">
                    {{ t('news.labels.author') }}：{{ selectedPost.author }}
                  </span>
                </div>

                <div class="paper-content">
                  <template
                    v-for="(part, index) in contentParts"
                    :key="index"
                  >
                    <a
                      v-if="part.type === 'link'"
                      :href="part.value"
                      target="_blank"
                      rel="noopener noreferrer"
                      @click.stop
                    >
                      {{ part.value }}
                    </a>

                    <span v-else>
                      {{ part.value }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style src="~/assets/css/font.css"></style>
<style scoped src="~/assets/css/news.css"></style>

<style scoped>
.legacy-page-root {
  position: relative;
  padding-top: clamp(4.5rem, 7vw, 6.5rem);
  overflow-x: clip;
}

@supports not (overflow: clip) {
    .legacy-page-root {
        overflow-x: hidden;
    }
}

.legacy-page-body {
  position: relative;
  z-index: 1;
}

.paper-content {
  white-space: pre-line;
}

.paper-content a {
  color: #803bff;
  font-weight: 700;
  text-decoration: underline;
  word-break: break-all;
}

.paper-content a:hover {
  opacity: .75;
}
</style>
