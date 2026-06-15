'use client';

export type ViewKey = 'exterior' | 'interior' | 'planos';

const TABS: { key: ViewKey; label: string }[] = [
  { key: 'exterior', label: 'Exterior' },
  { key: 'interior', label: 'Interior' },
  { key: 'planos', label: 'Planos' },
];

export function ViewTabs({ active, onChange }: { active: ViewKey; onChange: (k: ViewKey) => void }) {
  return (
    <nav className="tabs">
      <span className="tabs-brand">Terreno 3D · Sauce</span>
      <div className="tabs-list">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab${active === t.key ? ' active' : ''}`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <span className="tabs-owner">Javier Rodríguez</span>
    </nav>
  );
}
