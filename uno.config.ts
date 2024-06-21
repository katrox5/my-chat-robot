import { defineConfig } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['app.vue', './components/*.vue'],
  },
})
