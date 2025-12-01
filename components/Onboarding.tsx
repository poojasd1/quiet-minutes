
import React, { useState } from 'react';
import { UserProfile, PersonaType, Language } from '../types';
import { User, Target, ArrowRight, Languages, PlayCircle } from 'lucide-react';
import { getT } from '../constants/translations';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onDemo?: () => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete, onDemo }) => {
  const [step, setStep] = useState(0); // Start at 0 for Language Selection
  const [language, setLanguage] = useState<Language>('en');
  const [name, setName] = useState('');
  const [persona, setPersona] = useState<PersonaType>(PersonaType.PROFESSIONAL);
  const [goals, setGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');

  const t = getT(language);

  const commonGoals = [
    "Reduce stress",
    "Improve mobility",
    "Learn new concepts",
    "Boost creativity",
    "Professional development",
    "Better focus"
  ];

  const handleGoalToggle = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const finish = () => {
    const finalGoals = customGoal ? [...goals, customGoal] : goals;
    onComplete({
      name,
      persona,
      goals: finalGoals,
      history: [],
      language
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.welcome}</h1>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {step === 0 && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-slate-700 mb-4">{t.select_language}</label>
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setLanguage('en')}
              className={`w-full p-4 text-left rounded-xl border transition-all ${
                language === 'en' 
                  ? 'border-primary bg-teal-50 text-primary ring-1 ring-primary' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className="font-medium">{t.english}</span>
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`w-full p-4 text-left rounded-xl border transition-all ${
                language === 'hi' 
                  ? 'border-primary bg-teal-50 text-primary ring-1 ring-primary' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className="font-medium">{t.hindi}</span>
            </button>
          </div>
          <button
            onClick={() => setStep(1)}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
          >
            {t.next} <ArrowRight size={18} />
          </button>
          
          {onDemo && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
               <button 
                onClick={onDemo}
                className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
               >
                 <PlayCircle size={16} />
                 {t.demo_mode}
               </button>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.what_name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-6"
            placeholder={t.your_name}
            autoFocus
          />
          <button
            disabled={!name.trim()}
            onClick={() => setStep(2)}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-teal-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {t.next} <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-slate-700 mb-4">{t.describe_you}</label>
          <div className="space-y-3 mb-6">
            {Object.values(PersonaType).map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`w-full p-4 text-left rounded-xl border transition-all ${
                  persona === p 
                    ? 'border-primary bg-teal-50 text-primary ring-1 ring-primary' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={20} className={persona === p ? 'text-primary' : 'text-slate-400'} />
                  <span className="font-medium">{p}</span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-teal-800 transition-colors"
          >
            {t.next}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-slate-700 mb-4">{t.priorities}</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {commonGoals.map((g) => (
              <button
                key={g}
                onClick={() => handleGoalToggle(g)}
                className={`p-3 text-sm rounded-lg border transition-all text-left ${
                  goals.includes(g)
                    ? 'border-primary bg-teal-50 text-primary font-medium'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder={t.anything_else}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm mb-6 focus:ring-1 focus:ring-primary outline-none"
          />
          <button
            onClick={finish}
            disabled={goals.length === 0 && !customGoal}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-teal-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {t.start_concierge} <Target size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
