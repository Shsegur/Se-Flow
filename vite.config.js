import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const firebaseConfig = {
  apiKey: 'AIzaSyBSqVB4FujSu0jU80z7j1DxqiMdQq3P3K4',
  authDomain: 'se-flow.firebaseapp.com',
  projectId: 'se-flow',
  storageBucket: 'se-flow.firebasestorage.app',
  messagingSenderId: '315206840375',
  appId: '1:315206840375:web:3797c3ab9e4583e83bcfb2'
};

export default defineConfig({
  base: '/Se-Flow/',
  plugins: [react(), tailwindcss()],
  define: {
    __firebase_config: JSON.stringify(JSON.stringify(firebaseConfig)),
    __app_id: JSON.stringify('se-flow'),
    __initial_auth_token: JSON.stringify('')
  }
});
