
import React from 'react';
import { Activity, ActivityCategory, Language } from '../types';
import { Brain, Dumbbell, Feather, Heart, Briefcase, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { getT } from '../constants/translations';

interface Props {
  activities: Activity[];
  onSelect: (activity: Activity) => void;
  onBack: () => void;
  language: Language;
}

const getCategoryIcon = (cat: ActivityCategory) => {
  switch (cat) {
    case ActivityCategory.BRAIN: return <Brain size={18} className="text-blue-500" />;
    case ActivityCategory.BODY: return <Dumbbell size={18} className="text-orange-500" />;
    case ActivityCategory.CREATIVE: return <Feather size={18} className="text-purple-500" />;
    case ActivityCategory.REFLECTION: return <Heart size={18} className="text-red-500" />;
    case ActivityCategory.SKILLS: return <Briefcase size={18} className="text-green-500" />;
    default: return <Brain size={18} />;
  }
};

export const Selection: React.FC<Props> = ({ activities, onSelect, onBack, language }) => {
  const t = getT(language);

  if (activities.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-500 mb-4">No activities found. Please try again.</p>
        <button onClick={onBack} className="text-primary font-medium">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-800">{t.your_picks}</h2>
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600">{t.change_context}</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            onClick={() => onSelect(activity)}
            className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
          >
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-bl-xl">
                {t.top_pick}
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                {getCategoryIcon(activity.category)}
                {/* We display the raw category name as it comes from enum, or could translate if mapped */}
                {activity.category}
              </div>
              {activity.sourceUrl && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  <ExternalLink size={10} />
                  {t.verified}
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-primary transition-colors">
              {activity.title}
            </h3>
            
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
              {activity.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
               <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                 <Clock size={12} />
                 {activity.durationMinutes} min
               </div>
               <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                 {t.start} <ChevronRight size={16} />
               </span>
            </div>
            
            {/* Rationale pill */}
            <div className="mt-3 text-xs text-slate-400 italic border-t border-slate-50 pt-2">
               "{activity.rationale}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
