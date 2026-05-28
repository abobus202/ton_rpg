import { useEffect, useRef } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { api } from './api.js';

// Настраивает запрос ton_proof при подключении кошелька и,
// когда кошелёк подключён с proof, отправляет его на бэкенд для привязки.
//
// initData — Telegram initData (нужен бэкенду для авторизации).
// onLinked  — колбэк после успешной привязки (например, перезагрузить состояние).
export function useWalletProof(initData, onLinked) {
  const [tonConnectUI] = useTonConnectUI();
  const linkedRef = useRef(false);

  // 1. При наличии initData готовим connect-параметры с tonProof payload.
  useEffect(() => {
    if (!initData || !api.isConfigured()) return;

    let cancelled = false;
    async function setup() {
      tonConnectUI.setConnectRequestParameters({ state: 'loading' });
      try {
        const { payload } = await api.getProofPayload(initData);
        if (cancelled) return;
        if (payload) {
          tonConnectUI.setConnectRequestParameters({
            state: 'ready',
            value: { tonProof: payload },
          });
        } else {
          tonConnectUI.setConnectRequestParameters(null);
        }
      } catch (e) {
        console.error('proof payload error', e);
        tonConnectUI.setConnectRequestParameters(null);
      }
    }
    setup();
    return () => { cancelled = true; };
  }, [initData, tonConnectUI]);

  // 2. Когда кошелёк подключён и принёс proof — отправляем на бэкенд.
  useEffect(() => {
    return tonConnectUI.onStatusChange(async (wallet) => {
      if (!wallet) { linkedRef.current = false; return; }
      const tp = wallet.connectItems?.tonProof;
      if (tp && 'proof' in tp && !linkedRef.current) {
        linkedRef.current = true;
        try {
          await api.linkWallet(
            initData,
            wallet.account.address,
            wallet.account.chain,
            tp.proof,
            wallet.account.walletStateInit,
          );
          onLinked?.();
        } catch (e) {
          console.error('link wallet error', e);
          linkedRef.current = false;
        }
      }
    });
  }, [tonConnectUI, initData, onLinked]);
}
