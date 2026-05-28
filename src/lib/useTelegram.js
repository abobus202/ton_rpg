import { useEffect, useState } from 'react';

// Достаёт Telegram WebApp: разворачивает приложение, отдаёт user и initData.
export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const w = window.Telegram?.WebApp;
    if (w) {
      w.ready();
      w.expand();
      setTg(w);
      setUser(w.initDataUnsafe?.user || null);
    }
  }, []);

  const playerId = user?.id ? 'tg_' + user.id : null;
  const initData = tg?.initData || '';

  return { tg, user, playerId, initData };
}
