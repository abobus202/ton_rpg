import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base ДОЛЖЕН совпадать с именем репозитория на GitHub Pages,
// иначе после деплоя будет белый экран (ссылки на скрипты сломаются).
export default defineConfig({
  plugins: [react()],
  base: '/ton_rpg/',
});
