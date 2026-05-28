import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { CONTRACT_ADDRESS } from '../config.js';
import { toNanoStr } from '../lib/ton.js';

const MIN_TON = 1;
const MAX_TON = 1000;

// Панель: баланс игрока + ввод произвольной целой суммы + быстрые кнопки.
export default function BalancePanel({ balance, walletLinked, onDeposited }) {
  const [tonConnectUI] = useTonConnectUI();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [amountStr, setAmountStr] = useState('');

  // Принимаем только цифры. Точку/запятую/минус не пускаем вообще.
  function onInput(e) {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    // убираем ведущие нули ("007" -> "7"), но пустую строку оставляем
    const normalized = digitsOnly.replace(/^0+(?=\d)/, '');
    setAmountStr(normalized);
  }

  const amount = parseInt(amountStr, 10);
  const amountValid = Number.isInteger(amount) && amount >= MIN_TON && amount <= MAX_TON;

  let inputHint = '';
  if (amountStr !== '') {
    if (!amountValid && amount > MAX_TON) inputHint = `Максимум ${MAX_TON} TON`;
    else if (!amountValid) inputHint = `Минимум ${MIN_TON} TON`;
  }

  async function deposit(amt) {
    try {
      setBusy(true);
      setMsg('Подтверди пополнение в кошельке...');
      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: CONTRACT_ADDRESS,
          amount: toNanoStr(amt),
        }],
      };
      await tonConnectUI.sendTransaction(tx);
      setMsg('Пополнение отправлено! Баланс обновится через несколько секунд.');
      setAmountStr('');
      setTimeout(() => { onDeposited?.(); setMsg(''); }, 8000);
    } catch (e) {
      console.error(e);
      setMsg('Пополнение отменено.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="balance-panel">
      <div className="balance-row">
        <span className="balance-label">Баланс</span>
        <span className="balance-value">{Number(balance || 0).toFixed(2)} TON</span>
      </div>

      {!walletLinked ? (
        <div className="balance-hint">
          Подключи кошелёк выше, чтобы пополнять баланс.
        </div>
      ) : (
        <>
          <div className="deposit-input-row">
            <input
              className="deposit-input"
              type="text"
              inputMode="numeric"
              placeholder="Сумма в TON"
              value={amountStr}
              onChange={onInput}
              disabled={busy}
            />
            <button
              className="deposit-confirm"
              disabled={busy || !amountValid}
              onClick={() => deposit(amount)}
            >
              Пополнить
            </button>
          </div>
          {inputHint && <div className="input-hint">{inputHint}</div>}

          <div className="deposit-buttons">
            {[5, 10, 20, 50].map((amt) => (
              <button key={amt} className="deposit-btn" disabled={busy}
                onClick={() => deposit(amt)}>
                +{amt}
              </button>
            ))}
          </div>

          {msg && <div className="balance-msg">{msg}</div>}
        </>
      )}
    </div>
  );
}
