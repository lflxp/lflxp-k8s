import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/shadcn/',
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
      '/tty': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
      '/adminfs': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
      '/adminfs2': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
      '/node_modules': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      }
    }
  }
})
