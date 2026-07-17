<script setup lang="ts">
import { computed } from "vue";

const { t, locale } = useI18n();
const localePath = useLocalePath();

// ---------- Controllers ----------
const { countdownMsg, days, hours, minutes, seconds } = useCountdown(
  "2026-08-15T09:30:00+08:00",
  "2026-08-15T21:00:00+08:00",
);

const translatedCountdownMsg = computed(() => {
  if (!countdownMsg.value) return "";
  return t(`home.countdown.${countdownMsg.value}`);
});

const formatNumber = (num: number): string => {
  return String(num).padStart(2, "0");
};
</script>

<template>
  <div class="homepage-root">
    <main class="container">
      <section class="hero">
        <img
          class="logo"
          src="/img/text-logo.avif"
          alt="TWBC"
          width="2362"
          height="1816"
        />

        <div class="date">
          {{ $t("home.subtitle") }}
          <span class="time-addon">09:30 (GMT+8)</span>
        </div>

        <div class="countdown-area">
          <div v-if="!countdownMsg" class="count-title">
            {{ $t("home.countdown.title") }}
          </div>
          <div class="countdown">
            <span v-if="translatedCountdownMsg" class="countdown-message">{{
              translatedCountdownMsg
            }}</span>
            <template v-else>
              <div v-if="days > 0" class="countdown-card">
                <div class="countdown-number-wrapper">
                  <Transition name="digit-slide">
                    <span :key="days" class="countdown-number">{{
                      formatNumber(days)
                    }}</span>
                  </Transition>
                </div>
                <span class="countdown-label">{{
                  $t("home.countdown.days")
                }}</span>
              </div>
              <div v-if="days > 0 || hours > 0" class="countdown-card">
                <div class="countdown-number-wrapper">
                  <Transition name="digit-slide">
                    <span :key="hours" class="countdown-number">{{
                      formatNumber(hours)
                    }}</span>
                  </Transition>
                </div>
                <span class="countdown-label">{{
                  $t("home.countdown.hours")
                }}</span>
              </div>
              <div
                v-if="days > 0 || hours > 0 || minutes > 0"
                class="countdown-card"
              >
                <div class="countdown-number-wrapper">
                  <Transition name="digit-slide">
                    <span :key="minutes" class="countdown-number">{{
                      formatNumber(minutes)
                    }}</span>
                  </Transition>
                </div>
                <span class="countdown-label">{{
                  $t("home.countdown.minutes")
                }}</span>
              </div>
              <div class="countdown-card">
                <div class="countdown-number-wrapper">
                  <Transition name="digit-slide">
                    <span :key="seconds" class="countdown-number">{{
                      formatNumber(seconds)
                    }}</span>
                  </Transition>
                </div>
                <span class="countdown-label">{{
                  $t("home.countdown.seconds")
                }}</span>
              </div>
            </template>
          </div>
        </div>

        <NuxtLink class="buy-btn" :to="localePath('/ticket')">{{
          $t("menu.ticket")
        }}</NuxtLink>
      </section>

      <section class="info-card">
        <h2>{{ $t("home.about.title") }}</h2>
        <h4>{{ $t("home.about.content") }}</h4>
        <h4 class="pinkie-quote align-right">
          {{ $t("home.about.pinkiequote") }}
        </h4>
      </section>

      <section class="info-card">
        <h2>{{ $t("home.location.title") }}</h2>
        <h4 class="location-details">
          {{ $t("home.location.name") }}<br />
          {{ $t("home.location.address") }}
        </h4>
        <iframe
          class="map"
          :title="$t('home.location.mapTitle')"
          loading="lazy"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d903.4343855604266!2d121.4858447!3d25.0768833!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a8d751f69539%3A0x3363e968c8ea913!2zQXNpIFNwYWNlIFJlbnRhbCDpmL_mlq_nlJ_mtLvnqbrplpPloLTlnLDlh7rnp58!5e0!3m2!1szh-TW!2stw!4v1777220130926!5m2!1szh-TW!2stw"
          referrerpolicy="no-referrer-when-downgrade"
        >
        </iframe>
      </section>

      <section class="info-card large">
        <h2>{{ $t("home.faq.title") }}</h2>
        <div v-for="i in 4" :key="i">
          <h4>{{ $t("home.faq.questionPrefix") }}{{ $t(`home.faq.q${i}`) }}</h4>
          <p>{{ $t("home.faq.answerPrefix") }}{{ $t(`home.faq.a${i}`) }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* General Reset */
.homepage-root {
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Main Container */
.container {
  position: relative;
  width: clamp(50%, 50vw, 1400px);
  border-radius: 1em;
  background: linear-gradient(
    to bottom,
    rgba(72, 38, 82, 0) 40%,
    rgba(72, 38, 82, 0.5) 50%,
    rgba(72, 38, 82, 0.5) 95%,
    rgba(72, 38, 82, 0) 100%
  );
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 1.2em 0em;
  box-sizing: border-box;
  container-type: inline-size;
}

.container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(72, 38, 82, 0) 40%,
    rgba(72, 38, 82, 0.5) 50%,
    rgba(72, 38, 82, 0.5) 95%,
    rgba(72, 38, 82, 0) 100%
  );
  z-index: -2;
  transition: all 0.25s ease;
}

/* Logo */
.logo {
  display: block;
  width: clamp(20em, 30vw, 40em);
  height: auto;
  margin: 5rem auto 5.5rem;
  transition: all 0.2s ease-out;
}

/* Hero */
.hero {
  text-align: center;
  padding: 2.2em 0 2.5em;
  margin-bottom: 10em;
  color: var(--color-pink);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.hero .date {
  font-size: clamp(1.75em, 3.5vw, 2.25em);
  margin-bottom: 0.5em;
  color: var(--color-text-light);
}

.hero .time-addon {
  font-size: 0.65em;
  color: var(--color-pink);
  font-weight: 600;
  margin-left: 0.3em;
  white-space: nowrap;
}

.countdown-area {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 2rem;
  gap: 0.75rem;
}

.count-title {
  margin: 0;
  font-size: clamp(1.5em, 3.5vw, 1.75em);
}

/* Countdown */
.countdown {
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 1.25rem);
  flex-wrap: wrap;
  margin: 0;
}

.countdown-card {
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem);
  min-width: clamp(4.25rem, 11vw, 5.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.3s,
    box-shadow 0.3s;
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.countdown-card:nth-child(1) {
  animation-delay: 0.1s;
}
.countdown-card:nth-child(2) {
  animation-delay: 0.2s;
}
.countdown-card:nth-child(3) {
  animation-delay: 0.3s;
}
.countdown-card:nth-child(4) {
  animation-delay: 0.4s;
}

.countdown-number-wrapper {
  position: relative;
  overflow: hidden;
  height: clamp(2rem, 5vw, 2.75rem);
  width: 100%;
}

.countdown-number {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--color-gold);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.countdown-label {
  font-size: clamp(0.7rem, 1.8vw, 0.85rem);
  color: var(--color-pink);
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.countdown-message {
  display: inline-block;
  text-align: center;
  font-size: clamp(1.5em, 3.5vw, 2em);
  color: var(--color-pink);
}

/* Animations */
.digit-slide-enter-active,
.digit-slide-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.4s ease;
}

.digit-slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.digit-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Buy Button */
.buy-btn {
  display: inline-block;
  margin: clamp(0.5em, 2cqw, 1.25em) 0 clamp(1.5em, 4cqw, 2.25em);
  padding: clamp(0.6em, 1.5cqw, 0.75em) clamp(1.2em, 3cqw, 2em);
  color: var(--color-text-light);
  font-weight: bold;
  text-decoration: none;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.25);
  font-size: clamp(1em, 2.2cqw, 1.3em);
  background: linear-gradient(150deg, #a77cb8, #885f9c);
  border-radius: clamp(0.3em, 1.8cqw, 0.6em);
  box-shadow:
    0 0.15em 0.5em rgba(0, 0, 0, 0.15),
    0 0.2em 0.8em rgba(120, 90, 140, 0.43);
  transition: all 0.2s ease-out;
}

.buy-btn:hover {
  transform: translateY(-0.1em) scale(1.01);
  background: linear-gradient(135deg, #956fb8, #8a5dae);
  text-shadow: none;
}

.buy-btn:active {
  background: #a26b93;
  transform: translateY(0) scale(0.98);
  box-shadow:
    0 0.1em 0.4em rgba(0, 0, 0, 0.3),
    inset 0 0.2em 0.5em rgba(0, 0, 0, 0.3);
  text-shadow: 0 3px 7px rgba(0, 0, 0, 0.5);
}

/* Info Card */
.info-card {
  min-height: 13em;
  margin: 1.5em 0;
  padding: 1.5em;
  border: 0.12em solid rgba(255, 255, 255, 0.45);
  border-radius: 1em;
  background: rgba(78, 48, 86, 0.42);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05);
}

.info-card.large {
  min-height: 18em;
}

.info-card h2 {
  margin: 0 0 0.5em;
  text-align: center;
  font-size: clamp(1.75em, 3.75cqw, 2em);
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
}

.info-card h4 {
  text-align: justify;
  font-size: clamp(1.1em, 2.75cqw, 1.25em);
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
  margin-bottom: 0;
  font-weight: 400;
}

.info-card h4.location-details {
  text-align: center;
}

.info-card p {
  text-align: justify;
  font-size: clamp(1.1em, 2.75cqw, 1.2em);
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
  margin-top: 0;
  font-weight: 400;
}

/* Map */
.map {
  border: 0;
  border-radius: 1em;
  background: rgba(78, 48, 86, 0.42);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05);
  width: 100%;
  height: 50vh;
  margin-top: 1em;
}

.pinkie-quote {
  display: block;
  margin-top: 1em;
  color: var(--color-pink);
  text-align: right;
}

/* Mobile */
@media screen and (max-width: 800px) {
  .container {
    width: 100%;
    padding: 0 0.5em 1em;
  }

  .container::before {
    background: linear-gradient(
      to bottom,
      rgba(72, 38, 82, 0) 25%,
      rgba(72, 38, 82, 0.5) 35%,
      rgba(72, 38, 82, 0.5) 95%,
      rgba(72, 38, 82, 0) 100%
    );
  }

  .logo {
    margin: 3em auto 1em;
  }

  .hero {
    margin-bottom: 2.5em;
  }

  .countdown {
    margin: 0.25em 0 0.75em 0;
  }

  .info-card {
    min-height: 11em;
  }

  .info-card.large {
    min-height: 15em;
  }
}
</style>
