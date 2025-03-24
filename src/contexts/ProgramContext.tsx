
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { differenceInWeeks, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface ProgramContextType {
  currentWeek: number;
  maxAccessibleWeek: number;
  startDate: string | null;
  isNewWeek: boolean;
  setIsNewWeekSeen: () => void;
  startProgram: () => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider = ({ children }: { children: ReactNode }) => {
  const [startDate, setStartDate] = useState<string | null>(localStorage.getItem('programStartDate'));
  const [currentWeek, setCurrentWeek] = useState(1);
  const [maxAccessibleWeek, setMaxAccessibleWeek] = useState(1);
  const [isNewWeek, setIsNewWeek] = useState(false);
  const [lastSeenWeek, setLastSeenWeek] = useState<number>(
    parseInt(localStorage.getItem('lastSeenWeek') || '0')
  );

  // Start the program if not already started
  const startProgram = () => {
    if (!startDate) {
      const today = new Date().toISOString();
      localStorage.setItem('programStartDate', today);
      localStorage.setItem('lastSeenWeek', '1');
      setStartDate(today);
      setLastSeenWeek(1);
      setCurrentWeek(1);
      setMaxAccessibleWeek(1);
    }
  };

  // Calculate current week based on start date
  useEffect(() => {
    if (startDate) {
      try {
        const start = parseISO(startDate);
        const now = new Date();
        
        // Calculate weeks since start (add 1 because we start at week 1)
        const weeksSinceStart = Math.max(1, differenceInWeeks(now, start) + 1);
        
        // Limit to 13 weeks maximum
        const calculatedMaxWeek = Math.min(13, weeksSinceStart);
        
        setMaxAccessibleWeek(calculatedMaxWeek);
        
        // Check if we've progressed to a new week
        if (calculatedMaxWeek > lastSeenWeek) {
          setIsNewWeek(true);
        }
      } catch (error) {
        console.error("Error calculating program weeks:", error);
        
        // Reset if there's an error with date parsing
        localStorage.removeItem('programStartDate');
        setStartDate(null);
        setMaxAccessibleWeek(1);
      }
    }
  }, [startDate, lastSeenWeek]);

  // Mark the new week as seen
  const setIsNewWeekSeen = () => {
    setIsNewWeek(false);
    localStorage.setItem('lastSeenWeek', maxAccessibleWeek.toString());
    setLastSeenWeek(maxAccessibleWeek);
    
    // Show toast when a new week is unlocked
    if (maxAccessibleWeek > 1) {
      toast.success(`Week ${maxAccessibleWeek} unlocked!`, {
        description: "You've progressed to a new week in your program."
      });
    }
  };

  useEffect(() => {
    // If the user has user data but hasn't started the program, start it automatically
    const userDataExists = !!localStorage.getItem("userData");
    if (userDataExists && !startDate) {
      startProgram();
    }
  }, [startDate]);

  return (
    <ProgramContext.Provider value={{
      currentWeek,
      maxAccessibleWeek,
      startDate,
      isNewWeek,
      setIsNewWeekSeen,
      startProgram
    }}>
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
};
