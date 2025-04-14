// src/pages/Index.tsx - Fixed imports

import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';

// --- Hooks & Context ---
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '@/contexts/ProgramContext'; // Adjust path if needed

// --- Data ---
import { weeklyProgram, getDailyContentForDay, TOTAL_PROGRAM_WEEKS } from '@/data/weeklyProgramData'; // Adjust path if needed

// --- UI Components ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Adjust path
import { Calendar } from "@/components/ui/calendar"; // Adjust path
import ProgramProgressCard from '@/components/dashboard/ProgramProgressCard.tsx'; // Corrected path
import RightFootIcon from '@/components/RightFootIcon'; // Adjust path
import FoodVisualization from '@/components/FoodVisualization.tsx'; // Corrected path & extension
// import FoodLogSummary from '@/components/FoodLogSummary.tsx'; // Optional
// import MealTracker from '@/components/MealTracker.tsx'; // Optional
import { Play, Pause, Loader2, AlertTriangle, Volume2 } from 'lucide-react';

// --- Firebase ---
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// import { app as firebaseApp } from '@/firebaseConfig';

const Index = () => {
    const navigate = useNavigate();
    const {
        currentDay, // Use correct name from context
        startDate,
        currentWeek,
    } = useContext(ProgramContext);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(startDate ? new Date(startDate) : new Date());

    // Update calendar selection effect
    useEffect(() => {
        if (startDate && currentDay && currentDay > 0) {
            const newSelectedDate = new Date(startDate);
            newSelectedDate.setDate(newSelectedDate.getDate() + (currentDay - 1));
            setSelectedDate(newSelectedDate);
        } else if (!startDate) { setSelectedDate(new Date()); }
    }, [startDate, currentDay]);

    // --- Audio Player State ---
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);
    // --------------------------

    // Memoize daily content calculation
    const dailyContent = useMemo(() => {
        if (!currentDay || currentDay < 1) return null;
        return getDailyContentForDay(currentDay);
    }, [currentDay]);

    // Use currentWeek from context, default to 1 if undefined/invalid
    const displayWeek = (currentWeek && currentWeek >= 1 && currentWeek <= TOTAL_PROGRAM_WEEKS) ? currentWeek : 1;

    // Memoize current week plan data calculation
     const currentWeekPlan = useMemo(() => {
          const weekIndex = displayWeek - 1;
          if (weekIndex >= 0 && weekIndex < weeklyProgram.length) return weeklyProgram[weekIndex];
          return null;
     }, [displayWeek]);

    const storage = getStorage(/* firebaseApp */);

    // --- Audio Playback Logic with Logs ---
    const handlePlayMotivation = async () => {
        console.log("--- handlePlayMotivation called ---"); // Keep this log
        console.log(`Current state: isPlaying=${isPlaying}, isLoadingAudio=${isLoadingAudio}`);
        console.log("Checking dailyContent:", dailyContent);

        if (isLoadingAudio) { console.log("Exiting: audio is already loading."); return; }
        if (isPlaying && audioRef.current) { console.log("Attempting to pause audio..."); audioRef.current.pause(); return; }
        if (!dailyContent?.audioFilename) { console.warn("No audioFilename found for today:", dailyContent); setAudioError("No audio file specified for today."); return; }
        console.log(`Found audio filename: ${dailyContent.audioFilename}`);

        console.log("Setting loading state to true...");
        setIsLoadingAudio(true); setAudioError(null); setAudioUrl(null);

        try {
            const audioPath = `daily_audio/${dailyContent.audioFilename}`;
            const audioFileRef = ref(storage, audioPath);
            console.log(`Workspaceing URL for: ${audioPath}`);
            const url = await getDownloadURL(audioFileRef);
            console.log(`Got download URL: ${url}`);
            setAudioUrl(url);
        } catch (error: any) {
            console.error("Error in handlePlayMotivation fetching URL:", error);
            const message = error.code === 'storage/object-not-found' ? `Audio file not found: ${dailyContent.audioFilename}` : error.code === 'storage/unauthorized' ? "Permission denied fetching audio." : "Failed to load audio file.";
            setAudioError(message); setIsLoadingAudio(false);
        }
    };

    useEffect(() => { /* Handles playback when audioUrl changes - Keep Logs Here */
        const audioElement = audioRef.current;
        if (audioUrl && audioElement) {
            console.log("Audio useEffect: Setting src and loading:", audioUrl);
            audioElement.src = audioUrl; setIsPlaying(false); audioElement.load();
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
                playPromise .then(_ => { console.log("Audio useEffect: Play promise resolved."); }) .catch(error => { console.error("Audio useEffect: Play promise rejected:", error); setIsPlaying(false); setIsLoadingAudio(false); setAudioError("Playback failed. Tap again."); });
            }
        }
         return () => { if (audioElement && !audioElement.paused) { audioElement.pause(); } setIsPlaying(false); };
    }, [audioUrl]);

    const handleAudioEnded = () => { console.log("Audio ended."); setIsPlaying(false); setAudioUrl(null); };
    const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => { console.error("Audio element error event:", e); setAudioError("Audio playback error."); setIsLoadingAudio(false); setIsPlaying(false); };
    const handleAudioPlaying = () => { console.log("Audio playing event."); setIsLoadingAudio(false); setIsPlaying(true); setAudioError(null); };
    const handleAudioPause = () => { console.log("Audio pause event."); setIsPlaying(false); };
    // --- End Audio Playback Logic ---

    // --- Loading State Check ---
    const isLoading = !currentDay || currentDay < 1 || !currentWeek || currentWeek < 1 || !currentWeekPlan;
    if (isLoading) {
        console.log("Index.tsx Loading because:", { currentDay, currentWeek, currentWeekPlanExists: !!currentWeekPlan });
        return ( <div className="min-h-screen bg-rightstep-gradient flex items-center justify-center p-4"><div className="flex items-center text-white text-xl"><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Loading Program Data...</div></div> );
     }
     // --- End Loading State Check ---


    // --- Main Render ---
    return (
        <div className="min-h-screen bg-rightstep-gradient pt-8 px-4 pb-20 relative">
            {/* Logo */}
            <div className="absolute top-4 left-4 z-10"><RightFootIcon className="h-12 w-12 lg:h-24 lg:w-24 text-white opacity-80" /></div>

            {/* Main Content Grid */}
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* --- Left Column --- */}
                    <div className="lg:col-span-1 space-y-6 flex flex-col">
                        <ProgramProgressCard />
                        {/* Today's Motivation Card */}
                        <Card className="shadow-lg flex-grow flex flex-col">
                             <CardHeader>
                                 <CardTitle className="text-xl font-semibold text-rightstep-green flex items-center gap-2"><Volume2 size={24} /> Today's Motivation</CardTitle>
                                 {dailyContent?.title && <CardDescription>Day {currentDay}: {dailyContent.title}</CardDescription>}
                             </CardHeader>
                             <CardContent className="flex-grow flex flex-col items-center text-center space-y-4">
                                {dailyContent ? (
                                    <>
                                        <p className="text-sm text-gray-600 mb-4 flex-grow">{dailyContent.speech || "Loading..."}</p>
                                        {dailyContent.audioFilename ? (
                                            <div className='flex flex-col items-center w-32 mt-auto'>
                                                {/* *** MODIFIED onClick HERE *** */}
                                                <button
                                                    onClick={() => {
                                                        console.log("--- TRAINER BUTTON CLICKED (Direct onClick) ---"); // Test log!
                                                        handlePlayMotivation();
                                                    }}
                                                    disabled={isLoadingAudio}
                                                    className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-white hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rightstep-green focus:ring-offset-2 disabled:opacity-70 disabled:cursor-wait transition-all duration-200 group relative"
                                                    aria-label={isPlaying ? "Pause" : isLoadingAudio ? "Loading" : "Play"}
                                                >
                                                     <img src="/lovable-uploads/trainer.png" alt="Trainer icon" className="w-full h-full object-cover" onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='12' fill='%2364748b' text-anchor='middle'%3EImg%3C/text%3E%3Ctext x='50' y='70' font-family='Arial' font-size='12' fill='%2364748b' text-anchor='middle'%3ENot Found%3C/text%3E%3C/svg%3E"; }} />
                                                     <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-100 transition-opacity">
                                                         {isLoadingAudio && <Loader2 className="h-8 w-8 text-white animate-spin" />}
                                                         {isPlaying && !isLoadingAudio && <Pause className="h-8 w-8 text-white" />}
                                                         {!isPlaying && !isLoadingAudio && <Play className="h-8 w-8 text-white" />}
                                                     </div>
                                                </button>
                                                {/* Status text below button */}
                                                <div className="mt-2 text-xs h-4 flex items-center justify-center gap-1 text-gray-600">{isLoadingAudio && "Loading Audio..."}{isPlaying && !isLoadingAudio && "Playing..."}{!isPlaying && !isLoadingAudio && audioError && ""}{!isPlaying && !isLoadingAudio && !audioError && dailyContent.audioFilename && "(Tap to Play)"}</div>
                                                {/* Error text below button */}
                                                {audioError && !isLoadingAudio && ( <p className="text-xs text-red-500 mt-1 text-center w-full flex items-center justify-center gap-1"><AlertTriangle size={14} /> {audioError}</p> )}
                                            </div>
                                        ) : ( <p className="text-xs text-gray-400 mt-auto">(No audio)</p> )}
                                    </>
                                ) : ( <div className="flex flex-col items-center justify-center flex-grow"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /><p className="text-sm text-gray-500 mt-2">Loading...</p></div> )}
                             </CardContent>
                        </Card>
                    </div>

                    {/* --- Right Column --- */}
                    <div className="lg:col-span-2 space-y-6 flex flex-col">
                        <FoodVisualization className="order-1 lg:order-1" />
                        {/* Week Plan Card */}
                        <Card className="shadow-lg order-2 lg:order-2 flex-grow"> <CardHeader><CardTitle>Week {displayWeek}/{TOTAL_PROGRAM_WEEKS}: {currentWeekPlan?.title||'...'}</CardTitle><CardDescription>{currentWeekPlan?.subtitle||''}</CardDescription></CardHeader><CardContent><h4 className="...">Focus:</h4><ul className='...'>{(currentWeekPlan?.focusPoints||[]).map((p,i)=><li key={`f-${i}`}>{p}</li>)}{!currentWeekPlan?.focusPoints?.length&&<li>...</li>}</ul><h4 className="...">Tasks:</h4><ul className='...'>{(currentWeekPlan?.dailyTasks||[]).map((t,i)=><li key={`t-${i}`}>{t}</li>)}{!currentWeekPlan?.dailyTasks?.length&&<li>...</li>}</ul></CardContent></Card>
                        {/* Calendar Card */}
                        <Card className="shadow-lg order-3 lg:order-3 p-3"><CardContent className="p-0"><Calendar mode="single" selected={selectedDate} month={selectedDate} fromDate={startDate?new Date(startDate):undefined} toDate={startDate?new Date(new Date(startDate).setDate(new Date(startDate).getDate()+(TOTAL_PROGRAM_WEEKS*7)-1)):undefined} className="p-0" classNames={{day_selected: "...", day_today: "..."}}/></CardContent></Card>
                    </div>

                </div>
            </div>

            {/* Hidden Audio Element */}
            <audio ref={audioRef} onEnded={handleAudioEnded} onError={handleAudioError} onPlaying={handleAudioPlaying} onPause={handleAudioPause} />
        </div>
    );
};

export default Index;