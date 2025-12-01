
import React, { useState } from 'react';
import { EnergyLevel, Language } from '../types';
import { Battery, BatteryCharging, BatteryFull, Clock, Sparkles } from 'lucide-react';
import { getT } from '../constants/translations';

interface Props {
  userName: string;
  language: Language;
  onCheckIn: (minutes: number, energy: EnergyLevel) => void;
}

export const CheckIn: React.FC<Props> = ({ userName, language, onCheckIn }) => {
  const [minutes, setMinutes] = useState(15);
  const [energy, setEnergy] = useState<EnergyLevel>(EnergyLevel.MEDIUM);
  const t = getT(language);

  const energyOptions = [
    { value: EnergyLevel.LOW, label: t.low, icon: Battery, desc: t.low_desc },
    { value: EnergyLevel.MEDIUM, label: t.medium, icon: BatteryCharging, desc: t.med_desc },
    { value: EnergyLevel.HIGH, label: t.high, icon: BatteryFull, desc: t.high_desc },
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-1">{t.hi}, {userName}</h2>
      <p className="text-slate-500 mb-8 text-sm">{t.intro_sub}</p>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          {t.time_question}
        </label>
        
        <div className="relative pt-6 pb-2">
           <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-slate-400 px-1">
            <span>5m</span>
            <span>30m</span>
            <span>60m</span>
          </div>
          <div className="mt-4 text-center">
            <span className="text-3xl font-bold text-primary">{minutes}</span>
            <span className="text-slate-500 ml-1">{t.minutes}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
           <Sparkles size={16} className="text-secondary" />
           {t.energy_question}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {energyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setEnergy(opt.value)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                energy === opt.value
                  ? 'border-secondary bg-amber-50 text-amber-900 ring-1 ring-secondary'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <opt.icon size={24} className={`mb-2 ${energy === opt.value ? 'text-secondary' : 'text-slate-400'}`} />
              <span className="font-medium text-sm">{opt.label}</span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-3 h-4">
          {energyOptions.find(o => o.value === energy)?.desc}
        </p>
      </div>

      <button
        onClick={() => onCheckIn(minutes, energy)}
        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl transition-all active:scale-[0.98]"
      >
        {t.find_activity}
      </button>
    </div>
  );
};
