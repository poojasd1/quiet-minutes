
import React from 'react';
import { UserProfile } from '../types';
import { User, LogOut, Target, Activity } from 'lucide-react';
import { getT } from '../constants/translations';

interface Props {
  profile: UserProfile;
  onLogout: () => void;
}

export const ProfileView: React.FC<Props> = ({ profile, onLogout }) => {
  const t = getT(profile.language);
  
  return (
    <div className="max-w-md mx-auto p-6 space-y-6 pb-24 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-teal-100 text-primary rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
            <User size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
        <div className="inline-block bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600 mt-2">
            {profile.persona}
        </div>
        <div className="mt-2 text-xs text-slate-400 uppercase font-bold">
           {profile.language === 'hi' ? 'Hindi' : 'English'}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Target size={18} className="text-secondary" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">{t.current_focus}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
            {profile.goals.map((goal, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm border border-slate-200">
                    {goal}
                </span>
            ))}
        </div>
      </div>

       <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Activity size={18} className="text-primary" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">{t.stats}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div className="text-center p-3 bg-slate-50 rounded-xl">
                 <div className="text-2xl font-bold text-slate-800">{profile.history.length}</div>
                 <div className="text-xs text-slate-500 uppercase tracking-wide">{t.steps}</div>
             </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                 <div className="text-2xl font-bold text-slate-800">
                    {profile.history.filter(h => h.feedback?.enjoyment === 'liked').length}
                 </div>
                 <div className="text-xs text-slate-500 uppercase tracking-wide">{t.liked}</div>
             </div>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 p-4 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium"
      >
        <LogOut size={18} />
        {t.reset_profile}
      </button>
    </div>
  );
};
