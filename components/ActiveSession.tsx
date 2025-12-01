
import React, { useState, useEffect } from 'react';
import { Activity, Language } from '../types';
import { Play, Pause, CheckCircle2, ArrowLeft, ExternalLink, BrainCircuit, BookOpen } from 'lucide-react';
import { getT } from '../constants/translations';

interface Props {
  activity: Activity;
  onComplete: () => void;
  onAbort: () => void;
  language: Language;
}

export const ActiveSession: React.FC<Props> = ({ activity, onComplete, onAbort, language }) => {
  const [timeLeft, setTimeLeft] = useState(activity.durationMinutes * 60);
  const [isActive, setIsActive] = useState(false); // Start paused
  const [currentStep, setCurrentStep] = useState(0);
  const t = getT(language);

  // Interactive State
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleQuizOption = (option: string) => {
    if (quizSelected) return; // Prevent changing answer
    setQuizSelected(option);
    setShowExplanation(true);
  };

  const progress = ((activity.durationMinutes * 60 - timeLeft) / (activity.durationMinutes * 60)) * 100;

  return (
    <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white z-10">
        <button onClick={onAbort} className="text-slate-400 hover:text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t.in_progress}</div>
        <div className="w-5"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{activity.title}</h1>
        <p className="text-slate-600 mb-6">{activity.description}</p>
        
        {activity.sourceUrl && (
          <a 
            href={activity.sourceUrl} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mb-6 bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            <ExternalLink size={12} />
            {t.view_source}
          </a>
        )}

        {/* --- INTERACTIVE CONTENT: READING --- */}
        {activity.interactive?.type === 'READING' && activity.interactive.content && (
            <div className="mb-8 bg-amber-50 p-5 rounded-xl border border-amber-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-amber-800 font-semibold">
                    <BookOpen size={18} />
                    <span>{t.micro_reading}</span>
                </div>
                <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {activity.interactive.content}
                </div>
            </div>
        )}

        {/* --- INTERACTIVE CONTENT: QUIZ --- */}
        {activity.interactive?.type === 'QUIZ' && activity.interactive.quizData && (
            <div className="mb-8 bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-indigo-800 font-semibold">
                    <BrainCircuit size={18} />
                    <span>{t.challenge_question}</span>
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                    {activity.interactive.quizData.question}
                </h3>
                <div className="space-y-2">
                    {activity.interactive.quizData.options.map((opt, i) => {
                        const isCorrect = opt === activity.interactive?.quizData?.correctAnswer;
                        const isSelected = quizSelected === opt;
                        
                        let btnClass = "border-indigo-200 hover:bg-indigo-100 text-indigo-900";
                        if (quizSelected) {
                             if (isCorrect) btnClass = "bg-green-100 border-green-300 text-green-800 font-medium";
                             else if (isSelected) btnClass = "bg-red-50 border-red-200 text-red-700";
                             else btnClass = "opacity-50 border-slate-200 text-slate-400";
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleQuizOption(opt)}
                                disabled={!!quizSelected}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${btnClass}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{opt}</span>
                                    {quizSelected && isCorrect && <CheckCircle2 size={16} className="text-green-600"/>}
                                </div>
                            </button>
                        );
                    })}
                </div>
                
                {showExplanation && (
                    <div className="mt-4 p-3 bg-white/60 rounded-lg text-sm text-slate-600 animate-fade-in border border-indigo-100">
                        <span className="font-semibold text-indigo-800">{t.insight}: </span>
                        {activity.interactive.quizData.explanation}
                    </div>
                )}
            </div>
        )}

        {/* STANDARD STEPS */}
        {activity.steps && activity.steps.length > 0 && (
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{t.instructions}</h3>
                {activity.steps.map((step, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setCurrentStep(idx)}
                        className={`flex gap-4 transition-opacity duration-300 ${idx > currentStep + 1 ? 'opacity-40' : 'opacity-100'}`}
                    >
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0 ${
                                idx <= currentStep 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-slate-300 border-slate-200'
                            }`}>
                                {idx + 1}
                            </div>
                            {idx !== activity.steps.length - 1 && (
                                <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                            )}
                        </div>
                        <div className={`pb-6 cursor-pointer ${idx === currentStep ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                            {step}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Sticky Footer Control */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 z-20">
        <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-mono font-medium text-slate-700 w-24">
                {formatTime(timeLeft)}
            </div>
            
            <button 
                onClick={toggleTimer}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
                {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1"/>}
            </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
            <div 
                className="h-full bg-primary transition-all duration-1000 linear"
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        <button
            onClick={onComplete}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-teal-700/20 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
        >
            <CheckCircle2 size={18} />
            {t.complete_activity}
        </button>
      </div>
    </div>
  );
};
