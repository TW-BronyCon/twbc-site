<script setup lang="ts">
import { computed } from "vue";

const { t, tm, rt, locale, locales } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const partners = [
  {
    name: "TWBC",
    logo: "/img/text-logo-clear.avif",
    url: "/",
    internal: true,
    altKey: "home.footer.logoAlt",
  },
  // {
  //   name: 'Future Con',
  //   logo: '/img/text-logo-clear.avif',
  //   url: 'https://example.com',
  //   internal: false
  // }
];

// Quote Logic
const quotes = computed(() => {
  // Method 1: Try tm (translated message)
  const quotesKey = "home.quotes";
  const raw = tm(quotesKey) as unknown;
  let list: unknown[] = [];

  if (raw && typeof raw !== "string") {
    list = (Array.isArray(raw) ? raw : Object.values(raw)) as unknown[];
  }

  // Method 2: Fallback to t-loop if Method 1 returned nothing
  if (list.length === 0) {
    let i = 0;
    while (true) {
      const key = `home.quotes.${i}`;
      const val = t(key);
      if (val === key) break;
      list.push(val);
      i++;
      if (i > 100) break; // Safety break
    }
  }

  return list
    .map((q) => {
      // Use rt to resolve pre-compiled i18n messages
      try {
        return rt(q as any);
      } catch (e) {
        // Fallback if rt is not available or fails
      }
      // If it's already a string, return it
      if (typeof q === "string") return q;
      // If it's a function (some i18n setups return message functions), call it
      if (typeof q === "function") return (q as () => string)();
      return String(q || "");
    })
    .filter((q) => !!q && q.trim() !== "");
});
const { currentQuote, isQuoteFadingOut } = useQuotes(
  quotes,
  10000,
  t("home.quotesLoading"),
);
</script>

<template>
  <footer class="footer-root">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logos">
            <template v-for="partner in partners" :key="partner.name">
              <NuxtLink v-if="partner.internal" :to="localePath(partner.url)">
                <img
                  :src="partner.logo"
                  :alt="partner.altKey ? $t(partner.altKey) : partner.name"
                  class="footer-logo"
                  width="2362"
                  height="1816"
                />
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
                  width="2362"
                  height="1816"
                />
              </a>
            </template>
          </div>

          <div class="footer-lang-switcher">
            <NuxtLink
              v-for="item in locales as any"
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
            ><i class="fa-brands fa-youtube"></i
          ></a>
          <a
            href="https://discord.gg/k83NMPUKxG"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            class="social-icon discord"
            ><i class="fa-brands fa-discord"></i
          ></a>
          <a
            href="https://www.facebook.com/profile.php?id=61583292256078"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="social-icon facebook"
            ><i class="fa-brands fa-facebook"></i
          ></a>
          <a
            href="https://x.com/TWBronycon2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            class="social-icon twitter"
            ><i class="fa-brands fa-x-twitter"></i
          ></a>
          <a
            href="https://www.instagram.com/taiwanbronycon2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="social-icon instagram"
            ><i class="fa-brands fa-instagram"></i
          ></a>
        </div>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>
            {{ $t("home.footer.copyrightNotice") }}
            {{ $t("home.footer.copyright") }}
          </p>
        </div>

        <div class="footer-quotes">
          <p :class="['quote-text', isQuoteFadingOut ? 'fade-out' : 'fade-in']">
            {{ currentQuote }}
          </p>
        </div>
      </div>
    </div>
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
  /* border-top: 1px solid rgba(255, 255, 255, 0.1); */
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
  color: var(--color-pink);
  text-decoration: none;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.lang-link:hover {
  opacity: 1;
  text-shadow: 0 0 8px color-mix(in srgb, var(--color-pink) 50%, transparent);
}

.lang-link.active {
  opacity: 1;
  font-weight: bold;
  pointer-events: none;
}

.footer-tagline {
  font-size: 0.9rem;
  color: var(--color-pink);
  margin: 0;
  opacity: 0.8;
}

.footer-social {
  display: flex;
  gap: 1.25rem;
}

.social-icon {
  font-size: 1.5rem;
  color: var(--color-pink);
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
  color: #5865f2;
}
.social-icon.facebook:hover {
  color: #1877f2;
}
.social-icon.twitter:hover {
  color: #1da1f2;
}
.social-icon.instagram:hover {
  color: #e4405f;
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
  color: var(--color-pink);
  opacity: 0.7;
}

.footer-copyright p {
  margin: 0.2rem 0;
}

.footer-quotes {
  flex: 1;
  max-width: 60%;
  text-align: right;
}

.quote-text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-pink);
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

/* Mobile */
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
}
</style>
