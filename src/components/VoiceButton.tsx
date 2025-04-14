import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function to detect Android WebView
const isAndroidWebView = () => {
  // Check if running in a mobile environment (WebView)
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf('android') > -1;
};

interface VoiceButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ text, size = 'sm' }) => {
  const isAndroid = isAndroidWebView();

  const handleClick = () => {
    if (isAndroid) {
      console.log("Speech synthesis disabled on Android");
      return;
    }

    try {
      // Check if speechSynthesis is available
      if (!window.speechSynthesis) {
        console.error("Speech synthesis not available");
        return;
      }
      
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create utterance with the text
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find available voices safely
      let voices = [];
      try {
        voices = window.speechSynthesis.getVoices() || [];
      } catch (err) {
        console.warn("Could not get voices:", err);
      }
      
      // Only proceed with voice selection if voices are available
      if (voices && voices.length > 0) {
        // Try to find a good female voice
        const femaleVoices = voices.filter(v => 
          v.name.includes("female") || 
          v.name.includes("Female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria")
        );
        
        if (femaleVoices.length > 0) {
          utterance.voice = femaleVoices[0];
        }
      }
      
      // Set properties for more feminine voice
      utterance.rate = 0.85;   // Slightly slower
      utterance.pitch = 1.4;   // Higher pitch
      utterance.volume = 1;
      
      // Speak
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis error:", err);
      // Silently fail - don't alert as it's not critical functionality
    }
  };

  // If on Android, disable the button to prevent issues
  if (isAndroid) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className={`opacity-50 ${size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'}`}
        disabled={true}
      >
        <Volume2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleClick}
      className={size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'}
    >
      <Volume2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
    </Button>
  );
};

export default VoiceButton;