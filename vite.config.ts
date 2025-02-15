import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'http://api.example.com'
          : 'http://192.168.1.101:8080',
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src', 'pages'),
      '@services': path.resolve(__dirname, 'src', 'services'),
      '@components': path.resolve(__dirname, 'src', 'components'),
      '@hooks': path.resolve(__dirname, 'src', 'hooks'),
    },
  },
})
