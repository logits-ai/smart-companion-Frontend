"use client";
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/UserContext'; 
import { useRouter } from 'next/navigation';
import DopamineMenu from '@/components/DopamineMenu'; // Ensure you have this component created!
import { 
  Mic, MicOff, ArrowRight, Type, Sparkles, BrainCircuit, 
  User, HelpCircle, Flag, Mail, X, Trash2, Search, Camera, Zap, 
  Unlock, ChevronRight, Lock 
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// --- COMPONENT 1: LIQUID PLASMA ENERGY SLIDER ---
const LiquidEnergySlider = ({ value, onChange }) => {
  const getColor = (val) => {
    if (val < 30) return "from-blue-400 to-cyan-300"; 
    if (val < 70) return "from-indigo-500 to-purple-400"; 
    return "from-pink-500 to-rose-500"; 
  };

  return (
    <div className="w-full relative h-12 flex items-center justify-center">
      <div className="absolute left-4 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider pointer-events-none">
        Energy Level
      </div>
      <div className="absolute inset-0 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
        <motion.div 
          className={`h-full bg-gradient-to-r ${getColor(value)} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        >
           <motion.div 
             animate={{ x: ["0%", "100%"] }}
             transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full" 
           />
           <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_white]"></div>
        </motion.div>
      </div>
      <input 
        type="range" min="0" max="100" value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />
      <div className="absolute right-4 z-10 font-bold text-slate-600 pointer-events-none">{value}%</div>
    </div>
  );
};

// --- COMPONENT 2: FUTURISTIC SLIDE-TO-UNLOCK ---
const SlideToUnlock = ({ onUnlock, isUnlocked }) => {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const backgroundOpacity = useTransform(x, [0, 260], [0, 1]);

  return (
    <div className="relative w-full h-16 bg-slate-100/50 backdrop-blur-sm rounded-full border border-slate-200 shadow-inner overflow-hidden flex items-center p-1" ref={constraintsRef}>
      
      {/* Dynamic Background Fill */}
      <motion.div 
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20"
      />
      
      {/* Text Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <AnimatePresence mode="wait">
            {isUnlocked ? (
               <motion.div 
                 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                 className="flex items-center gap-2 text-emerald-600 font-bold tracking-widest uppercase"
               >
                  <Unlock size={18} /> Access Granted
               </motion.div>
            ) : (
               <motion.div 
                 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                 className="flex items-center gap-2 text-slate-400 font-medium tracking-widest text-sm uppercase"
               >
                  Slide to Recharge <ChevronRight size={16} className="animate-pulse" />
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Draggable Handle */}
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={(event, info) => {
           if (info.offset.x > 200) { // Threshold to unlock
              onUnlock();
           } 
        }}
        style={{ x, backgroundColor: isUnlocked ? "#10b981" : "#4f46e5" }}
        animate={isUnlocked ? { x: "calc(100% - 10px)" } : { x: 0 }}
        className="relative z-10 w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
      >
         {isUnlocked ? <Zap className="text-white w-6 h-6 fill-white" /> : <ChevronRight className="text-white w-8 h-8" />}
         <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const { toggleFont, isDyslexic } = useUser();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Energy State
  const [energyLevel, setEnergyLevel] = useState(50);
  
  // Dopamine Menu State
  const [showDopamine, setShowDopamine] = useState(false);

  // Menu Hover Logic
  const [showMenu, setShowMenu] = useState(false);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 300);
  };

  // Voice & Greeting
  const [isListening, setIsListening] = useState(false);
  const [greeting, setGreeting] = useState("Hello");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const hours = new Date().getHours();
    const name = "Manzar"; 
    let timeGreeting = "Good morning";
    if (hours >= 12) timeGreeting = "Good afternoon";
    if (hours >= 17) timeGreeting = "Good evening";
    setGreeting(`Hi ${name}, ${timeGreeting.toLowerCase()}!`);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; 
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        setInput(transcript);
      };
      recognitionRef.current.onend = () => { if (isListening) setIsListening(false); };
    }
  }, [isListening]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return alert("Browser not supported");
    isListening ? (recognitionRef.current.stop(), setIsListening(false)) : (recognitionRef.current.start(), setIsListening(true));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (!input.trim()) return;
    localStorage.setItem("userTask", input);
    router.push("/dashboard");
  };

  const handleUnlock = () => {
    setShowDopamine(true); 
    // Auto-scroll to menu
    setTimeout(() => {
      document.getElementById('dopamine-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 ${isDyslexic ? 'font-dyslexic' : ''}`}>
      
      {/* ==================== 1. HOVER MENU ==================== */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 mx-4 ring-1 ring-black/5">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <BrainCircuit className="w-5 h-5 text-indigo-600" />
                     </div>
                     <h3 className="font-bold text-slate-800 text-sm">System Menu</h3>
                  </div>
               </div>
               <div className="p-2 space-y-1">
                  {[
                    { icon: HelpCircle, title: "Help Guide", sub: "Task decomposition tips" },
                    { icon: Flag, title: "Report Issue", sub: "Found a bug?" },
                    { icon: Mail, title: "Contact Us", sub: "Get in touch" }
                  ].map((item, idx) => (
                    <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors group text-left">
                       <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                       <div>
                          <div className="font-bold text-sm text-slate-700 group-hover:text-indigo-700">{item.title}</div>
                          <div className="text-[10px] text-slate-400">{item.sub}</div>
                       </div>
                    </button>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 2. MAIN UI ==================== */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(79,70,229,0.15),transparent_70%)]"></div>
             
             <div className="relative flex items-center justify-center">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute w-64 h-64 rounded-full border-[1px] border-indigo-500/30 border-t-indigo-500 border-b-transparent"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    className="absolute w-48 h-48 rounded-full border-[1px] border-purple-500/30 border-r-purple-500 border-l-transparent"
                />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-20 h-20 bg-indigo-600 rounded-full blur-xl absolute"
                />
                <motion.div 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.5 }}
                   className="relative z-10 bg-black p-4 rounded-full border border-indigo-500/50 shadow-[0_0_50px_rgba(79,70,229,0.5)]"
                >
                   <BrainCircuit className="w-12 h-12 text-white" />
                </motion.div>
             </div>

             <div className="mt-12 space-y-2 text-center z-10">
                 <motion.h1 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 1 }}
                    className="text-3xl font-bold text-white tracking-[0.2em]"
                 >
                    SAHAYAK NEO
                 </motion.h1>
                 <motion.div 
                    className="flex gap-1 justify-center"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 1.5 }}
                 >
                     <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></span>
                     <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                     <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-300"></span>
                 </motion.div>
             </div>
          </motion.div>
        ) : (
          <motion.main
            key="home"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-start pt-28 p-6 relative"
          >
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            <div className="absolute top-6 right-6 flex gap-3 z-50">
               <button onClick={() => router.push('/profile')} className="p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-all"><User className="w-5 h-5 text-slate-600" /></button>
               <button onClick={toggleFont} className="p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-all"><Type className="w-5 h-5 text-slate-600" /></button>
            </div>

            <div className="text-center mb-8 z-10 relative max-w-3xl mx-auto">
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 border border-white/60 mb-6 backdrop-blur-sm shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-slate-600">System Online</span>
              </motion.div>

              <motion.div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer inline-block p-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                  <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Sahayak <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Neo</span>
                  </h1>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-xl md:text-2xl text-slate-600 font-medium max-w-xl mx-auto mt-2">
                {greeting}
              </motion.p>
            </div>

            {/* INPUT SECTION */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="relative w-full max-w-2xl group z-20">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur transition duration-500 ${isListening ? 'opacity-50 animate-pulse' : 'group-hover:opacity-40'}`}></div>
              <div className="relative">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "What's on your mind?"}
                  className={`w-full h-40 pl-6 pr-6 py-6 rounded-[1.4rem] bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl text-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all ${isListening ? 'bg-indigo-50/50' : ''}`}
                />
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                            <Camera className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                             <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {input && (
                            <motion.button 
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setInput('')}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* CONTROLS ROW */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="w-full max-w-2xl mt-6 z-10 flex flex-col gap-6">
                <div className="flex gap-4 items-center">
                   
                   <motion.button 
                      onClick={toggleVoiceInput}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-20 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md border border-white/50 ${isListening ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white/60 text-slate-600 hover:bg-white/80'}`}
                   >
                      {isListening && <span className="absolute inset-0 rounded-2xl animate-ping bg-indigo-500 opacity-30"></span>}
                      {isListening ? <Mic className="w-6 h-6 animate-bounce" /> : <MicOff className="w-6 h-6" />}
                   </motion.button>

                   <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-white/50">
                      <LiquidEnergySlider value={energyLevel} onChange={setEnergyLevel} />
                   </div>

                </div>

                <button disabled={!input} onClick={handleStart} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Sparkles className="w-5 h-5 text-yellow-300" /> Deconstruct Task <ArrowRight className="w-5 h-5" />
                </button>

                {/* === FUTURISTIC SLIDER ACCESS === */}
                <div className="pt-8 border-t border-slate-200/60 w-full" id="dopamine-section">
                
                  {/* The Slide-to-Unlock Component */}
                  <div className="mb-6">
                     <SlideToUnlock onUnlock={handleUnlock} isUnlocked={showDopamine} />
                  </div>

                  <AnimatePresence>
                    {showDopamine && (
                      <motion.div 
                          initial={{ height: 0, opacity: 0, scale: 0.95 }} 
                          animate={{ height: "auto", opacity: 1, scale: 1 }} 
                          exit={{ height: 0, opacity: 0, scale: 0.95 }} 
                          className="overflow-hidden origin-top"
                      >
                         <DopamineMenu /> 
                         
                         {/* Close Button */}
                         <div className="text-center mt-4">
                            <button onClick={() => setShowDopamine(false)} className="text-xs text-slate-400 hover:text-red-500 font-bold uppercase tracking-wider">
                               Close Secure Menu
                            </button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

            </motion.div>

          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}