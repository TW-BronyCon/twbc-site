<script setup lang="ts">
import { computed } from 'vue'
const { t, tm } = useI18n()

const quotes = computed(() => {
  const raw = tm('home.quotes')
  return Array.isArray(raw) ? raw.map(q => typeof q === 'string' ? q : String(q.value || '')) : []
})

const { currentQuote, isQuoteFadingOut } = useQuotes(quotes.value)
</script>

<template>
  <footer class="shared-footer overlay translucent">
    <div class="footer-container">
      <div class="footer-left">
        <div class="copyright">
          <p>{{ $t('home.footer.copyrightNotice') }}</p>
          <p>{{ $t('home.footer.copyright') }}</p>
        </div>
      </div>

      <div class="footer-center Quotes">
        <p :class="['quote-text', isQuoteFadingOut ? 'fade-out' : 'fade-in']">
          {{ currentQuote }}
        </p>
      </div>

      <div class="footer-right">
        <div class="footer-links">
          <a href="https://www.youtube.com/@TWBronyCon2" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          <a href="https://discord.gg/k83NMPUKxG" target="_blank" aria-label="Discord"><i class="fa-brands fa-discord"></i></a>
          <a href="https://www.facebook.com/profile.php?id=61583292256078" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://x.com/TWBronycon2" target="_blank" aria-label="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.instagram.com/taiwanbronycon2" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.shared-footer {
  width: 100%;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.8) 0%,
    rgba(0,0,0,0.4) 50%,
    rgba(0,0,0,0) 100%
  );
  padding: 2rem 0 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  gap: 1rem;
}

.footer-left {
  display: flex;
  flex-direction: column;
}

.copyright p {
  margin: 0;
  color: #c9eaeb;
  font-size: clamp(0.8rem, 1.2vw, 1rem);
  line-height: 1.4;
}

.footer-center {
  text-align: center;
}

.Quotes {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 3em;
}

.quote-text {
  margin: 0;
  color: #c9eaeb;
  font-size: clamp(0.75rem, 1.4vw, 1.1rem);
  font-style: italic;
  transition: all 0.3s ease;
}

.fade-out {
  opacity: 0;
  transform: translateY(5px);
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.footer-right {
  display: flex;
  justify-content: flex-end;
}

.footer-links {
  display: flex;
  gap: 1.25rem;
}

.footer-links a {
  color: #7ff2f6;
  font-size: clamp(1.2rem, 1.8vw, 1.8rem);
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #ffbdde;
  transform: translateY(-3px);
}

@media (max-width: 800px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }

  .footer-left, .footer-right {
    justify-content: center;
  }

  .footer-right {
    order: -1;
  }

  .footer-center {
    display: block;
  }
  
  .Quotes {
    min-height: auto;
  }
}
</style>
