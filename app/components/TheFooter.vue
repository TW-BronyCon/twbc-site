<script setup lang="ts">
import { computed } from 'vue'

const { t, tm } = useI18n()

// Quote Logic
const quotes = computed(() => {
  // Method 1: Try tm (translated message)
  const raw = tm('home.quotes')
  let list: any[] = []
  
  if (raw && typeof raw !== 'string') {
    list = Array.isArray(raw) ? raw : Object.values(raw)
  }

  // Method 2: Fallback to t-loop if Method 1 returned nothing
  if (list.length === 0) {
    let i = 0
    while (true) {
      const key = `home.quotes.${i}`
      const val = t(key)
      if (val === key) break
      list.push(val)
      i++
      if (i > 100) break // Safety break
    }
  }
  
  return list.map(q => {
    // If it's already a string, return it
    if (typeof q === 'string') return q
    // If it's a function (some i18n setups return message functions), call it
    if (typeof q === 'function') return q()
    // If it's an object, try to extract the message
    if (q && typeof q === 'object') {
      // Handle compiled message objects (body.static)
      if (q.body && typeof q.body.static === 'string') return q.body.static
      // Handle cases where static is at the top level
      if (typeof q.static === 'string') return q.static
      // Common properties in other i18n message formats
      return (q as any).value || (q as any).b || (q as any).v || String(q)
    }
    return String(q || '')
  }).filter(q => !!q && q.trim() !== '')
})
const { currentQuote, isQuoteFadingOut } = useQuotes(quotes)
</script>

<template>
  <footer class="footer-root translucent">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/img/text-logo.avif" alt="TWBC Logo" class="footer-logo">
        </div>
        
        <div class="footer-social">
          <a href="https://www.youtube.com/@TWBronyCon2" target="_blank" aria-label="YouTube" class="social-icon youtube"><i class="fa-brands fa-youtube"></i></a>
          <a href="https://discord.gg/k83NMPUKxG" target="_blank" aria-label="Discord" class="social-icon discord"><i class="fa-brands fa-discord"></i></a>
          <a href="https://www.facebook.com/profile.php?id=61583292256078" target="_blank" aria-label="Facebook" class="social-icon facebook"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://x.com/TWBronycon2" target="_blank" aria-label="X (Twitter)" class="social-icon twitter"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.instagram.com/taiwanbronycon2" target="_blank" aria-label="Instagram" class="social-icon instagram"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>{{ $t('home.footer.copyrightNotice') }} {{ $t('home.footer.copyright') }}</p>
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

.footer-logo {
  height: 3rem;
  width: auto;
  object-fit: contain;
}

.footer-tagline {
  font-size: 0.9rem;
  color: #ffbdde;
  margin: 0;
  opacity: 0.8;
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

.social-icon.youtube:hover { color: #ff0000; }
.social-icon.discord:hover { color: #5865F2; }
.social-icon.facebook:hover { color: #1877F2; }
.social-icon.twitter:hover { color: #1DA1F2; }
.social-icon.instagram:hover { color: #E4405F; }

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

.translucent {
  transition: opacity 0.25s ease, visibility 0.25s ease;
}
</style>
