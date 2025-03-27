import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_',
  server: {
    proxy: {
      '/products': {
        target: 'https://readhaven-p7oc.onrender.com',  // ตั้งค่า URL ของ backend
        changeOrigin: true,  // เปลี่ยน origin ของคำขอให้ตรงกับ target
        secure: false,  // ตั้งเป็น false ถ้าไม่ใช้ HTTPS
      
      },
    },
  },
})
