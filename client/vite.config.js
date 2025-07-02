import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://15.207.109.174:3000',
        changeOrigin: true
      }
    }
  },
  plugins: [react(), tailwindcss()]
})
