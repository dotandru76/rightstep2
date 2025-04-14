// src/data/weeklyProgramData.ts

// --- Interfaces ---
export interface DailyContent {
  dayOfWeek: string; // Example: "Sunday", "Monday" etc. (Mainly for reference)
  title: string;     // Title for the day's content/focus
  speech: string;    // The text content of the daily speech/motivation
  audioFilename?: string; // The corresponding audio filename (e.g., "day_N.wav") in Firebase Storage
}

export interface WeekProgram {
  week: number;
  title: string;
  subtitle: string;
  focusPoints: string[]; // Key learning/focus points for the week
  dailyTasks: string[];  // Actionable tasks for the user each day of the week
  explanation: string; // Detailed explanation of the week's principles
  foodNotes: string;   // Specific food guidelines/notes for the week
  dailyContent: DailyContent[]; // Array of content for each of the 7 days
}

// --- Constants ---
export const TOTAL_PROGRAM_WEEKS = 12; // Set program duration to 12 weeks

// --- Program Data Array ---
// IMPORTANT: You need to populate this array fully for all 12 weeks
// based on your Hebrew source material.
// The example below includes test audio filenames for days 1-3 only.
export const weeklyProgram: WeekProgram[] = [
  // --- Week 1 Data (Example with Test Audio Files) ---
  {
    week: 1,
    title: "Week 1: Setting the Foundation",
    subtitle: "Understanding Leptin & Establishing Rhythm",
    focusPoints: [
        "Leptin hormone basics",
        "Importance of meal timing",
        "Establishing a consistent sleep schedule",
        "Initial hydration goals",
    ],
    dailyTasks: [
        "Eat breakfast within 1 hour of waking",
        "Avoid eating for 3 hours before sleep",
        "Aim for 7-9 hours of sleep",
        "Track water intake",
        "Read daily motivation/explanation",
    ],
    explanation: "Week 1 focuses on understanding the crucial role of leptin in appetite and weight regulation. We establish foundational habits like consistent meal timing and sleep schedules to help reset your body's natural hormonal balance. Hydration is also key.",
    foodNotes: "Focus on whole, unprocessed foods. Ensure adequate protein at breakfast. Avoid sugary drinks and late-night snacking. Pay attention to portion sizes.",
    dailyContent: [
        // Corresponds to Program Day 1
        { dayOfWeek: "Day 1", title: "Welcome & The 5 Rules", speech: "Welcome to Day 1! Today we introduce the core principles and the importance of timing...", audioFilename: "day_1.wav" },
        // Corresponds to Program Day 2
        { dayOfWeek: "Day 2", title: "Why Breakfast Matters", speech: "Learn why eating a protein-rich breakfast soon after waking is critical for leptin sensitivity...", audioFilename: "day_2.wav" },
        // Corresponds to Program Day 3
        { dayOfWeek: "Day 3", title: "The Pre-Sleep Fast", speech: "Understand the importance of the 3-hour window before sleep and how it impacts hormones...", audioFilename: "day_3.wav" },
         // Corresponds to Program Day 4 (No test audio from here)
        { dayOfWeek: "Day 4", title: "Hydration Power", speech: "Focus on water intake today. Dehydration can interfere with leptin signals...", audioFilename: undefined }, // "day_4.wav" - Add when ready
         // Corresponds to Program Day 5
        { dayOfWeek: "Day 5", title: "Sleep's Role", speech: "Deep dive into how sleep duration and quality affect leptin and ghrelin...", audioFilename: undefined }, // "day_5.wav" - Add when ready
         // Corresponds to Program Day 6
        { dayOfWeek: "Day 6", title: "Mindful Eating Start", speech: "Begin practicing paying attention to your body's hunger and fullness cues...", audioFilename: undefined }, // "day_6.wav" - Add when ready
         // Corresponds to Program Day 7
        { dayOfWeek: "Day 7", title: "Week 1 Review", speech: "Reflect on the first week. What went well? What challenges did you face? Prepare for Week 2...", audioFilename: undefined }, // "day_7.wav" - Add when ready
    ]
  },
  // --- Week 2 Data (Placeholder Structure) ---
  {
      week: 2,
      title: "Week 2: Fueling Smart",
      subtitle: "Nutrient Timing & Food Choices",
      focusPoints: ["Placeholder Focus 1", "Placeholder Focus 2"],
      dailyTasks: ["Placeholder Task 1", "Placeholder Task 2"],
      explanation: "Placeholder explanation for Week 2.",
      foodNotes: "Placeholder food notes for Week 2.",
      dailyContent: [
          // Corresponds to Program Day 8 through 14 - Needs content + audioFilename: "day_N.wav"
          { dayOfWeek: "Day 8", title: "Title", speech: "Speech...", audioFilename: undefined }, // "day_8.wav"
          { dayOfWeek: "Day 9", title: "Title", speech: "Speech...", audioFilename: undefined }, // "day_9.wav"
          { dayOfWeek: "Day 10", title: "Title", speech: "Speech...", audioFilename: undefined }, // "day_10.wav"
          { dayOfWeek: "Day 11", title: "Title", speech: "Speech...", audioFilename: undefined }, // "day_11.wav"
          { dayOfWeek: "Day 12", title: "Title", speech: "Speech...", audioFilename: undefined }, // "day_12.wav"
          { dayOfWeek: "Day 13", title: "Title", speech: "Speech...", audioFilename: undefined }, // "day_13.wav"
          { dayOfWeek: "Day 14", title: "Title", speech: "Speech...", audioFilename: undefined }, // "day_14.wav"
      ]
  },
  // --- Weeks 3 - 12 (Add full data structure for each) ---
  // ...
  // Example: Add structure for Week 3, Week 4... up to Week 12
  // Remember to populate all fields including dailyContent with speech and audioFilename ("day_15.wav" etc.)
  // ...
];

// --- Helper Function ---
// Gets the daily content based on the overall program day number (1-84)
export const getDailyContentForDay = (programDay: number): DailyContent | null => {
  if (programDay < 1 || programDay > TOTAL_PROGRAM_WEEKS * 7) {
    console.error(`Requested program day ${programDay} is out of range.`);
    return null;
  }
  // Calculate week index (0-based) and day index within the week (0-based)
  const weekIndex = Math.floor((programDay - 1) / 7);
  const dayIndex = (programDay - 1) % 7;

  // Check if the week and the specific day's content exist
  if (weeklyProgram[weekIndex]?.dailyContent?.[dayIndex]) {
    return weeklyProgram[weekIndex].dailyContent[dayIndex];
  } else {
      console.error(`Content not found for Program Day ${programDay} (Week ${weekIndex + 1}, Day Index ${dayIndex})`);
      return null; // Return null if data isn't populated for that day
  }
};