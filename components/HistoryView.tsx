
import React from 'react';
import { UserProfile } from '../types';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { getT } from '../constants/translations';

interface Props {
  history: UserProfile['history'];
  language: UserProfile['language'];
}

export const HistoryView: React.FC<Props> = ({ history, language }) => {
  const t = getT(language);
  
  if (history.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 p-6 text-center animate-fade-in">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Calendar size={32} className="opacity-50" />
            </div>
            <h3 className="text-slate-600 font-medium mb-1">{t.no_history}</h3>
            <p className="text-sm">{t.history_sub}</p>
        </div>
    );
  }

  // Reverse to show newest first
  const sortedHistory = [...history].reverse();

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-24 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-2 px-2">{t.your_journey}</h2>
      {sortedHistory.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
          <div className="mt-1 text-primary shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h3 className="font-medium text-slate-800 leading-tight mb-1">{item.activityTitle}</h3>
            <p className="text-xs text-slate-500 mb-2">
                {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
            {item.feedback && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-slate-600 capitalize">
                        {item.feedback.difficulty.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 border rounded-full capitalize ${
                        item.feedback.enjoyment === 'liked' ? 'bg-green-50 border-green-100 text-green-700' :
                        item.feedback.enjoyment === 'disliked' ? 'bg-red-50 border-red-100 text-red-700' :
                        'bg-slate-50 border-slate-100 text-slate-600'
                    }`}>
                        {item.feedback.enjoyment}
                    </span>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
