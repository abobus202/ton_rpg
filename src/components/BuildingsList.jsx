// Список зданий игрока с уровнем и прочностью.

const BUILDING_ICON = {
  guild: '⚖️', infirmary: '⛑️', sawmill: '🪵',
  mine: '⛰️', forge: '🔥', portal: '🌀',
};

export default function BuildingsList({ buildings, onRefresh }) {
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">Здания</span>
        <button className="refresh-btn" onClick={onRefresh}>Обновить</button>
      </div>
      {(!buildings || buildings.length === 0) ? (
        <div className="empty">Пока нет зданий. Открой бокс зданий!</div>
      ) : (
        buildings.map((b) => {
          const durPct = b.max_durability ? (b.durability / b.max_durability) * 100 : 0;
          return (
            <div className="card-item" key={b.id}>
              <span className="ic">{BUILDING_ICON[b.building_type] || '🏚️'}</span>
              <div className="info">
                <div className="nm">{b.name} <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 12 }}>ур.{b.level}</span></div>
                <div className="meta">прочность {b.durability}/{b.max_durability}</div>
                <div className="bar dur"><span style={{ width: `${durPct}%` }} /></div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
