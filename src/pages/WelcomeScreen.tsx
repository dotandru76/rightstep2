// src/pages/WelcomeScreen.tsx - Attempting to Replicate Example Image Layout

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RightFootIcon from '@/components/RightFootIcon';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';

const ROBOT_SCRIPT = `Welcome to RightStep! I'm your digital guide for this 12-week program focused on building healthy habits and achieving hormonal balance with the Leptin Way. The RightStep Team is here to guide you: The Motivation Guy keeps you inspired. The Trainer Woman provides your plan and diet. And I'll help you use this app. Ready to begin? Let's set up your profile!`;

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const [isIntroFinished, setIsIntroFinished] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [imageToShow, setImageToShow] = useState<'robot' | 'team'>('robot');
    const [isFadingOut, setIsFadingOut] = useState(false);

    const playIntroduction = async () => {
        if (isSpeaking || isFadingOut) { return; }
        console.log("[Visual Debug] Attempting to play intro / start transition...");
        setIsSpeaking(true);
        setIsIntroFinished(false);

        console.log("[Visual Debug] Starting fade out (simulation - TTS disabled)...");
        setIsFadingOut(true);

        setTimeout(() => {
            console.log("[Visual Debug] Fade out finished. Swapping image and showing button.");
            setImageToShow('team');
            setIsFadingOut(false);
            setIsIntroFinished(true);
            setIsSpeaking(false);
        }, 2000);

        // --- REAL TTS CALL - REMAINS COMMENTED OUT ---
        /* ... */
        // --- END OF COMMENTED OUT TTS ---
    };

    const handleGetStarted = () => { /* ... same code ... */ };
    useEffect(() => { /* ... same code ... */ }, []);

    console.log("--- Rendering WelcomeScreen (Replicating Example) ---");

    return (
        <div className="min-h-screen bg-rightstep-gradient flex flex-col items-center justify-center p-6 text-white space-y-3"> {/* Adjusted spacing */}

            {/* Logo - Kept large size */}
            <RightFootIcon
                className="h-48 w-48 lg:h-56 lg:w-56 text-white opacity-90 drop-shadow-lg mb-1" // Reduced margin
            />

            {/* Container to help structure the overlapping elements */}
            <div className="flex flex-col items-center my-2"> {/* Reduced margin */}

                {/* --- Background Circle Div --- */}
                {/* Smaller size, adjust bg color as needed */}
                <div className="w-40 h-40 rounded-full bg-cyan-800 shadow-lg"></div> {/* Example: bg-cyan-800 */}
                {/* -------------------------- */}

                {/* --- Robot Image Button (Overlaps Circle) --- */}
                {/* Rendered *after* circle, pulled UP with negative margin */}
                {(imageToShow === 'robot' || isFadingOut) && (
                    <button
                        onClick={playIntroduction}
                        disabled={isSpeaking || isFadingOut}
                        // *** NEGATIVE MARGIN FOR OVERLAP - ADJUST VALUE AS NEEDED ***
                        className={`flex items-center justify-center -mt-28 cursor-pointer focus:outline-none rounded-full group transition-opacity ease-in-out duration-[2000ms] ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
                        aria-label="Start Introduction"
                    >
                        <img
                            src="/lovable-uploads/robot_hello.png"
                            alt="RightStep Robot Assistant saying hello"
                            // Image size - adjust if needed
                            className={`w-56 h-auto object-contain ${isFadingOut ? '' : 'animate-pulse-glow'}`}
                            onError={(e) => { /* ... */ }}
                        />
                    </button>
                )}
                {/* ------------------------------------------- */}

                {/* --- Team Image Div (Overlaps Circle) --- */}
                 {/* Rendered *after* circle when active, pulled UP with negative margin */}
                {imageToShow === 'team' && !isFadingOut && (
                     <div
                        // *** Use same negative margin for consistent position ***
                        className="flex items-center justify-center -mt-28"
                     >
                        <img
                            src="/lovable-uploads/All Team.png"
                            alt="The RightStep Team: Robot, Motivation Guy, Trainer Woman"
                             // Consistent image size
                            className="w-56 h-auto object-contain"
                            onError={(e) => { /* ... */ }}
                        />
                    </div>
                )}
                {/* ---------------------------------------- */}

            </div>

            {/* Title/Greeting - Adjust spacing relative to image block */}
            <h1 className="text-3xl lg:text-4xl font-bold text-center -mt-4">Welcome to RightStep!</h1> {/* Adjust negative margin */}

            {/* Conditional Button */}
            <div className="h-16 flex items-center justify-center mt-2">
                {isIntroFinished && (
                    <Button /* ... Button JSX ... */ >
                        Let's Start <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default WelcomeScreen;