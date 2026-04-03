import { type Ref, onMounted, onUnmounted } from 'vue'

export const useParallax = (bgEl: Ref<HTMLElement | null>, bg2El: Ref<HTMLElement | null>) => {
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset

    if (bgEl.value) {
      const isMobile = window.innerWidth < 800
      const speed = isMobile ? 1.25 : 0.55
      // Original offset: -250 means translateY(+250px) at scroll=0
      // This positions the scaled background so the sky/mountain area is visible
      const startOffset = -250
      bgEl.value.style.transform = `translateY(${-(y * speed + startOffset)}px) scale(1.75)`
    }

    if (bg2El.value) {
      const isMobile = window.innerWidth < 800
      const speed2 = isMobile ? 1.5 : 0.8
      // Original offset: -300 (mobile) or -500 (desktop)
      // Positions the foreground layer correctly relative to the background
      const startOffset2 = isMobile ? -300 : -500
      bg2El.value.style.transform = `translateY(${-(y * speed2 + startOffset2)}px) scaleY(2.25) scaleX(1.25)`
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // Initial trigger
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return {
    onScroll
  }
}
