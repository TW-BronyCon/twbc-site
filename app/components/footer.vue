<script setup lang="ts">
import { computed, ref } from 'vue'

const { t, tm, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const partners = [
  {
    name: 'TWBC',
    logo: '/img/text-logo-clear.avif',
    url: '/',
    internal: true,
    altKey: 'home.footer.logoAlt'
  }
]

const quotes = computed<string[]>(() => {
  const raw = tm('home.quotes') as unknown
  let list: unknown[] = []

  if (Array.isArray(raw)) {
    list = raw
  } else if (raw && typeof raw === 'object') {
    list = Object.values(raw)
  }

  if (list.length === 0) {
    let i = 0

    while (i < 100) {
      const key = `home.quotes.${i}`
      const val = t(key)

      if (!val || val === key) break

      list.push(val)
      i++
    }
  }

  return list
    .map(q => {
      if (typeof q === 'string') return q

      if (typeof q === 'function') {
        const result = q()
        return typeof result === 'string' ? result : String(result ?? '')
      }

      if (q && typeof q === 'object') {
        const item = q as any

        if (item.body && typeof item.body.static === 'string') return item.body.static
        if (typeof item.static === 'string') return item.static

        return item.value || item.b || item.v || String(item)
      }

      return String(q || '')
    })
    .filter(q => q.trim() !== '')
})

const { currentQuote, isQuoteFadingOut } = useQuotes(
  quotes,
  10000,
  ''
)

const showUpdateLog = ref(false)

let versionClickCount = 0
let versionClickTimer: ReturnType<typeof setTimeout> | null = null

const currentVersion = 'v0.3.5'

const updateLogs = [
  {
    version: 'v0.1.0',
    date: '2026-04-25',
    changes: [
      '設計首頁、購票頁面',
      '新增導航列(電腦頂邊攔，手機側邊攔)',
      '新增倒數計時器功能，並於時間結束顯示其他字串',
      '新增視差效果，在滑動時讓3層背景圖片有不同的移動速度，增加深度感',
      '新增票務表格資訊及詳細資訊',
      '新增隨機名言功能',
    ]
  },
  {
    version: 'v0.2.0',
    date: '2026-05-05',
    changes: [
      '改進首頁、購票頁面樣式',
      '在導航列更新兩個路由連結➡(首頁、購票報名)',
      '附上3個申請表單(志工、攤位、自主活動)',
      '改進導航列樣式',
      '修正視差效果效能',
    ]
  },
  {
    version: 'v0.2.1',
    date: '2026-05-05',
    changes: [
      '新增雙語切換功能'
    ]
  },
  {
    version: 'v0.2.2',
    date: '2026-05-05',
    changes: [
      '網站上線'
    ]
  },
  {
    version: 'v0.3.0',
    date: '2026-06-1',
    changes: [
      '設計最新消息頁面',
      '在導航列更新一個路由連結➡(首頁、最新消息、購票報名)',
    ]
  },
  {
    version: 'v0.3.1',
    date: '2026-06-10',
    changes: [
      '改進最新消息頁面樣式',
      '新增更新日誌',
      '維護雙語表',
    ]
  },
  {
    version: 'v0.3.2',
    date: '2026-06-11',
    changes: [
      '改進最新消息頁面樣式',
      '新增信件封蠟開啟記錄',
      '改進更新日誌樣式',
    ]
  },
  {
    version: 'v0.3.3',
    date: '2026-06-12',
    changes: [
      '新增信件內容(6封)',
    ]
  },
  {
    version: 'v0.3.4',
    date: '2026-06-15',
    changes: [
      '更換封蠟樣式',
      '改進信封樣式',
      '在消息頁面新增懸浮吉祥物',
    ]
  },
  {
    version: 'v0.3.5 (BETA)',
    date: '2026-06-16',
    changes: [
      '網站更新',
    ]
  },
]

function handleVersionClick() {
  versionClickCount++

  if (versionClickTimer) {
    clearTimeout(versionClickTimer)
  }

  versionClickTimer = setTimeout(() => {
    versionClickCount = 0
  }, 3000)

  if (versionClickCount >= 3) {
    showUpdateLog.value = true
    versionClickCount = 0
  }
}

function closeUpdateLog() {
  showUpdateLog.value = false
}

watch(showUpdateLog, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''

  if (versionClickTimer) {
    clearTimeout(versionClickTimer)
  }
})
</script>

<template>
  <footer class="footer-root">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logos">
            <template
              v-for="partner in partners"
              :key="partner.name"
            >
              <NuxtLink
                v-if="partner.internal"
                :to="localePath(partner.url)"
              >
                <img
                  :src="partner.logo"
                  :alt="partner.altKey ? $t(partner.altKey) : partner.name"
                  class="footer-logo"
                >
              </NuxtLink>

              <a
                v-else
                :href="partner.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  :src="partner.logo"
                  :alt="partner.name"
                  class="footer-logo"
                >
              </a>
            </template>
          </div>

          <div class="footer-lang-switcher">
            <NuxtLink
              v-for="item in (locales as any)"
              :key="item.code"
              :to="switchLocalePath(item.code)"
              :class="{ active: locale === item.code }"
              class="lang-link"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <div class="footer-social">
          <a
            href="https://www.youtube.com/@TWBronyCon2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            class="social-icon youtube"
          >
            <i class="fa-brands fa-youtube"></i>
          </a>

          <a
            href="https://discord.gg/k83NMPUKxG"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            class="social-icon discord"
          >
            <i class="fa-brands fa-discord"></i>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61583292256078"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="social-icon facebook"
          >
            <i class="fa-brands fa-facebook"></i>
          </a>

          <a
            href="https://x.com/TWBronycon2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            class="social-icon twitter"
          >
            <i class="fa-brands fa-x-twitter"></i>
          </a>

          <a
            href="https://www.instagram.com/taiwanbronycon2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="social-icon instagram"
          >
            <i class="fa-brands fa-instagram"></i>
          </a>
        </div>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>
            {{ $t('home.footer.copyrightNotice') }}
            {{ $t('home.footer.copyright') }}
          </p>

          <button
            class="footer-version"
            type="button"
            aria-label="Website version"
            @click="handleVersionClick"
          >
            {{ currentVersion }}
          </button>
        </div>

        <div class="footer-quotes">
          <ClientOnly>
            <p :class="['quote-text', isQuoteFadingOut ? 'fade-out' : 'fade-in']">
              {{ currentQuote }}
            </p>

            <template #fallback>
              <p class="quote-text">
                {{ $t('home.quotesLoading') }}
              </p>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
    <Teleport to="body">
  <div
    v-if="showUpdateLog"
    class="update-log-modal"
    @click.self="closeUpdateLog"
  >
    <div class="update-log-box">

      <div class="update-log-header">
        <h2>✦ 更新日誌 ✦</h2>

        <button
          class="update-log-close"
          type="button"
          aria-label="Close update log"
          @click="closeUpdateLog"
        >
          ×
        </button>
      </div>

      <div class="update-log-content">
        <div
          v-for="log in updateLogs"
          :key="log.version"
          class="update-log-item"
        >
          <h3>
            {{ log.version }}
            <span>{{ log.date }}</span>
          </h3>

          <ul>
            <li
              v-for="change in log.changes"
              :key="change"
            >
              {{ change }}
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</Teleport>
  </footer>
</template>

<style scoped>
.footer-root {
  background: linear-gradient(
    to top,
    rgb(20, 10, 30) 0%,
    rgba(40, 20, 60, 0.3) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 3rem 0 1.5rem;
  color: #fff;
  z-index: 10;
}

.footer-container {
  width: clamp(50%, 80vw, 1200px);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-logos {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-logo {
  height: 3rem;
  width: auto;
  object-fit: contain;
}

.footer-lang-switcher {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.lang-link {
  font-size: 0.85rem;
  color: #ffbdde;
  text-decoration: none;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.lang-link:hover {
  opacity: 1;
  text-shadow: 0 0 8px rgba(255, 189, 222, 0.5);
}

.lang-link.active {
  opacity: 1;
  font-weight: bold;
  pointer-events: none;
}

.footer-social {
  display: flex;
  gap: 1.25rem;
}

.social-icon {
  font-size: 1.5rem;
  color: #ffbdde;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.social-icon:hover {
  transform: translateY(-5px) scale(1.1);
  color: #fff;
}

.social-icon.youtube:hover {
  color: #ff0000;
}

.social-icon.discord:hover {
  color: #5865F2;
}

.social-icon.facebook:hover {
  color: #1877F2;
}

.social-icon.twitter:hover {
  color: #1DA1F2;
}

.social-icon.instagram:hover {
  color: #E4405F;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  margin-bottom: 1.5rem;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-copyright {
  font-size: 0.85rem;
  color: #ffbdde;
  opacity: 0.7;
}

.footer-copyright p {
  margin: 0.2rem 0;
}

.footer-version {
  display: inline-block;
  margin-top: 0.4rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ffbdde;
  font: inherit;
  font-size: 0.78rem;
  opacity: 0.5;
  cursor: pointer;
  user-select: none;
}

.footer-version:hover {
  opacity: 1;
  text-shadow: 0 0 8px rgba(255, 189, 222, 0.6);
}

.footer-quotes {
  flex: 1;
  max-width: 60%;
  text-align: right;
}

.quote-text {
  margin: 0;
  font-size: 0.95rem;
  color: #ffbdde;
  font-style: italic;
  transition: all 0.3s ease-in-out;
}

.fade-out {
  opacity: 0;
  transform: translateX(10px);
}

.fade-in {
  opacity: 1;
  transform: translateX(0);
}

.update-log-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.5rem;
  box-sizing: border-box;

  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.update-log-box {
  position: relative;

  box-sizing: border-box;
  width: min(92vw, 34rem);
  max-height: 75vh;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  padding: 1.5rem 2rem;

  border-radius: 1.25rem;
  color: #fff;

  background: linear-gradient(
    180deg,
    rgba(60, 30, 90, 0.95),
    rgba(25, 10, 40, 0.96)
  );

  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
}

.update-log-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 3.5rem 1rem;
}

.update-log-header h2 {
  margin: 0 !important;
}

.update-log-content {
  overflow-y: auto;
  padding: 0 2rem;
  scrollbar-width: thin;
  scrollbar-color: #d39cff rgba(255, 255, 255, 0);
}

.update-log-content::-webkit-scrollbar {
  width: .5rem;
}

.update-log-content::-webkit-scrollbar-track {
  background:
    rgba(255,255,255,0);

  border-radius: 999px;
}

.update-log-content::-webkit-scrollbar-thumb {
  
  background:
    linear-gradient(
      180deg,
      #ffd5ea,
      #d6a7ff
    );
  border-radius: 999px;

  border:
    2px solid
    rgba(60,30,90,.4);
}

.update-log-content::-webkit-scrollbar-thumb:hover {
  background:
    linear-gradient(
      180deg,
      #ffbdde,
      #c78cff
    );
}

.update-log-close {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-67.5%);
  border: 0;
  background: transparent;
  color: #ffbdde;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
}

.update-log-box h2 {
  margin: 0 0 1.25rem;
  color: #ffbdde;
  text-align: center;
}

.update-log-item {
  margin-top: 1.2rem;
}

.update-log-item h3 {
  margin: 0 0 0.5rem;
  color: #fff;
}

.update-log-item h3 span {
  margin-left: 0.6rem;
  font-size: 0.8em;
  color: #ffbdde;
  opacity: 0.7;
}

.update-log-item ul {
  margin: 0;
  padding-left: 1.2rem;
}

.update-log-item li {
  margin: 0.35rem 0;
  color: #ffd6ea;
}

@media screen and (max-width: 800px) {
  .footer-root {
    padding: 2rem 0 1rem;
  }

  .footer-container {
    width: 100%;
  }

  .footer-top {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
  }

  .footer-bottom {
    flex-direction: column-reverse;
    gap: 1.5rem;
    text-align: center;
  }

  .footer-quotes {
    max-width: 100%;
    text-align: center;
  }

  .footer-copyright {
    text-align: center;
  }

  .footer-logos {
    transform: translateX(37.5px);
  }

  .update-log-box {
    width: min(94vw, 32rem);
    padding: 1.5rem;
  }
}
</style>