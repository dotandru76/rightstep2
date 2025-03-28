import React, { useState, useEffect } from "react";

// Function to ensure voices are loaded
const loadVoices = () => {
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    // Check if voices are already loaded
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    // If not loaded, wait for the voiceschanged event
    const voicesChanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
      window.speechSynthesis.removeEventListener('voiceschanged', voicesChanged);
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', voicesChanged);
  });
};

// Function to find the best female voice
const getFemaleVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  console.log("Available voices:", voices.map(v => v.name));
  
  // First try to find specific female voices we know work well
  for (const name of ['Google UK English Female', 'Microsoft Zira', 'Samantha', 'Victoria']) {
    const voice = voices.find(v => v.name.includes(name));
    if (voice) {
      console.log("Selected voice:", voice.name);
      return voice;
    }
  }
  
  // Then try to find any voice with 'female' in the name
  const femaleVoice = voices.find(v => 
    v.name.toLowerCase().includes('female') || 
    v.name.toLowerCase().includes('girl') ||
    v.name.toLowerCase().includes('woman')
  );
  
  if (femaleVoice) {
    console.log("Selected female voice:", femaleVoice.name);
    return femaleVoice;
  }
  
  // If no female voice found, pick first English voice or any voice
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  
  console.log("Selected fallback voice:", (englishVoice || voices[0])?.name);
  return englishVoice || voices[0];
};

interface VoiceButtonProps {
  text: string;
  showTrainer?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ text, showTrainer = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Prefetch voices when component mounts
  useEffect(() => {
    // Try to load voices right away
    window.speechSynthesis.getVoices();
    
    // Clean up any active speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    // Create utterance with the provided text
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get female voice
    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Set properties for better voice quality
    utterance.rate = 0.9;    // Slightly slower
    utterance.pitch = 1.3;   // Higher pitch for more feminine voice
    utterance.volume = 1;
    
    // Handle when speech ends
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    // Start speaking
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (showTrainer) {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={speak}
          className={`w-24 h-24 rounded-full overflow-hidden transition-transform ${isSpeaking ? 'scale-110' : 'hover:scale-105'}`}
          aria-label={isSpeaking ? "Stop voice" : "Listen"}
        >
          <img 
            src="/public/lovable-uploads/trainer.png" 
            alt="Trainer" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Ccircle cx='50' cy='35' r='25' fill='%23f9a8d4'/%3E%3Cpath d='M50 65 C30 65 15 80 15 100 L85 100 C85 80 70 65 50 65 Z' fill='%23f9a8d4'/%3E%3C/svg%3E";
            }}
          />
        </button>
        <span className="text-sm text-center mt-2 text-white font-medium">Please press on me</span>
      </div>
    );
  }

  return (
    <button
      onClick={speak}
      className={`rounded-full p-2 flex items-center justify-center ${
        isSpeaking ? 'bg-rightstep-green text-white' : 'bg-white text-rightstep-green hover:bg-green-50'
      } shadow-sm`}
      aria-label={isSpeaking ? "Stop voice" : "Listen"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
    </button>
  );
};

export default VoiceButton;