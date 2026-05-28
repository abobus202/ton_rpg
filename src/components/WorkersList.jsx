// Список рабочих игрока с hp, возрастом, уровнем.

const WORKER_ICON = {
  monk: '⛪', lumberjack: '🪓', miner: '⛏️',
  smith: '🔨', warrior: '🗡️', slave: '⛓️',
};

export default function WorkersList({ workers, onRefresh }) {
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">Рабочие</span>
        <button className="refresh-btn" onClick={onRefresh}>Обновить</button>
      </div>
      {(!workers || workers.length === 0) ? (
        <div className="empty">Пока нет рабочих. Открой бокс персонажей!</div>
      ) : (
        workers.map((w) => (
          <div className="card-item" key={w.id}>
            <span className="ic">{WORKER_ICON[w.worker_type] || '👤'}</span>
            <div className="info">
              <div className="nm">{w.name} <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 12 }}>ур.{w.level}</span></div>
              <div className="meta">возраст {w.age} · мощь {w.power}</div>
              <div className="bar hp"><span style={{ width: `${w.hp}%` }} /></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
