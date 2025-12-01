
import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { CheckIn } from './components/CheckIn';
import { Generating } from './components/Generating';
import { Selection } from './components/Selection';
import { ActiveSession } from './components/ActiveSession';
import { Feedback } from './components/Feedback';
import { Navigation } from './components/Navigation';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { UserProfile, ViewState, Activity, EnergyLevel, ActivityLog, PersonaType } from './types';
import { generateActivities } from './services/geminiService';

const STORAGE_KEY = 'quiet_minutes_profile_v1';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<ViewState>('ONBOARDING');
  
  // Session State
  const [currentContext, setCurrentContext] = useState<{minutes: number, energy: EnergyLevel} | null>(null);
  const [suggestedActivities, setSuggestedActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Demo State
  const [isDemo, setIsDemo] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
        setView('CHECK_IN');
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  // Demo Automation Logic
  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;

    if (view === 'CHECK_IN') {
      timeoutId = setTimeout(() => {
        handleCheckIn(15, EnergyLevel.MEDIUM);
      }, 1500); // Wait 1.5s then auto-checkin
    } 
    else if (view === 'SELECTION') {
      timeoutId = setTimeout(() => {
        if (suggestedActivities.length > 0) {
          handleActivitySelect(suggestedActivities[0]);
        }
      }, 3000); // Wait 3s to show selection options then pick first
    }
    else if (view === 'ACTIVE_SESSION') {
      setIsDemo(false); // Stop demo automation once we reach the active session
    }

    return () => clearTimeout(timeoutId);
  }, [view, isDemo, suggestedActivities]);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    saveProfile(newProfile);
    setView('CHECK_IN');
  };

  const handleStartDemo = () => {
    setIsDemo(true);
    const demoProfile: UserProfile = {
      name: "Demo User",
      persona: PersonaType.PROFESSIONAL,
      goals: ["Reduce stress", "Improve focus", "Quick learning"],
      language: 'en',
      history: [
        {
          activityId: "demo-1",
          activityTitle: "Morning Desk Stretch",
          timestamp: Date.now() - 86400000, // Yesterday
          completed: true,
          feedback: { difficulty: 'just_right', enjoyment: 'liked' }
        },
        {
          activityId: "demo-2",
          activityTitle: "5-Min Gratitude Journal",
          timestamp: Date.now() - 172800000, // 2 days ago
          completed: true,
          feedback: { difficulty: 'too_easy', enjoyment: 'neutral' }
        }
      ]
    };
    saveProfile(demoProfile);
    setView('CHECK_IN');
  };

  const handleCheckIn = async (minutes: number, energy: EnergyLevel) => {
    if (!profile) return;
    setCurrentContext({ minutes, energy });
    setView('GENERATING');
    
    // Simulate multi-agent process via Gemini
    const activities = await generateActivities(profile, minutes, energy);
    
    setSuggestedActivities(activities);
    setView('SELECTION');
  };

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setView('ACTIVE_SESSION');
  };

  const handleSessionAbort = () => {
    setSelectedActivity(null);
    setView('SELECTION');
  };

  const handleSessionComplete = () => {
    setView('FEEDBACK');
  };

  const handleFeedbackSubmit = (difficulty: 'too_easy' | 'just_right' | 'too_hard', enjoyment: 'disliked' | 'neutral' | 'liked') => {
    if (!profile || !selectedActivity) return;

    // Create log entry
    const newLog: ActivityLog = {
      activityId: selectedActivity.id,
      activityTitle: selectedActivity.title,
      timestamp: Date.now(),
      completed: true,
      feedback: { difficulty, enjoyment }
    };

    // Update profile history (Keep last 20 for storage size sanity)
    const updatedProfile = {
      ...profile,
      history: [...profile.history, newLog].slice(-20)
    };

    saveProfile(updatedProfile);
    
    // Reset session
    setSelectedActivity(null);
    setSuggestedActivities([]);
    setCurrentContext(null);
    setView('CHECK_IN');
  };

  const handleNavigate = (newView: ViewState) => {
    if (newView === 'CHECK_IN') {
       if (view === 'ACTIVE_SESSION') {
         // Don't interrupt active session via nav unless user explicitly aborts
       }
    }
    setView(newView);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    setView('ONBOARDING');
    setSuggestedActivities([]);
    setSelectedActivity(null);
    setIsDemo(false);
  };

  // Safe accessor for language
  const userLang = profile?.language || 'en';

  // Render Router
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-12 relative">
      {!profile && view === 'ONBOARDING' && (
        <Onboarding onComplete={handleOnboardingComplete} onDemo={handleStartDemo} />
      )}

      {profile && (
        <>
          {view === 'CHECK_IN' && (
            <CheckIn userName={profile.name} language={userLang} onCheckIn={handleCheckIn} />
          )}
          
          {view === 'GENERATING' && (
            <Generating language={userLang} />
          )}

          {view === 'SELECTION' && (
            <Selection 
              activities={suggestedActivities} 
              onSelect={handleActivitySelect} 
              onBack={() => setView('CHECK_IN')}
              language={userLang}
            />
          )}

          {view === 'ACTIVE_SESSION' && selectedActivity && (
            <ActiveSession 
              activity={selectedActivity} 
              onComplete={handleSessionComplete}
              onAbort={handleSessionAbort}
              language={userLang}
            />
          )}

          {view === 'FEEDBACK' && selectedActivity && (
            <Feedback 
              activity={selectedActivity} 
              profile={profile}
              onSubmit={handleFeedbackSubmit}
            />
          )}

          {view === 'HISTORY' && (
            <HistoryView history={profile.history} language={userLang} />
          )}

          {view === 'PROFILE' && (
            <ProfileView profile={profile} onLogout={handleLogout} />
          )}
          
          {view !== 'ACTIVE_SESSION' && (
            <Navigation currentView={view} onNavigate={handleNavigate} language={userLang} />
          )}
        </>
      )}
      
      {view !== 'ACTIVE_SESSION' && (
        <div className="mt-8 text-center text-xs text-slate-400 px-4 pb-16">
          <p>Quiet Minutes &copy; 2025. AI suggestions are for informational purposes.</p>
        </div>
      )}
    </div>
  );
}
