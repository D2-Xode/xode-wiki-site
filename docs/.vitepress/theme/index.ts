import DefaultTheme from 'vitepress/theme'
import { useRoute, type Theme } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import mediumZoom from 'medium-zoom'
import HeartbeatProof from './components/HeartbeatProof.vue'
import ParachainMigration from './components/ParachainMigration.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeartbeatProof', HeartbeatProof)
    app.component('ParachainMigration', ParachainMigration)
  },
  setup() {
    // Click any image in a page to view it enlarged (app icons excepted). Re-attached after
    // each navigation, since VitePress swaps the page content without a full reload.
    const route = useRoute()
    const images = '.vp-doc img:not(.app-icon)'
    onMounted(() => {
      const zoom = mediumZoom(images, { background: 'var(--vp-c-bg)', margin: 24 })
      watch(
        () => route.path,
        () => nextTick(() => zoom.detach().attach(images)),
      )
    })
  },
} satisfies Theme
