<template>
  <div class="site-shell">
    <SharedBackground variant="homepage" />
    <DevWatermark />

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
  flex-direction: column;
  min-height: 100vh;
}

.site-content > :nth-child(2) {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
