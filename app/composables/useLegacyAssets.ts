import { onMounted, onBeforeUnmount } from 'vue'

type LegacyAssetsOptions = {
  styles?: string[]
  scripts?: string[]
  externalScripts?: string[]
}

const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
  const script = document.createElement('script')
  script.src = src.includes('?') ? `${src}&t=${Date.now()}` : `${src}?t=${Date.now()}`
  script.async = false
  script.dataset.legacyPageScript = 'true'
  script.onload = () => resolve()
  script.onerror = () => reject(new Error(`Failed to load legacy script: ${src}`))
  document.body.appendChild(script)
})

export const useLegacyAssets = (options: LegacyAssetsOptions) => {
  useHead({
    link: (options.styles || []).map(href => ({ rel: 'stylesheet', href }))
  })

  onMounted(async () => {
    try {
      for (const src of options.externalScripts || []) {
        await loadScript(src)
      }
      for (const src of options.scripts || []) {
        await loadScript(src)
      }

      document.dispatchEvent(new Event('DOMContentLoaded'))
      window.dispatchEvent(new Event('resize'))
    } catch (error) {
      console.error(error)
    }
  })

  onBeforeUnmount(() => {
    document.body.style.overflow = ''
    document.querySelectorAll('script[data-legacy-page-script="true"]').forEach(el => el.remove())
  })
}
