
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Minus, Check } from 'lucide-react';
import { generateEncouragement } from '../services/geminiService';
import { UserProfile, Activity } from '../types';
import { getT } from '../constants/translations';

interface Props {
  activity: Activity;
  profile: UserProfile;
  onSubmit: (difficulty: 'too_easy' | 'just_right' | 'too_hard', enjoyment: 'disliked' | 'neutral' | 'liked') => void;
}

export const Feedback: React.FC<Props> = ({ activity, profile, onSubmit }) => {
  const [difficulty, setDifficulty] = useState<'too_easy' | 'just_right' | 'too_hard' | null>(null);
  const [enjoyment, setEnjoyment] = useState<'disliked' | 'neutral' | 'liked' | null>(null);
  const [encouragement, setEncouragement] = useState('');
  const t = getT(profile.language);

  useEffect(() => {
    generateEncouragement(profile, activity).then(setEncouragement);
  }, [profile, activity]);

  const handleSubmit = () => {
    if (difficulty && enjoyment) {
      onSubmit(difficulty, enjoyment);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center animate-fade-in space-y-8 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[50vh] flex flex-col justify-center">
      <div>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 text-primary rounded-full mb-4">
          <Check size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.activity_complete}</h2>
        <p className="text-slate-600 italic">"{encouragement}"</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-3">{t.challenge_level}</label>
          <div className="flex justify-center gap-2">
            {[
              { val: 'too_easy', label: t.too_easy },
              { val: 'just_right', label: t.just_right },
              { val: 'too_hard', label: t.too_hard }
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setDifficulty(opt.val as any)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                  difficulty === opt.val
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 mb-3">{t.did_you_enjoy}</label>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setEnjoyment('disliked')}
              className={`p-3 rounded-full border transition-all ${
                enjoyment === 'disliked' ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400'
              }`}
            >
              <ThumbsDown size={20} />
            </button>
            <button
              onClick={() => setEnjoyment('neutral')}
              className={`p-3 rounded-full border transition-all ${
                enjoyment === 'neutral' ? 'bg-slate-100 border-slate-300 text-slate-600' : 'border-slate-200 text-slate-400'
              }`}
            >
              <Minus size={20} />
            </button>
            <button
              onClick={() => setEnjoyment('liked')}
              className={`p-3 rounded-full border transition-all ${
                enjoyment === 'liked' ? 'bg-green-50 border-green-200 text-green-500' : 'border-slate-200 text-slate-400'
              }`}
            >
              <ThumbsUp size={20} />
            </button>
          </div>
        </div>
      </div>

      <button
        disabled={!difficulty || !enjoyment}
        onClick={handleSubmit}
        className="w-full bg-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 hover:bg-teal-700 transition-colors"
      >
        {t.save_continue}
      </button>
    </div>
  );
};
