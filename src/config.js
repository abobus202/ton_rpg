// Настройки приложения. Меняй адреса под свои.

// Адрес GameBank-контракта в testnet (формат kQ...).
export const CONTRACT_ADDRESS = 'kQDLLnXptDpO2EVlrFyDvzyvkaEwUd2ONa-4S5Z7102TP9xh';

// Манифест TON Connect (тот же адрес, где он лежит).
export const MANIFEST_URL = 'https://abobus202.github.io/ton_rpg/tonconnect-manifest.json';

// Адрес API-бэкенда (ngrok при разработке, потом — постоянный домен).
// ВАЖНО: замени на свой адрес от ngrok, без слеша в конце.
export const API_BASE = 'PASTE_YOUR_API_URL_HERE';

// Цены боксов (по GDD).
export const BOX_PRICES = {
  'box:characters': 4,
  'box:buildings': 8,
};
