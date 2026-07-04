<template>
  <div class="site-shell">
    <SharedBackground variant="homepage" />

    <div class="site-content">
      <SiteNav />
      <slot />
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.site-shell {
  position: relative;
  min-height: 100vh;
}

.site-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.site-content :deep(.footer-root) {
  margin-top: auto;
}
</style>
