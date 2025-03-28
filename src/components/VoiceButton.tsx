import React, { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";

interface VoiceButtonProps {
  text: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clean up any active speech when component unmounts
  useEffect(() => {
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
    
    // Set properties for better voice quality
    utterance.rate = 0.9; // Slightly slower than default
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Handle when speech ends
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    // Start speaking
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`rounded-full p-2 flex items-center justify-center ${
        isSpeaking ? 'bg-rightstep-green text-white' : 'bg-white/20 text-white hover:bg-white/30'
      }`}
      aria-label={isSpeaking ? "Stop voice" : "Listen"}
    >
      <Volume2 className="h-5 w-5" />
    </button>
  );
};

export default VoiceButton;