import React from 'react';
import * as Icon from 'lucide-react';

// Mobil alt navigasyon çubuğu (MediDepo tasarımı).
// 5 öğe: Ana Sayfa · İlaçlarım · Tarama (yükseltilmiş orta buton) · Aile · Ayarlar
// - Dokunma hedefleri ≥ 44px (min-h-[56px])
// - aria-current ile aktif sekme; safe-area alt boşluğu
// - md ve üzeri ekranlarda gizli (masaüstünde Header sekmeleri kullanılır)

const NavButton = ({ label, icon, active, onClick, badge = 0 }) => (
  <button
    onClick={onClick}
    aria-label={badge > 0 ? `${label} (${badge} okunmamış)` : label}
    aria-current={active ? 'page' : undefined}
    className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[56px] rounded-xl transition-colors ${
      active
        ? 'text-[var(--brand-600)]'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
    }`}
  >
    <span className="relative">
      {icon}
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[var(--brand-accent)] text-white text-[9.5px] font-bold grid place-items-center tabular-nums">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </span>
    <span className={`text-[10.5px] ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
    {active && <span aria-hidden="true" className="absolute top-1 w-1 h-1 rounded-full bg-[var(--brand-600)]"></span>}
  </button>
);

export const BottomNav = ({ tab, onNavigate, onScan, onShowFamily, onShowSettings, familyBadge = 0 }) => (
  <nav
    aria-label="Ana gezinme"
    className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(5,42,34,0.06)]"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    <div className="max-w-lg mx-auto flex items-stretch px-2 py-1">
      <NavButton
        label="Ana Sayfa"
        icon={<Icon.Home size={21}/>}
        active={tab === 'anasayfa'}
        onClick={() => onNavigate('anasayfa')}
      />
      <NavButton
        label="İlaçlarım"
        icon={<Icon.Pill size={21}/>}
        active={tab === 'ilaclar'}
        onClick={() => onNavigate('ilaclar')}
      />
      {/* Yükseltilmiş orta Tarama butonu */}
      <div className="flex-1 flex items-center justify-center min-h-[56px]">
        <button
          onClick={onScan}
          aria-label="Barkod veya karekod tara"
          className="w-14 h-14 -mt-6 rounded-full bg-[var(--brand-600)] text-white grid place-items-center shadow-float ring-4 ring-[var(--surface-alt)] active:scale-95 transition-transform"
        >
          <Icon.ScanLine size={24}/>
        </button>
      </div>
      <NavButton
        label="Aile"
        icon={<Icon.Users size={21}/>}
        active={false}
        onClick={onShowFamily}
        badge={familyBadge}
      />
      <NavButton
        label="Ayarlar"
        icon={<Icon.Settings size={21}/>}
        active={false}
        onClick={onShowSettings}
      />
    </div>
  </nav>
);

export default BottomNav;
