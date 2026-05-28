// Карточка бокса с кнопкой покупки.

export default function BoxCard({ icon, title, desc, price, disabled, onBuy }) {
  return (
    <div className="box-card">
      <div className="box-icon">{icon}</div>
      <div className="box-title">{title}</div>
      <div className="box-desc">{desc}</div>
      <div className="box-price">Цена: <span className="ton">{price} TON</span></div>
      <button className="buy" disabled={disabled} onClick={onBuy}>Открыть бокс</button>
    </div>
  );
}
