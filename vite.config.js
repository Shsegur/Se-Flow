import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __firebase_config: JSON.stringify('{"apiKey":"","authDomain":"","projectId":"","storageBucket":"","messagingSenderId":"","appId":""}'),
    __app_id: JSON.stringify('se-flow'),
    __initial_auth_token: JSON.stringify('')
  }
});
