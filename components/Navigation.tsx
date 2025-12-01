
import React from 'react';
import { Home, History, User } from 'lucide-react';
import { ViewState, Language } from '../types';
import { getT } from '../constants/translations';

interface Props {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  language: Language;
}

export const Navigation: React.FC<Props> = ({ currentView, onNavigate, language }) => {
  const t = getT(language);
  const isHomeActive = ['CHECK_IN', 'GENERATING', 'SELECTION', 'ACTIVE_SESSION', 'FEEDBACK'].includes(currentView);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-bottom">
      <button
        onClick={() => onNavigate('CHECK_IN')}
        className={`flex flex-col items-center gap-1 transition-colors ${isHomeActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home size={24} />
        <span className="text-[10px] font-medium">{t.nav_concierge}</span>
      </button>

      <button
        onClick={() => onNavigate('HISTORY')}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'HISTORY' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <History size={24} />
        <span className="text-[10px] font-medium">{t.nav_history}</span>
      </button>

      <button
        onClick={() => onNavigate('PROFILE')}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'PROFILE' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <User size={24} />
        <span className="text-[10px] font-medium">{t.nav_profile}</span>
      </button>
    </div>
  );
};
