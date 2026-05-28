// Магазин боксов Стадии 1: покупка закрытых боксов за внутренний баланс.

export default function BoxShop({ prices, sealedBoxes, balance, busy, onBuy }) {
  const cb = sealedBoxes?.character_boxes ?? 0;
  const bb = sealedBoxes?.building_boxes ?? 0;
  const charPrice = prices?.character ?? 4;
  const bldPrice = prices?.building ?? 8;

  return (
    <>
      <div className="box-card">
        <div className="box-icon">⚔️</div>
        <div className="box-title">Бокс персонажей</div>
        <div className="box-desc">Закрытый бокс. Откроется после запуска игры.</div>
        <div className="box-meta">
          <span>Цена: <span className="ton">{charPrice} TON</span></span>
          <span className="owned">в инвентаре: {cb}</span>
        </div>
        <button className="buy" disabled={busy || balance < charPrice}
          onClick={() => onBuy('character')}>
          {balance < charPrice ? 'Недостаточно баланса' : 'Купить бокс'}
        </button>
      </div>

      <div className="box-card">
        <div className="box-icon">🏰</div>
        <div className="box-title">Бокс зданий</div>
        <div className="box-desc">Закрытый бокс. Откроется после запуска игры.</div>
        <div className="box-meta">
          <span>Цена: <span className="ton">{bldPrice} TON</span></span>
          <span className="owned">в инвентаре: {bb}</span>
        </div>
        <button className="buy" disabled={busy || balance < bldPrice}
          onClick={() => onBuy('building')}>
          {balance < bldPrice ? 'Недостаточно баланса' : 'Купить бокс'}
        </button>
      </div>
    </>
  );
}
