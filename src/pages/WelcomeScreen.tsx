// src/pages/WelcomeScreen.tsx - Improved with larger images and animation

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
        if (isSpeaking || isFadingOut) return;
        
        setIsSpeaking(true);
        setIsIntroFinished(false);
        setIsFadingOut(true);

        // Smooth transition timing
        setTimeout(() => {
            setImageToShow('team');
            setIsFadingOut(false);
            setIsIntroFinished(true);
            setIsSpeaking(false);
        }, 800);

        // TODO: Implement actual TTS functionality here
    };

    const handleGetStarted = () => {
        navigate('/onboarding');
    };

    useEffect(() => {
        // Any initialization logic can go here
    }, []);

    return (
        <div className="min-h-screen bg-lime-500 flex flex-col items-center justify-between text-white">
            {/* Purple top bar in second image */}
            {imageToShow === 'team' && (
                <div className="w-full h-6 bg-purple-800 absolute top-0 left-0"></div>
            )}
            
            {/* Top section with logo */}
            <div className="pt-8 w-full text-center">
                <div className="text-center mb-2">
                    <span className="text-xs text-white/80">
                        {imageToShow === 'team' ? 'COACHING' : ''}
                    </span>
                </div>
                <div>
                    <span className="text-xl font-medium">RightStep</span>
                </div>
            </div>

            {/* Middle section with main content - exactly centered */}
            <div className="flex-grow flex flex-col items-center justify-center -mt-10">
                {/* Character container - simplified */}
                <div className="relative mb-10">
                    {/* Robot image - first state with flashing animation */}
                    <div 
                        className={`transition-opacity duration-500 ${
                            imageToShow === 'robot' && !isFadingOut ? 'opacity-100' : 'opacity-0 absolute'
                        }`}
                    >
                        <button
                            onClick={playIntroduction}
                            disabled={isSpeaking || isFadingOut}
                            className="cursor-pointer focus:outline-none relative animate-pulse-slow"
                            aria-label="Start Introduction"
                        >
                            <img
                                src="/lovable-uploads/robot_hello.png"
                                alt="RightStep Robot Assistant"
                                className="h-64 w-auto object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = '/assets/fallback-robot.png';
                                    toast.error("Couldn't load robot image");
                                }}
                            />
                        </button>
                    </div>

                    {/* Team members - second state */}
                    <div 
                        className={`transition-opacity duration-500 ${
                            imageToShow === 'team' && !isFadingOut ? 'opacity-100' : 'opacity-0 absolute'
                        }`}
                    >
                        {/* Team layout with all 3 members */}
                        <div className="flex justify-center items-center">
                            {/* Robot */}
                            <div className="mr-2">
                                <img
                                    src="/lovable-uploads/robot_hello.png"
                                    alt="Robot Assistant"
                                    className="h-52 w-auto object-contain"
                                    onError={(e) => { e.currentTarget.src = '/assets/fallback-robot.png'; }}
                                />
                            </div>
                            
                            {/* Motivation Guy */}
                            <div className="mr-2">
                                <img
                                    src="/lovable-uploads/Motivation Guy pose 1.png"
                                    alt="Motivation Guy"
                                    className="h-52 w-auto object-contain" 
                                    onError={(e) => { toast.error("Couldn't load motivation guy image"); }}
                                />
                            </div>
                            
                            {/* Trainer Woman */}
                            <div>
                                <img
                                    src="/lovable-uploads/Trainer welcom.png"
                                    alt="Trainer Woman"
                                    className="h-52 w-auto object-contain" 
                                    onError={(e) => { toast.error("Couldn't load trainer image"); }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title/Greeting - exact positioning */}
                <h1 className="text-2xl font-bold text-center">
                    Welcome to RightStep!
                </h1>

                {/* Description - exact text and width */}
                <p className="text-center text-white text-sm max-w-xs mt-1 mb-10 mx-auto">
                    Your 12-week journey to better health and hormonal
                    <br />balance starts here.
                </p>

                {/* Button container */}
                <div className="h-16 flex items-center justify-center">
                    {isIntroFinished && (
                        <Button
                            onClick={handleGetStarted}
                            variant="outline"
                            className="bg-white text-lime-600 hover:bg-white/90 font-medium px-6 py-1 rounded-full shadow transition-all border-0"
                        >
                            Let's Start <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Footer area */}
            <div className="pb-4 text-xs opacity-70">
                RightStep v1.0
            </div>
        </div>
    );
};

export default WelcomeScreen;