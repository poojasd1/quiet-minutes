
import { Type, Schema } from "@google/genai";
import { UserProfile, EnergyLevel, Activity, ActivityCategory } from "../types";
import { Agent } from "./adk";

// --- MOCK DATA FOR FALLBACK/DEMO MODE ---
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "mock-1",
    title: "The 4-7-8 Breathing Technique",
    description: "A simple, powerful breathing pattern to reduce anxiety and reset your nervous system in just a few minutes.",
    category: ActivityCategory.BODY,
    durationMinutes: 5,
    steps: [
      "Sit comfortably with your back straight.",
      "Exhale completely through your mouth, making a whoosh sound.",
      "Close your mouth and inhale quietly through your nose to a mental count of 4.",
      "Hold your breath for a count of 7.",
      "Exhale completely through your mouth, making a whoosh sound to a count of 8.",
      "Repeat the cycle for 4 full breaths."
    ],
    rationale: "Perfect for resetting low energy or calming high stress quickly.",
    sourceUrl: "https://www.drweil.com/health-wellness/body-mind-spirit/stress-anxiety/breathing-three-exercises/",
  },
  {
    id: "mock-2",
    title: "Logic Puzzle: The Two Doors",
    description: "A classic logic riddle to wake up your brain without needing deep focus.",
    category: ActivityCategory.BRAIN,
    durationMinutes: 10,
    steps: ["Read the riddle below.", "Think through the logic.", "Select your answer."],
    rationale: "Engages logical reasoning centers to boost alertness.",
    interactive: {
      type: "QUIZ",
      quizData: {
        question: "You are in a room with two doors. One leads to freedom, the other to a lion. There are two guards. One always tells the truth, the other always lies. You don't know which is which. You can ask ONE question to ONE guard to find the door to freedom. What do you ask?",
        options: [
          "Ask 'Is the left door freedom?'",
          "Ask 'If I asked the other guard which door leads to freedom, what would he say?'",
          "Ask 'Are you the liar?'"
        ],
        correctAnswer: "Ask 'If I asked the other guard which door leads to freedom, what would he say?'",
        explanation: "If you ask this, both guards will point to the WRONG door. The truth-teller knows the liar would point to the wrong door, so he points there. The liar lies about what the truth-teller would say, so he also points to the wrong door. Therefore, you choose the OPPOSITE door."
      }
    }
  },
  {
    id: "mock-3",
    title: "Micro-Reading: The Stoic View",
    description: "A short passage from Marcus Aurelius on handling today's challenges.",
    category: ActivityCategory.REFLECTION,
    durationMinutes: 5,
    steps: ["Read the short passage.", "Reflect on how it applies to your current task.", "Take one deep breath."],
    rationale: "Provides perspective and emotional regulation for a busy professional.",
    interactive: {
      type: "READING",
      content: "\"When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they can't tell good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own... and so none of them can hurt me.\"\n\n— Marcus Aurelius, Meditations"
    }
  }
];

// --- AGENT DEFINITIONS ---

// 1. Schema for the Architect Agent
const activitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    activities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING, enum: Object.values(ActivityCategory) },
          durationMinutes: { type: Type.NUMBER },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          rationale: { type: Type.STRING },
          sourceUrl: { type: Type.STRING, nullable: true },
          interactive: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
              type: { type: Type.STRING, enum: ["QUIZ", "READING"] },
              content: { type: Type.STRING, nullable: true },
              quizData: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              }
            }
          }
        },
        required: ["title", "description", "category", "durationMinutes", "steps", "rationale", "id"]
      }
    }
  }
};

// 2. Initialize Agents using ADK
const researcherAgent = new Agent({
  name: "Researcher (Tools)",
  model: "gemini-2.5-flash",
  tools: [{ googleSearch: {} }],
  systemInstruction: "You are a helpful researcher. For physical tasks, use search to verify. For mental tasks, be creative and generate the content yourself."
});

const researcherFallbackAgent = new Agent({
  name: "Researcher (LLM Only)",
  model: "gemini-2.5-flash",
  systemInstruction: "You are a creative wellbeing expert. Generate specific, actionable activities based on the persona."
});

const architectAgent = new Agent({
  name: "Architect",
  model: "gemini-2.5-flash",
  responseMimeType: "application/json",
  responseSchema: activitySchema,
  systemInstruction: "You are a strict data formatter. Convert loose research text into the specified JSON schema."
});

const coachAgent = new Agent({
  name: "Coach",
  model: "gemini-2.5-flash",
  systemInstruction: "You are a warm, encouraging personal coach. Keep responses under 20 words."
});


// --- ORCHESTRATION LOGIC ---

export const generateActivities = async (
  profile: UserProfile,
  minutesAvailable: number,
  energy: EnergyLevel
): Promise<Activity[]> => {
  // Check for API Key availability via a dummy check on an agent
  if (!process.env.API_KEY) {
    console.warn("API Key missing - Serving Mock Data");
    return getMockData(minutesAvailable);
  }

  // Context Compaction
  const recentHistory = profile.history.slice(-5).map(h => 
    `- Did "${h.activityTitle}" on ${new Date(h.timestamp).toLocaleDateString()} (Feedback: ${h.feedback?.enjoyment}, ${h.feedback?.difficulty})`
  ).join('\n');

  const languageInstruction = profile.language === 'hi' 
    ? "IMPORTANT: Output EVERYTHING in Hindi (Devanagari script), including titles, descriptions, steps, and quiz content." 
    : "Output in English.";

  // Agent 1 Prompt
  const researcherPrompt = `
    **User Profile**: "${profile.persona}" named ${profile.name}.
    **Goals**: ${profile.goals.join(", ")}.
    **Current Context**: ${minutesAvailable} minutes available, Energy Level: "${energy}".
    **History**: ${recentHistory || "None"}
    **Language Preference**: ${profile.language === 'hi' ? 'Hindi' : 'English'}

    **Task**:
    Find or Create 3 distinct micro-activities.
    
    1. **Physical/External**: A stretch, movement, or specific technique (e.g. 4-7-8 breathing).
    2. **Generative/In-App**: A mental challenge we can generate RIGHT NOW. 
       - Examples: A specific Logic Puzzle, a Trivia Question about a user interest, or a "Micro-Read" (a 100-word interesting fact or story).
       - Explicitly write out the quiz question/answer or the reading text.
    3. **Creative/Reflection**: A specific prompt or creative micro-task.

    Ensure the activities are doable *right now*.
    ${languageInstruction}
    Return a detailed text description of these 3 options.
  `;

  let researchOutput = "";
  let searchGroundingChunks: any[] = [];

  // Step 1: Run Researcher
  try {
    const response = await researcherAgent.run(researcherPrompt);
    if (!response) throw new Error("Researcher failed");
    
    researchOutput = Agent.getText(response);
    searchGroundingChunks = Agent.getGroundingChunks(response);
    
  } catch (error) {
    console.warn("Researcher (Tools) failed. Attempting fallback agent.", error);
    try {
        const fallbackResponse = await researcherFallbackAgent.run(researcherPrompt);
        researchOutput = Agent.getText(fallbackResponse);
    } catch (fallbackError) {
        console.error("All Research Agents failed. Serving Mock Data.");
        return getMockData(minutesAvailable);
    }
  }

  // Step 2: Run Architect
  const architectPrompt = `
    **Raw Research**:
    ${researchOutput}

    **Instructions**:
    1. Extract 3 activities.
    2. Map to JSON schema.
    3. **Important**: If the activity is a Quiz, Trivia, or Logic Puzzle, set 'interactive' object with type='QUIZ', populate 'quizData'.
    4. **Important**: If the activity is a short Story, Fact, or Reading, set 'interactive' object with type='READING', populate 'content' string.
    5. Otherwise, leave 'interactive' null.
    6. 'durationMinutes' should be approx ${minutesAvailable}.
    7. 'rationale' must explain fit for ${profile.name} (${energy}).
    8. ${languageInstruction} Ensure the JSON values are in the correct language. Keys in English.
    9. For 'category', use exactly one of these strings: ${Object.values(ActivityCategory).map(v => `"${v}"`).join(', ')}.
  `;

  try {
    const architectResponse = await architectAgent.run(architectPrompt);
    const text = Agent.getText(architectResponse);
    
    if (!text) throw new Error("Empty response from Architect");
    
    const data = JSON.parse(text);
    const activities: Activity[] = data.activities || [];

    // Augment with grounding data
    if (searchGroundingChunks.length > 0) {
      activities.forEach((act, idx) => {
        if (!act.sourceUrl && !act.interactive && searchGroundingChunks[idx]?.web?.uri) {
           act.sourceUrl = searchGroundingChunks[idx].web.uri;
        }
      });
    }

    if (activities.length === 0) throw new Error("No activities parsed");
    return activities;

  } catch (error) {
    console.error("Architect Agent failed, serving MOCK data:", error);
    return getMockData(minutesAvailable);
  }
};

export const generateEncouragement = async (
  profile: UserProfile,
  activity: Activity
): Promise<string> => {
   if (!process.env.API_KEY) return "Great job! Keep it up.";

   const languageInstruction = profile.language === 'hi' 
    ? "Output in Hindi (Devanagari script)." 
    : "Output in English.";

   const prompt = `
     The user (${profile.persona}) just completed: "${activity.title}".
     Give a very short (1 sentence) encouraging remark based on their persona.
     ${languageInstruction}
   `;
   
   const response = await coachAgent.run(prompt);
   return Agent.getText(response) || "Well done!";
}

// Helper for Mock Data
const getMockData = async (minutes: number): Promise<Activity[]> => {
    return new Promise(resolve => setTimeout(() => {
        // Deep copy and adjust minutes
        const adjustedMock = MOCK_ACTIVITIES.map(a => ({
            ...a,
            durationMinutes: minutes
        }));
        resolve(adjustedMock);
    }, 1500));
};
