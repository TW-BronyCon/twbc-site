<script setup lang="ts">
import { computed } from "vue";

const { t, locale } = useI18n();
const localePath = useLocalePath();

// ---------- Controllers ----------
const { countdownMsg, days, hours, minutes, seconds } = useCountdown(
  "2026-08-15T10:00:00+08:00",
  "2026-08-15T21:00:00+08:00",
);

const translatedCountdownMsg = computed(() => {
  if (!countdownMsg.value) return "";
  return t(`home.countdown.${countdownMsg.value}`);
});
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

        <div class="date">{{ $t("home.subtitle") }}</div>

        <div class="count-title">{{ $t("home.countdown.title") }}</div>
        <div class="countdown">
          <span v-if="translatedCountdownMsg" class="countdown-message">{{
            translatedCountdownMsg
          }}</span>
          <template v-else>
            <span>{{ days }}</span> {{ $t("home.countdown.days") }}
            <span>{{ hours }}</span> {{ $t("home.countdown.hours") }}
            <span>{{ minutes }}</span> {{ $t("home.countdown.minutes") }}
            <span>{{ seconds }}</span> {{ $t("home.countdown.seconds") }}
          </template>
        </div>

        <NuxtLink class="buy-btn" :to="localePath('/ticket')">{{
          $t("home.nav.tickets")
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
          title="Google Map showing TW BronyCon venue location"
          loading="lazy"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d903.4343855604266!2d121.4858447!3d25.0768833!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a8d751f69539%3A0x3363e968c8ea913!2zQXNpIFNwYWNlIFJlbnRhbCDpmL_mlq_nlJ_mtLvnqbrplpPloLTlnLDlh7rnp58!5e0!3m2!1szh-TW!2stw!4v1777220130926!5m2!1szh-TW!2stw"
          referrerpolicy="no-referrer-when-downgrade"
        >
        </iframe>
      </section>

      <section class="info-card large">
        <h2>{{ $t("home.faq.title") }}</h2>
        <div v-for="i in 4" :key="i">
          <h4>Q：{{ $t(`home.faq.q${i}`) }}</h4>
          <p>A：{{ $t(`home.faq.a${i}`) }}</p>
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

.count-title {
  margin-top: 0.9em;
  font-size: clamp(1.5em, 3.5vw, 1.75em);
}

/* Countdown */
.countdown {
  font-size: clamp(1.5em, 3.5vw, 2em);
  display: flex;
  justify-content: center;
  gap: clamp(0.25em, 2vw, 1.25em);
  white-space: nowrap;
  margin: 0.25em 0 0.5em;
}

.countdown span {
  min-width: clamp(1.5ch, 2vw, 2ch);
  text-align: center;
}

.countdown-message {
  display: inline-block;
  text-align: center;
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
