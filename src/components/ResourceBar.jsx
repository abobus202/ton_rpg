// Полоса ресурсов сверху.

const RES_META = {
  wood:     { icon: '🪵', name: 'Дерево' },
  stone:    { icon: '🪨', name: 'Камень' },
  ore:      { icon: '⛏️', name: 'Руда' },
  meds:     { icon: '💊', name: 'Медикаменты' },
  gear:     { icon: '⚔️', name: 'Снаряжение' },
  rare_mat: { icon: '💠', name: 'Редкие' },
  amethyst: { icon: '🔮', name: 'Аметист' },
};

export default function ResourceBar({ resources }) {
  if (!resources) return null;
  const order = ['amethyst', 'wood', 'stone', 'ore', 'meds', 'gear', 'rare_mat'];
  return (
    <div className="resource-bar">
      {order.map((id) => (
        <div className="resource-chip" key={id} title={RES_META[id].name}>
          <span className="ic">{RES_META[id].icon}</span>
          <span className="amt">{Math.floor(resources[id] || 0)}</span>
        </div>
      ))}
    </div>
  );
}
