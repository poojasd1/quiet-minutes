
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getT } from '../constants/translations';
import { Language } from '../types';

interface Props {
  language: Language;
}

export const Generating: React.FC<Props> = ({ language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = getT(language);
  
  const steps = [
    t.step1,
    t.step2,
    t.step3,
    t.step4
  ];

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center h-64 p-6 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-25"></div>
        <div className="relative bg-white p-4 rounded-full shadow-sm border border-teal-100">
           <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-slate-800 mb-2">{t.curating}</h3>
      <div className="h-6 overflow-hidden relative w-full max-w-xs">
        {steps.map((step, idx) => (
            <p 
                key={idx}
                className={`absolute w-full text-sm text-slate-500 transition-all duration-500 ${
                    idx === currentStep ? 'opacity-100 translate-y-0' : 
                    idx < currentStep ? 'opacity-0 -translate-y-4' : 
                    'opacity-0 translate-y-4'
                }`}
            >
                {step}
            </p>
        ))}
      </div>
    </div>
  );
};
