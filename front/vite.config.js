import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/upload': {
        target: 'http://localhost:5137',
        changeOrigin: true,
      },
    },
  },
})