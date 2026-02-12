// src/hooks/useVoiceInput.js
import { useState, useEffect, useRef } from 'react';

const useVoiceInput = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening if user pauses
      recognitionRef.current.interimResults = true; // Show text as you speak
      recognitionRef.current.lang = 'en-US'; 

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        // Optional: auto-restart if you want "always on" mode, 
        // but usually we let it stop naturally or by user toggle.
        if (isListening) {
             // setIsListening(false); 
        }
      };
    }
  }, [isListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { text, isListening, startListening, stopListening, setText };
};

export default useVoiceInput;