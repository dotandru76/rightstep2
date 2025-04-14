// src/contexts/ProgramContext.tsx - Removed Router if present

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
// Make sure date-fns is installed: npm install date-fns
import { differenceInWeeks, differenceInCalendarDays, parseISO, isValid, startOfDay, addDays } from 'date-fns';
import { toast } from 'sonner';
// Import total weeks constant
import { TOTAL_PROGRAM_WEEKS } from '@/data/weeklyProgramData'; // Ensure path is correct

// Define the shape of the context data
interface ProgramContextType {
  currentWeek: number; // The effective week being viewed (actual or debug)
  currentDay: number; // The effective day being viewed (actual or debug, 1-84)
  maxAccessibleWeek: number; // The latest week unlocked by actual time progression
  startDate: string | null; // Program start date ISO string
  isNewWeek: boolean; // Flag if a new week was just unlocked
  setIsNewWeekSeen: () => void; // Function to clear the new week flag
  startProgram: () => void; // Function to initialize the program start date
  debugMode: boolean; // Is debug mode active?
  setDebugMode: (value: boolean) => void; // Toggle debug mode
  setDebugWeek: (weekNumber: number) => void; // Set week for debugging
  setDebugDay: (dayNumber: number) => void; // Set day for debugging
}

// Create the context with a default value to avoid undefined checks
export const ProgramContext = createContext<ProgramContextType>({
  currentWeek: 1,
  currentDay: 1,
  maxAccessibleWeek: 1,
  startDate: null,
  isNewWeek: false,
  setIsNewWeekSeen: () => {},
  startProgram: () => {},
  debugMode: false,
  setDebugMode: () => {},
  setDebugWeek: () => {},
  setDebugDay: () => {},
});

// Define the Provider component
export const ProgramProvider = ({ children }: { children: ReactNode }) => {
  // --- State Variables ---
  const [startDate, setStartDate] = useState<string | null>(() => localStorage.getItem('programStartDate'));
  const [maxAccessibleWeek, setMaxAccessibleWeek] = useState(1); // Actual latest unlocked week
  const [currentWeek, setCurrentWeek] = useState(1); // Effective week being viewed
  const [currentDay, setCurrentDay] = useState(1); // Effective day being viewed (1-84)
  const [isNewWeek, setIsNewWeek] = useState(false);
  const [lastSeenWeek, setLastSeenWeek] = useState<number>(() => parseInt(localStorage.getItem('lastSeenWeek') || '0'));
  const [debugMode, setDebugMode] = useState<boolean>(() => sessionStorage.getItem('weekDebugMode') === 'true');
  const [initialized, setInitialized] = useState(false);

  // --- Effects ---

  // Save debug mode to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('weekDebugMode', debugMode ? 'true' : 'false');
  }, [debugMode]);

  // Calculate actual current week/day and max accessible week based on start date
  const calculateCurrentProgress = useCallback(() => {
    if (startDate) {
      try {
        const start = parseISO(startDate);
        if (!isValid(start)) throw new Error("Invalid start date parsed");

        const today = startOfDay(new Date());
        const totalDaysInProgram = TOTAL_PROGRAM_WEEKS * 7; // Defined here

        // Calculate actual days elapsed (minimum 0)
        const daysElapsed = Math.max(0, differenceInCalendarDays(today, start));
        // Calculate actual current day number (1 to totalDaysInProgram)
        const actualCurrentDay = Math.min(totalDaysInProgram, daysElapsed + 1);
        // Calculate actual current week number (1 to TOTAL_PROGRAM_WEEKS)
        const actualCurrentWeek = Math.min(TOTAL_PROGRAM_WEEKS, Math.ceil(actualCurrentDay / 7));

        // Update max accessible week based on actual progress
        setMaxAccessibleWeek(actualCurrentWeek);

        // Update effective currentWeek and currentDay ONLY if not in debug mode
        if (!debugMode) {
          setCurrentWeek(actualCurrentWeek);
          setCurrentDay(actualCurrentDay);
        }

        // Check if a new week has been unlocked since last seen
        if (actualCurrentWeek > lastSeenWeek) {
          setIsNewWeek(true);
          // Note: We don't update lastSeenWeek here, setIsNewWeekSeen does that
        }

        // Mark as initialized after calculating
        setInitialized(true);
        console.log("Program progress calculated:", { 
          actualCurrentDay, 
          actualCurrentWeek, 
          daysElapsed 
        });

      } catch (error) {
        console.error("Error calculating program weeks/days:", error);
        // Reset if date is invalid
        localStorage.removeItem('programStartDate');
        setStartDate(null);
        setMaxAccessibleWeek(1);
        setCurrentWeek(1);
        setCurrentDay(1);
        setInitialized(true); // Still mark as initialized to avoid infinite loading
      }
    } else {
        // If no start date, reset to defaults
        setMaxAccessibleWeek(1);
        setCurrentWeek(1);
        setCurrentDay(1);
        setInitialized(true); // Mark as initialized with defaults
    }
  }, [startDate, lastSeenWeek, debugMode]); // Rerun if these change

  // Run calculation on mount and when relevant state changes
  useEffect(() => {
    calculateCurrentProgress();
  }, [calculateCurrentProgress]);

  // --- Functions ---

  // Start the program (set start date if needed)
  const startProgram = useCallback(() => {
    if (!startDate) {
      const todayISO = new Date().toISOString();
      localStorage.setItem('programStartDate', todayISO);
      localStorage.setItem('lastSeenWeek', '1');
      setStartDate(todayISO);
      setLastSeenWeek(1);
      // Recalculate progress immediately after setting start date
      calculateCurrentProgress();
      console.log("Program started today.");
    } else {
      console.log("Program already started on:", startDate);
      // Ensure progress is calculated even if startProgram is called when date exists
      calculateCurrentProgress();
    }
  }, [startDate, calculateCurrentProgress]);

  // Automatically start program if user data exists but start date doesn't
  useEffect(() => {
    const userDataExists = !!localStorage.getItem("userData");
    if (userDataExists && !startDate) {
      startProgram();
    }
  }, [startDate, startProgram]);

  // Mark the new week notification as seen by the user
  const setIsNewWeekSeen = () => {
    if (isNewWeek) {
        setIsNewWeek(false);
        const newLastSeenWeek = maxAccessibleWeek; // Use the actual max week
        localStorage.setItem('lastSeenWeek', newLastSeenWeek.toString());
        setLastSeenWeek(newLastSeenWeek);
        console.log(`Marked week ${newLastSeenWeek} as seen.`);
        // Optional: Show toast only if it's truly a new week beyond week 1
        if (newLastSeenWeek > 1) {
            toast.success(`Week ${newLastSeenWeek} unlocked!`, {
                description: "You've progressed to a new week in your program."
            });
        }
    }
  };

  // Function to set the week number in debug mode
  const setDebugWeek = (weekNumber: number) => {
    if (debugMode) {
      const validatedWeek = Math.max(1, Math.min(TOTAL_PROGRAM_WEEKS, weekNumber));
      const firstDayOfWeek = (validatedWeek - 1) * 7 + 1;
      setCurrentWeek(validatedWeek); // Update effective current week
      setCurrentDay(firstDayOfWeek); // Update effective current day to start of week
      toast.info(`Debug: Set view to Week ${validatedWeek} (Day ${firstDayOfWeek})`);
    } else {
      toast.error('Debug mode must be enabled to change week/day');
    }
  };

  // Function to set the day number in debug mode
  const setDebugDay = (dayNumber: number) => {
     if (debugMode) {
        const totalDaysInProgram = TOTAL_PROGRAM_WEEKS * 7;
        const validatedDay = Math.max(1, Math.min(totalDaysInProgram, dayNumber));
        const correspondingWeek = Math.ceil(validatedDay / 7);
        setCurrentDay(validatedDay); // Update effective current day
        setCurrentWeek(correspondingWeek); // Update effective current week
        toast.info(`Debug: Set view to Day ${validatedDay} (Week ${correspondingWeek})`);
     } else {
        toast.error('Debug mode must be enabled to change week/day');
     }
  };

  // Extended toggleDebugMode to reset view when turning off
   const handleToggleDebugMode = (value: boolean) => {
     setDebugMode(value);
     toast(value ? "Developer mode enabled" : "Developer mode disabled", {
       description: value ? "Week/Day selection enabled" : "Week/Day restrictions reapplied"
     });
     // If turning debug mode OFF, recalculate and reset currentWeek/Day to actual values
     if (!value) {
        calculateCurrentProgress();
     }
   };

  // --- Context Value ---
  const contextValue: ProgramContextType = {
    currentWeek,
    currentDay, 
    maxAccessibleWeek,
    startDate,
    isNewWeek,
    setIsNewWeekSeen,
    startProgram,
    debugMode,
    setDebugMode: handleToggleDebugMode,
    setDebugWeek,
    setDebugDay,
  };

  // Return loading state while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-3 text-gray-700">Initializing program data...</p>
      </div>
    );
  }

  return (
    <ProgramContext.Provider value={contextValue}>
      {children}
    </ProgramContext.Provider>
  );
};

// Custom hook to consume the context
export const useProgram = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  
  // No need to check for undefined since we provided a default value
  return context;
};