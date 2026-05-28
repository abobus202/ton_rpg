import { useState, useEffect, useCallback } from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useTelegram } from './lib/useTelegram.js';
import { useWalletProof } from './lib/useWalletProof.js';
import { api } from './lib/api.js';
import BalancePanel from './components/BalancePanel.jsx';
import BoxShop from './components/BoxShop.jsx';
import ResourceBar from './components/ResourceBar.jsx';
import WorkersList from './components/WorkersList.jsx';
import BuildingsList from './components/BuildingsList.jsx';

export default function App() {
  const { user, initData } = useTelegram();
  const wallet = useTonWallet();

  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: '', kind: '' });

  const loadState = useCallback(async () => {
    if (!api.isConfigured() || !initData) {
      setState((s) => s || { _noapi: !api.isConfigured() });
      return;
    }
    try {
      setState(await api.getState(initData));
    } catch (e) {
      console.error(e);
    }
  }, [initData]);

  useEffect(() => { loadState(); }, [loadState]);

  // Привязка кошелька через ton_proof; после привязки — перезагрузка состояния.
  useWalletProof(initData, loadState);

  async function buyBox(boxKind) {
    try {
      setBusy(true);
      setMsg({ text: '', kind: '' });
      const res = await api.buyBox(initData, boxKind);
      setState((s) => ({ ...s, balance: res.balance, sealedBoxes: res.sealedBoxes }));
      setMsg({ text: 'Бокс куплен и добавлен в инвентарь!', kind: 'ok' });
    } catch (e) {
      setMsg({ text: e.message || 'Не удалось купить бокс.', kind: 'err' });
    } finally {
      setBusy(false);
    }
  }

  async function openBox(boxKind) {
    try {
      setBusy(true);
      const res = await api.openBox(initData, boxKind);
      const r = res.reward;
      setMsg({ text: `Открыто: ${r.name}!`, kind: 'ok' });
      await loadState();
    } catch (e) {
      setMsg({ text: e.message || 'Не удалось открыть бокс.', kind: 'err' });
    } finally {
      setBusy(false);
    }
  }

  const stage = state?.stage ?? 1;
  const walletLinked = !!state?.wallet;

  return (
    <>
      <div className="crest">⚜️</div>
      <h1 className="title">TON Underworld</h1>
      <div className="subtitle">
        {stage === 1 ? 'Предзапуск — собери боксы к старту' : 'Собери армию. Построй королевство.'}
      </div>

      <div className="wallet-row"><TonConnectButton /></div>
      <div className="greeting">{user ? `Приветствую, ${user.first_name}!` : ''}</div>

      {state?._noapi && (
        <div className="status err">API не настроен (config.js → API_BASE).</div>
      )}

      {stage === 1 ? (
        <>
          <BalancePanel
            balance={state?.balance}
            walletLinked={walletLinked}
            onDeposited={loadState}
          />
          <BoxShop
            prices={state?.prices}
            sealedBoxes={state?.sealedBoxes}
            balance={state?.balance ?? 0}
            busy={busy}
            onBuy={buyBox}
          />
          {msg.text && <div className={`status ${msg.kind}`}>{msg.text}</div>}
          <div className="hint">
            Боксы закрыты и откроются после запуска игры.<br />
            Пополняй баланс заранее — на старте успеешь больше.
          </div>
        </>
      ) : (
        <>
          <ResourceBar resources={state?.resources} />
          <div className="section">
            <div className="section-title" style={{ marginBottom: 12 }}>Закрытые боксы</div>
            <div className="open-row">
              <button className="buy" disabled={busy || (state?.sealedBoxes?.character_boxes ?? 0) < 1}
                onClick={() => openBox('character')}>
                Открыть персонажа ({state?.sealedBoxes?.character_boxes ?? 0})
              </button>
              <button className="buy" disabled={busy || (state?.sealedBoxes?.building_boxes ?? 0) < 1}
                onClick={() => openBox('building')}>
                Открыть здание ({state?.sealedBoxes?.building_boxes ?? 0})
              </button>
            </div>
          </div>
          {msg.text && <div className={`status ${msg.kind}`}>{msg.text}</div>}
          <WorkersList workers={state?.workers} onRefresh={loadState} />
          <BuildingsList buildings={state?.buildings} onRefresh={loadState} />
        </>
      )}
    </>
  );
}
