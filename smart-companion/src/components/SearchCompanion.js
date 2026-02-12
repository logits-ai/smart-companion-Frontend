// src/components/SearchCompanion.js
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, Mic, MicOff } from 'lucide-react';
import useVoiceInput from '../hooks/useVoiceInput'; // Adjust path if needed

const SearchCompanion = ({ userName = "User" }) => {
  const { text, isListening, startListening, stopListening, setText } = useVoiceInput();

  // Handle manual typing
  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const toggleVoiceMode = () => {
    isListening ? stopListening() : startListening();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8 mt-10">
      
      {/* 1. Greeting Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Hi {userName},
        </h1>
        <p className="text-gray-500 text-lg">How may I help you today?</p>
      </motion.div>

      <div className="flex items-center gap-4">
        
        {/* 2. Main Search Input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder={isListening ? "Listening..." : "Type a task..."}
            className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all outline-none text-lg shadow-sm ${
              isListening 
                ? "bg-blue-50 border-blue-400 dark:bg-gray-800 dark:border-blue-500" 
                : "bg-white border-gray-100 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
            }`}
          />

          {/* Delete Button (Only visible if text exists) */}
          <AnimatePresence>
            {text.length > 0 && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => setText("")}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Voice Switch */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleVoiceMode}
          className={`relative h-14 w-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isListening ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700'
          }`}
        >
          {/* Pulse Animation */}
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-blue-500 rounded-full"
            />
          )}
          
          <div className="z-10 text-blue-600 dark:text-blue-400">
            {isListening ? <Mic size={24} /> : <MicOff size={24} className="text-gray-500" />}
          </div>
        </motion.button>

      </div>
    </div>
  );
};

export default SearchCompanion;