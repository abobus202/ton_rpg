// Клиент к бэкенду. Все запросы идут с Telegram initData для авторизации.

import { API_BASE } from '../config.js';

function isConfigured() {
  return API_BASE && !API_BASE.startsWith('PASTE_');
}

async function post(path, body) {
  if (!isConfigured()) throw new Error('API_BASE не настроен');
  const resp = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `Ошибка ${resp.status}`);
  }
  return resp.json();
}

export const api = {
  isConfigured,
  getProofPayload: (initData) => post('/proof-payload', { initData }),
  linkWallet: (initData, address, network, proof, stateInit) =>
    post('/link-wallet', { initData, address, network, proof, stateInit }),
  getState: (initData) => post('/state', { initData }),
  buyBox: (initData, boxKind) => post('/buy-box', { initData, boxKind }),
  openBox: (initData, boxKind) => post('/open-box', { initData, boxKind }),
};
