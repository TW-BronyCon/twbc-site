<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const localePath = useLocalePath();

const isNavOpen = ref(false);
const openSubmenu = ref<string | null>(null);

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
  if (!isNavOpen.value) openSubmenu.value = null;
};

const toggleSubmenu = (name: string) => {
  openSubmenu.value = openSubmenu.value === name ? null : name;
};

const closeMenus = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".top-nav") && !target.closest(".nav-toggle")) {
    isNavOpen.value = false;
    openSubmenu.value = null;
  }
};

onMounted(() => document.addEventListener("click", closeMenus));
onUnmounted(() => document.removeEventListener("click", closeMenus));
</script>

<template>
  <button
    type="button"
    class="nav-toggle"
    :class="{ active: isNavOpen }"
    :aria-expanded="isNavOpen"
    aria-label="Toggle navigation menu"
    @click.stop="toggleNav"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <nav class="top-nav" :class="{ open: isNavOpen }" aria-label="Primary Navigation">
    <NuxtLink
      :to="localePath('/')"
      @click="
        isNavOpen = false;
        openSubmenu = null;
      "
      >{{ $t("menu.home") }}</NuxtLink
    >
    <NuxtLink
      :to="localePath('/news')"
      @click="
        isNavOpen = false;
        openSubmenu = null;
      "
      >{{ $t("menu.news") }}</NuxtLink
    >
    <NuxtLink
      :to="localePath('/ticket')"
      @click="
        isNavOpen = false;
        openSubmenu = null;
      "
      >{{ $t("menu.ticket") }}</NuxtLink
    >
    <NuxtLink
      :to="localePath('/schedule')"
      @click="
        isNavOpen = false;
        openSubmenu = null;
      "
      >{{ $t("menu.schedule") }}</NuxtLink
    >

    <ul class="menu">
      <li class="menu-group" :class="{ open: openSubmenu === 'apply' }">
        <button
          type="button"
          aria-haspopup="true"
          :aria-expanded="openSubmenu === 'apply'"
          @click="toggleSubmenu('apply')"
        >
          {{ $t("menu.apply") }}
        </button>
        <ul class="submenu">
          <li>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc-oA7Cbqis71Azd_7ZF2i6e7OqMr9h5pXCwP8D7IZFfIiCFg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t("apply.volunteer") }}</a
            >
          </li>
          <li>
            <span class="submenu-disabled">{{ $t("apply.vendor") }}</span>
          </li>
          <li>
            <span class="submenu-disabled">{{ $t("apply.event") }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <NuxtLink
      :to="localePath('/venue')"
      @click="
        isNavOpen = false;
        openSubmenu = null;
      "
      >{{ $t("menu.venue") }}</NuxtLink
    >
    <NuxtLink
      :to="localePath('/transport')"
      @click="
        isNavOpen = false;
        openSubmenu = null;
      "
      >{{ $t("menu.transport") }}</NuxtLink
    >
    <NuxtLink
      v-if="false"
      :to="localePath('/about')"
      @click="
        isNavOpen = false;
        openSubmenu = null;
      "
      >{{ $t("menu.about") }}</NuxtLink
    >
    <span v-else class="nav-coming-soon">{{ $t("tba.about") }}</span>
  </nav>
</template>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(0.5em, 1.6vw, 1.5em);

  min-height: clamp(2em, 3.2vw, 3em);
  padding: 0.15em clamp(0.7em, 2.5vw, 1.7em) clamp(0em, 2vw, 0.2em)
    clamp(1em, 2.5vw, 2em);

  background: var(--color-nav-bg);
  border: 1px solid color-mix(in srgb, var(--color-gold) 18%, transparent);
  border-top: 0;
  border-radius: 0 0 1em 1em;

  backdrop-filter: blur(0.6em);
  -webkit-backdrop-filter: blur(0.6em);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.nav-coming-soon {
  color: rgba(255, 255, 255, 0.45);

  font-size: clamp(0.86em, 1.35vw, 1.02em);

  text-shadow: none;

  cursor: default;
  user-select: none;

  white-space: nowrap;
}

.nav-coming-soon:hover {
  color: rgba(255, 255, 255, 0.45);
}

.top-nav a,
.top-nav .menu-group > button {
  position: relative;

  color: #fff;
  font-size: clamp(0.86em, 1.35vw, 1.02em);
  text-decoration: none;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.65);

  white-space: nowrap;
}

.top-nav a::after,
.top-nav .menu-group > button::after {
  content: "";

  position: absolute;
  left: 50%;
  bottom: -2px;

  width: 0;
  height: 2px;

  background: var(--color-gold);

  transition:
    width 0.25s ease,
    left 0.25s ease;
}

.top-nav > a:hover::after,
.top-nav .menu-group > button:hover::after,
.top-nav .menu-group.open > button::after,
.top-nav > a.router-link-active::after,
.top-nav > a.router-link-exact-active::after {
  left: 0;
  width: 100%;
}

.top-nav a:hover,
.top-nav .menu-group > button:hover,
.top-nav .menu-group.open > button,
.top-nav > a.router-link-active,
.top-nav > a.router-link-exact-active {
  color: var(--color-gold);

  text-shadow:
    0 0 6px color-mix(in srgb, var(--color-gold) 75%, transparent),
    0 0 14px color-mix(in srgb, var(--color-pink) 45%, transparent);
}

.top-nav .menu {
  display: flex;
  align-items: center;
  gap: clamp(0.5em, 2vw, 2em);

  margin: 0;
  padding: 0;

  list-style: none;
  transform: translateY(-1px);
}

.top-nav .menu-group {
  position: relative;
}

.top-nav .menu-group > button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.top-nav .submenu {
  position: absolute;
  top: 100%;
  left: -1em;

  min-width: 8em;

  margin-top: 0.5em;
  padding: 0.5em 0;

  list-style: none;

  background: color-mix(in srgb, var(--color-nav-bg) 88%, #000);
  border: 1px solid color-mix(in srgb, var(--color-gold) 14%, transparent);
  border-radius: 0.6em;

  backdrop-filter: blur(0.6em);
  -webkit-backdrop-filter: blur(0.6em);

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);

  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;

  transition: all 0.25s ease;
}

.top-nav .submenu li a,
.top-nav .submenu li .submenu-disabled {
  display: block;
  padding: 0.6em 1em;
  font-size: 0.95em;
}

.top-nav .submenu li .submenu-disabled {
  color: rgba(255, 255, 255, 0.45);
  cursor: default;
  user-select: none;
  white-space: nowrap;
}

.top-nav .menu-group:hover .submenu,
.top-nav .menu-group.open .submenu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.nav-toggle {
  display: none;
}

@media (max-width: 900px) {
  .nav-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 60;

    display: grid;
    place-content: center;
    gap: 5px;

    width: 44px;
    height: 44px;

    background: color-mix(in srgb, var(--color-nav-bg) 78%, #000);
    border: 1px solid color-mix(in srgb, var(--color-gold) 22%, transparent);
    border-radius: 999px;

    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
  }

  .nav-toggle span {
    display: block;

    width: 22px;
    height: 2px;

    background: #fff;
    border-radius: 999px;

    transition: 0.25s ease;
  }

  .nav-toggle.active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .nav-toggle.active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .top-nav {
    top: 4.4rem;
    left: auto;
    right: 1rem;

    width: min(280px, calc(100vw - 2rem));

    padding: 0.9rem;

    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;

    border-radius: 1rem;

    transform: translateY(-12px);

    opacity: 0;
    pointer-events: none;
  }

  .top-nav.open {
    transform: translateY(0);

    opacity: 1;
    pointer-events: auto;
  }

  .top-nav a,
  .top-nav .menu-group > button,
  .nav-coming-soon,
  .top-nav .submenu li .submenu-disabled {
    display: block;

    padding: 0.55rem 0.7rem;

    font-size: 1rem;
  }

  .top-nav a::after,
  .top-nav .menu-group > button::after {
    display: none;
  }

  .top-nav .menu {
    display: block;
  }

  .top-nav .submenu {
    position: static;

    margin: 0.1rem 0 0.3rem 0.75rem;

    display: none;

    opacity: 1;
    transform: none;
    pointer-events: auto;

    background: rgba(255, 255, 255, 0.06);

    box-shadow: none;
  }

  .top-nav .menu-group.open .submenu {
    display: block;
  }
}
</style>
