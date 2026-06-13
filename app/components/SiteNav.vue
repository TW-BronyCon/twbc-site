<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const { locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const isNavOpen = ref(false)
const openSubmenu = ref<string | null>(null)

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
  if (!isNavOpen.value) openSubmenu.value = null
}

const toggleSubmenu = (name: string) => {
  openSubmenu.value = openSubmenu.value === name ? null : name
}

const closeMenus = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.top-nav') && !target.closest('.nav-toggle')) {
    isNavOpen.value = false
    openSubmenu.value = null
  }
}

onMounted(() => document.addEventListener('click', closeMenus))
onUnmounted(() => document.removeEventListener('click', closeMenus))
</script>

<template>
  <button class="nav-toggle" :class="{ active: isNavOpen }" @click.stop="toggleNav">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <nav class="top-nav" :class="{ open: isNavOpen }">
    <NuxtLink :to="localePath('/')">{{ $t('menu.home') }}</NuxtLink>
    <NuxtLink :to="localePath('/news')">{{ $t('menu.news') }}</NuxtLink>
    <NuxtLink :to="localePath('/ticket')">{{ $t('nav.ticket') }}</NuxtLink>
    <!-- <NuxtLink :to="localePath('/about')">{{ $t('nav.about') }}</NuxtLink>
    <NuxtLink :to="localePath('/schedule')">{{ $t('nav.schedule') }}</NuxtLink> -->
    
    <ul class="menu">
      <li class="menu-group" :class="{ open: openSubmenu === 'apply' }">
        <span @click="toggleSubmenu('apply')">{{ $t('menu.apply') }}</span>
        <ul class="submenu">
          <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSc-oA7Cbqis71Azd_7ZF2i6e7OqMr9h5pXCwP8D7IZFfIiCFg/viewform" target="_blank">{{ $t('apply.volunteer') }}</a></li>
          <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSe_AH-DG67VmJxCAm8Dt07m8IosoE765XZKukSn5AIWN-HIvQ/viewform" target="_blank">{{ $t('apply.vendor') }}</a></li>
          <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSf1h5OaWHYf2cdqkEwWk_SWcNioLj89ilOAtr1g1sbupTPk1w/viewform" target="_blank">{{ $t('apply.event') }}</a></li>
        </ul>
      </li>
    </ul>
    <!-- <span class="nav-coming-soon">{{ $t('nav.schedule') }}</span>
    <span class="nav-coming-soon">{{ $t('nav.about') }}</span> -->
    <span class="nav-coming-soon">{{ $t('menu.location') }}</span>

    <div class="lang-switcher">
      <NuxtLink
        v-for="item in (locales as any)"
        :key="item.code"
        :to="switchLocalePath(item.code)"
        :class="{ active: locale === item.code }"
      >
        {{ item.name }}
      </NuxtLink>
    </div>
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
  gap: clamp(.5em, 1.6vw, 1.5em);

  min-height: clamp(2.4em, 3.2vw, 3.6em);
  padding: .15em clamp(1em, 2.5vw, 2em);

  background: rgba(95, 45, 100, .72);
  border: 1px solid rgba(255, 230, 167, .18);
  border-top: 0;
  border-radius: 0 0 .8em .8em;

  backdrop-filter: blur(.6em);
  -webkit-backdrop-filter: blur(.6em);

  box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
}

.nav-coming-soon {
  color: rgba(255,255,255,.45);

  font-size: clamp(.86em, 1.35vw, 1.02em);

  text-shadow: none;

  cursor: default;
  user-select: none;

  white-space: nowrap;
}

.nav-coming-soon:hover {
  color: rgba(255,255,255,.45);
}

.top-nav a,
.top-nav .menu-group > span {
  position: relative;

  color: #fff;
  font-size: clamp(.86em, 1.35vw, 1.02em);
  text-decoration: none;
  text-shadow: 0 2px 5px rgba(0, 0, 0, .65);

  white-space: nowrap;
}

.top-nav a::after,
.top-nav .menu-group > span::after {
  content: '';

  position: absolute;
  left: 50%;
  bottom: -4px;

  width: 0;
  height: 2px;

  background: #ffe6a7;

  transition:
    width .25s ease,
    left .25s ease;
}

.top-nav > a:hover::after,
.top-nav .menu-group > span:hover::after,
.top-nav .menu-group.open > span::after,
.top-nav > a.router-link-active::after,
.top-nav > a.router-link-exact-active::after {
  left: 0;
  width: 100%;
}

.top-nav a:hover,
.top-nav .menu-group > span:hover,
.top-nav .menu-group.open > span,
.top-nav > a.router-link-active,
.top-nav > a.router-link-exact-active {
  color: #ffe6a7;

  text-shadow:
    0 0 6px rgba(255, 230, 167, .75),
    0 0 14px rgba(255, 180, 220, .45);
}

.top-nav .menu {
  display: flex;
  align-items: center;
  gap: clamp(.5em, 2vw, 2em);

  margin: 0;
  padding: 0;

  list-style: none;
}

.top-nav .menu-group {
  position: relative;
}

.top-nav .menu-group > span {
  cursor: pointer;
}

.top-nav .submenu {
  position: absolute;
  top: 100%;
  left: -1em;

  min-width: 8em;

  margin-top: .5em;
  padding: .5em 0;

  list-style: none;

  background: rgba(95, 45, 100, .88);
  border: 1px solid rgba(255, 230, 167, .14);
  border-radius: .6em;

  backdrop-filter: blur(.6em);
  -webkit-backdrop-filter: blur(.6em);

  box-shadow: 0 8px 20px rgba(0, 0, 0, .35);

  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;

  transition: all .25s ease;
}

.top-nav .submenu li a {
  display: block;
  padding: .6em 1em;
  font-size: .95em;
}

.top-nav .menu-group:hover .submenu,
.top-nav .menu-group.open .submenu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.lang-switcher {
  display: flex;
  gap: .45em;

  padding-left: .25em;
}

.lang-switcher a {
  padding: .2em .55em;

  border-radius: 999px;

  opacity: .65;
}

.lang-switcher a.active {
  color: #ffe6a7;
  background: rgba(255, 255, 255, .1);

  opacity: 1;
  pointer-events: none;
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

    background: rgba(95, 45, 100, .78);
    border: 1px solid rgba(255, 230, 167, .22);
    border-radius: 999px;

    box-shadow: 0 8px 22px rgba(0, 0, 0, .3);
  }

  .nav-toggle span {
    display: block;

    width: 22px;
    height: 2px;

    background: #fff;
    border-radius: 999px;

    transition: .25s ease;
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

    padding: .9rem;

    flex-direction: column;
    align-items: stretch;
    gap: .25rem;

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
  .top-nav .menu-group > span,
  .nav-coming-soon {
    display: block;

    padding: .55rem .7rem;

    font-size: 1rem;
  }

  .top-nav a::after,
  .top-nav .menu-group > span::after {
    display: none;
  }

  .top-nav .menu {
    display: block;
  }

  .top-nav .submenu {
    position: static;

    margin: .1rem 0 .3rem .75rem;

    display: none;

    opacity: 1;
    transform: none;
    pointer-events: auto;

    background: rgba(255, 255, 255, .06);

    box-shadow: none;
  }

  .top-nav .menu-group.open .submenu {
    display: block;
  }

  .lang-switcher {
    padding: .4rem .7rem 0;
  }
}
</style>
