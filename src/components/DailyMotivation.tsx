// src/components/DailyMotivation.tsx

// NOTE: Removed incorrect self-import and example comments from the top.
// File should start with correct imports like below:

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button"; // Import if needed for other buttons
import { Play, Pause, Loader2, AlertTriangle, Volume2 } from 'lucide-react';
import { toast } from "sonner";

// --- Context and Data ---
// Verify these paths are correct for your project structure
import { useProgram } from '@/contexts/ProgramContext';
import { weeklyProgram } from '@/data/weeklyProgramData';

// --- Firebase ---
// Verify these paths are correct
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from '@/initFirebase';

// Initialize Firebase Storage
const storage = getStorage(app);

// Helper function to get content (could be moved to a utility file)
const getDailyContentForDay = (dayNumber: number) => {
    if (!dayNumber || dayNumber < 1) return null;

    const weekNumber = Math.ceil(dayNumber / 7);
    // Use the correct dayOfWeek calculation (1-7)
    const dayOfWeek = ((dayNumber - 1) % 7) + 1;

    const weekData = weeklyProgram.find(w => w.week === weekNumber);
    if (!weekData || !weekData.dailyContent) {
        console.warn(`DailyMotivation: No weekData or dailyContent found for week ${weekNumber}`);
        return null;
    }

    // Ensure dayOfWeek comparison uses numbers
    const dayContent = weekData.dailyContent.find(d => d.dayOfWeek === dayOfWeek);
     if (!dayContent) {
        console.warn(`DailyMotivation: No specific dayContent found for week ${weekNumber}, dayOfWeek ${dayOfWeek}`);
     }
     return dayContent || null;
};


const DailyMotivation: React.FC = () => {
  const { currentDay } = useProgram(); // Get currentDay from context

  // --- Audio Player State ---
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  // --------------------------

  // Get today's content using the correct 'currentDay' from context
  const dailyContent = useMemo(() => {
    if (currentDay === undefined || currentDay === null || currentDay < 1) {
      return null; // Return null if day is invalid
    }
    return getDailyContentForDay(currentDay);
  }, [currentDay]);

  // Function to get audio URL and toggle playback
  const handlePlayMotivation = async () => {
    if (isLoadingAudio) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      // isPlaying state updated by onPause event
      return;
    }

    if (!dailyContent) {
       setAudioError("Today's content not loaded.");
       console.warn("handlePlayMotivation: No daily content available for day:", currentDay);
       return;
    }
    // Use the correct filename casing from data
    if (!dailyContent.audioFilename) {
      setAudioError("No audio file specified for today.");
      console.warn("handlePlayMotivation: No audioFilename for day:", currentDay);
      return;
    }

    console.log(`DailyMotivation: Attempting to play: ${dailyContent.audioFilename}`);
    setIsLoadingAudio(true);
    setAudioError(null);
    setAudioUrl(null); // Reset URL

    try {
      // Construct the path including the folder
      const audioPath = `daily_audio/${dailyContent.audioFilename}`;
      const audioFileRef = ref(storage, audioPath);
      console.log(`DailyMotivation: Fetching URL for: ${audioPath}`);
      const url = await getDownloadURL(audioFileRef);
      console.log(`DailyMotivation: Got download URL: ${url}`);
      setAudioUrl(url); // Trigger useEffect below
    } catch (error: any) {
      console.error("DailyMotivation: Error getting audio download URL:", error);
      if (error.code === 'storage/object-not-found') {
        setAudioError(`Audio file not found: ${dailyContent.audioFilename}`);
      } else if (error.code === 'storage/unauthorized' || error.code === 'storage/unauthenticated') {
        setAudioError("Permission denied fetching audio.");
      } else {
        setAudioError("Failed to load audio file.");
      }
      setIsLoadingAudio(false);
    }
  };

  // Effect to handle audio element loading and playback
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioUrl && audioElement) {
      audioElement.src = audioUrl;
      setIsPlaying(false); // Ensure playing state is reset before load/play
      audioElement.load();
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("DailyMotivation: Audio playback failed:", error);
          setIsPlaying(false);
          setIsLoadingAudio(false);
          setAudioError("Playback failed.");
        });
      }
    }
    // Cleanup: pause audio if component unmounts or audioUrl changes
    return () => {
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
      }
      setIsPlaying(false); // Ensure isPlaying is false on cleanup/URL change
    };
  }, [audioUrl]); // Only run when audioUrl changes

  // --- Audio Element Event Handlers ---
  const handleAudioEnded = () => {
      setIsPlaying(false);
      setAudioUrl(null); // Allow replay
  };
  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      console.error("DailyMotivation: Audio element error event:", e);
      setAudioError("Audio playback error.");
      setIsLoadingAudio(false);
      setIsPlaying(false);
  };
  const handleAudioPlaying = () => {
      setIsLoadingAudio(false);
      setIsPlaying(true);
      setAudioError(null);
  };
  const handleAudioPause = () => {
      setIsPlaying(false);
  };
  // ------------------------------------


  // --- Render Component ---
  return (
    <Card className="shadow-lg flex-grow flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-rightstep-green flex items-center gap-2">
          <Volume2 size={24} /> Today's Motivation
        </CardTitle>
        {dailyContent?.title ? (
             <CardDescription>Day {currentDay}: {dailyContent.title}</CardDescription>
        ) : (
             <CardDescription>Day {currentDay}: Loading title...</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center text-center space-y-4">
        {dailyContent ? (
          <>
            {/* Speech Text */}
            <p className="text-sm text-gray-600 mb-4 flex-grow">
              {dailyContent.speech || "Loading today's message..."}
            </p>

            {/* Clickable Trainer Image Area */}
            {dailyContent.audioFilename ? (
              <div className='flex flex-col items-center w-32 mt-auto'>
                <button
                  onClick={handlePlayMotivation}
                  disabled={isLoadingAudio}
                  className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-white hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rightstep-green focus:ring-offset-2 disabled:opacity-70 disabled:cursor-wait transition-all duration-200 group relative"
                  aria-label={isPlaying ? "Pause Motivation Speech" : isLoadingAudio ? "Loading Motivation Speech" : "Play Motivation Speech"}
                >
                  {/* --- CHECK THIS IMAGE PATH --- */}
                  <img src="/lovable-uploads/trainer.png" alt="Trainer icon" className="w-full h-full object-cover" onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='12' fill='%2364748b' text-anchor='middle'%3EImg%3C/text%3E%3Ctext x='50' y='70' font-family='Arial' font-size='12' fill='%2364748b' text-anchor='middle'%3ENot Found%3C/text%3E%3C/svg%3E"; }} />
                  {/* Icon Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-100 transition-opacity">
                    {isLoadingAudio && <Loader2 className="h-8 w-8 text-white animate-spin" />}
                    {isPlaying && !isLoadingAudio && <Pause className="h-8 w-8 text-white" />}
                    {!isPlaying && !isLoadingAudio && <Play className="h-8 w-8 text-white" />}
                  </div>
                </button>

                {/* Status Text */}
                <div className="mt-2 text-xs h-4 flex items-center justify-center gap-1 text-gray-600">
                  {isLoadingAudio && "Loading Audio..."}
                  {isPlaying && !isLoadingAudio && "Playing..."}
                  {!isPlaying && !isLoadingAudio && !audioError && dailyContent.audioFilename && "(Tap to Play)"}
                </div>
                {audioError && !isLoadingAudio && (
                  <p className="text-xs text-red-500 mt-1 text-center w-full flex items-center justify-center gap-1">
                    <AlertTriangle size={14} /> {audioError}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-auto">(No audio available for today)</p>
            )}
          </>
        ) : (
          // Loading state if dailyContent is null (e.g., day 0 or data missing)
          <div className="flex flex-col items-center justify-center flex-grow">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Loading daily content...</p>
          </div>
        )}
      </CardContent>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onPlay={() => console.log("DailyMotivation: Audio event: play")}
        onPlaying={handleAudioPlaying}
        onPause={handleAudioPause}
        // Add other relevant event handlers if needed
      />
    </Card>
  );
};

// --- Default Export ---
export default DailyMotivation;