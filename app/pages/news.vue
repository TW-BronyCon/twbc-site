<script setup lang="ts">
const rememberOpenedMail = false //是否存到local
const openedStorageKey = 'twbc-opened-news'

const { t, locale, getLocaleMessage } = useI18n()

useHead({
  title: () => t('newsPage.title')
})

type MaybeI18nValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | {
      source?: string
      body?: {
        static?: string
      }
    }

type RawNewsPost = {
  id?: MaybeI18nValue
  title?: MaybeI18nValue
  author?: MaybeI18nValue
  time?: MaybeI18nValue
  content?: MaybeI18nValue
  url?: MaybeI18nValue
}

type NewsPost = {
  id: string
  title: string
  author: string
  time: string
  content: string
  url: string
}

type LocaleMessage = {
  news?: {
    posts?: RawNewsPost[]
  }
}

type ContentPart =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string }

function toText(value: MaybeI18nValue): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value)
  }

  return value.source || value.body?.static || ''
}

const posts = computed<NewsPost[]>(() => {
  const message = getLocaleMessage(locale.value) as LocaleMessage
  const rawPosts = message.news?.posts

  if (!Array.isArray(rawPosts)) {
    return []
  }

  return rawPosts.map((post, index) => {
    const id = toText(post.id) || `post_${index + 1}`

    return {
      id,
      title: toText(post.title),
      author: toText(post.author),
      time: toText(post.time),
      content: toText(post.content),
      url: toText(post.url) || '#'
    }
  })
})

const selectedPost = ref<NewsPost | null>(null)
const openedMap = ref<Record<string, boolean>>({})

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
    return
  }

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

    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
    ) {
      openedMap.value = parsed
    } else {
      openedMap.value = {}
    }
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

onMounted(() => {
  loadOpenedMap()
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="legacy-page-root">
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
            class="mail"
            :class="{ opened: openedMap[post.id] }"
            @click="openMail(post)"
          >
            <div class="stamp"></div>

            <div class="wax-seal" aria-hidden="true">
              <span class="wax-left"></span>
              <span class="wax-right"></span>
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
    </div>
  </div>
</template>

<style src="~/assets/css/font.css"></style>
<style scoped src="~/assets/css/news.css"></style>

<style scoped>
.legacy-page-root {
  position: relative;
  /* min-height: 100vh; */
  padding-top: clamp(4.5rem, 7vw, 6.5rem);
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