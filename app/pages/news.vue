<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const rememberOpenedMail = true //記憶封蠟狀態
const openedStorageKey = 'twbc-opened-news'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

const goHome = () => {
  router.push(localePath('/'))
}

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

const { data: rawPosts } = await useAsyncData(
  () => `news-posts-${locale.value}`,
  async () => {
    try {
      return await $fetch<RawNewsPost[]>(`/content/news/posts.${locale.value}.json`)
    } catch (err) {
      console.error('Failed to load news posts:', err)
      return []
    }
  },
  {
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
  if (!rememberOpenedMail) return

  localStorage.setItem(
    openedStorageKey,
    JSON.stringify(openedMap.value)
  )
}

function loadOpenedMap() {
  if (!rememberOpenedMail) {
    localStorage.removeItem(openedStorageKey)
    openedMap.value = {}
    return
  }

  const saved = localStorage.getItem(openedStorageKey)

  if (!saved) {
    openedMap.value = {}
    return
  }

  try {
    const parsed = JSON.parse(saved)

    openedMap.value =
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
        ? parsed
        : {}
  } catch {
    openedMap.value = {}
  }
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
    <SharedBackground variant="homepage" />

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
          <div style="margin-top: 1.5rem; display: flex; justify-content: center;">
            <button class="back-btn" @click="goHome">
              {{ t('news.actions.backHome') }}
            </button>
          </div>
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

            <!-- <div class="paper-tools">
              <button
                type="button"
                @click="copyLink(selectedPost.url)"
              >
                {{ t('news.actions.copyLink') }}
              </button>

              <a
                :href="selectedPost.url || '#'"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('news.actions.openPost') }}
              </a>
            </div> -->
          </div>
        </div>
      </div>
      </Teleport>
      <Footer />
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

.back-btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 9.5rem;
  padding: 0.75em 1.5em;
  font-size: 1rem;
  font-family: 'LXGW WenKai Mono TC', monospace;
  color: #ffe9b5;
  background:
    linear-gradient(180deg, rgba(110, 64, 145, 0.85), rgba(66, 34, 86, 0.92));
  border: 1px solid rgba(239, 200, 120, 0.62);
  border-radius: 999px;
  cursor: pointer;
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.08),
    0 6px 18px rgba(0, 0, 0, 0.24);
  transition: transform .18s ease, box-shadow .18s ease, background-color .18s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.28),
    0 0 16px rgba(255, 218, 136, 0.1);
}

.back-btn:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
