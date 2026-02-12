"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation'; 
import { CheckCircle, Circle, Play, Lock, Music, Coffee, Wind, Zap, Sparkles, Trophy, Home, User, Coins, X, ExternalLink } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  
  // 1. GET USER CONTEXT
  const { coins, setCoins, addToHistory } = useUser(); 

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Digitizing Thoughts...");
  const [showCelebration, setShowCelebration] = useState(false);
  const [message, setMessage] = useState(null); 
  
  // New: State for the Dopamine Menu Popup
  const [activeMenu, setActiveMenu] = useState(null);

  // --- 2. INTERACTIVE DOPAMINE MENU DATA ---
  const dopamineMenu = [
    { 
      id: 1, 
      icon: <Music className="w-5 h-5" />, 
      label: "Music Boost", 
      cost: 0, 
      costLabel: "Free",
      type: "interactive",
      options: [
        { label: "Spotify", url: "https://open.spotify.com", color: "bg-green-100 text-green-700" },
        { label: "Apple Music", url: "https://music.apple.com", color: "bg-red-100 text-red-700" },
        { label: "YouTube Music", url: "https://music.youtube.com", color: "bg-red-50 text-red-600" }
      ]
    },
    { 
      id: 2, 
      icon: <Coffee className="w-5 h-5" />, 
      label: "Hydrate", 
      cost: 0, 
      costLabel: "Free",
      type: "interactive",
      options: [
        { label: "Ice Cold Water", msg: "Refreshing choice! 💧", color: "bg-cyan-100 text-cyan-700" },
        { label: "Warm Tea", msg: "Cozy & Focused. 🍵", color: "bg-amber-100 text-amber-700" },
        { label: "Sparkling Water", msg: "Fancy! ✨", color: "bg-purple-100 text-purple-700" }
      ]
    },
    { 
      id: 3, 
      icon: <Wind className="w-5 h-5" />, 
      label: "3 Deep Breaths", 
      cost: 0, 
      costLabel: "Free",
      type: "instant",
      msg: "Inhale... Exhale... 🍃"
    },
    { 
      id: 4, 
      icon: <Zap className="w-5 h-5" />, 
      label: "YouTube Break", 
      cost: 50, 
      costLabel: "50 Coins",
      type: "interactive",
      options: [
        { label: "Satisfying Video", url: "https://www.youtube.com/results?search_query=satisfying+video", color: "bg-red-100 text-red-700" },
        { label: "Lofi Beats", url: "https://www.youtube.com/results?search_query=lofi+hip+hop", color: "bg-indigo-100 text-indigo-700" }
      ]
    },
    { 
      id: 5, 
      icon: <Trophy className="w-5 h-5" />, 
      label: "Buy a Snack", 
      cost: 100, 
      costLabel: "100 Coins",
      type: "instant",
      msg: "Treat yourself. You earned it. 🍫"
    }, 
  ];

  // --- 3. HANDLE MENU CLICKS ---
  const handleMenuClick = (item) => {
    if (coins < item.cost) {
      setMessage("Not enough coins! Keep working.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    if (item.type === "interactive") {
      setActiveMenu(item); 
    } else {
      setCoins(prev => prev - item.cost);
      setMessage(item.msg);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleOptionClick = (option) => {
    if (activeMenu.cost > 0) {
      setCoins(prev => prev - activeMenu.cost);
    }
    setActiveMenu(null);

    if (option.url) {
      window.open(option.url, '_blank');
      setMessage(`Opening ${option.label}...`);
    } else {
      setMessage(option.msg);
    }
    setTimeout(() => setMessage(null), 2000);
  };

  // --- 4. INITIAL FETCH ---
  useEffect(() => {
    const texts = ["Digitizing Thoughts...", "Analyzing Complexity...", "Constructing Logic...", "AI Reality: Active."];
    let i = 0;
    const textInterval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 1200);

    const currentTask = localStorage.getItem("userTask") || "Clean my room";
    
    async function fetchBreakdown() {
      try {
        const res = await fetch('/api/decompose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: currentTask }),
        });
        const data = await res.json();
        if (data.tasks) {
          setTasks(data.tasks.map((t, idx) => ({ ...t, status: idx === 0 ? 'active' : 'pending' })));
        }
      } catch (error) {
        console.error("Failed to load tasks", error);
      } finally {
        setTimeout(() => { clearInterval(textInterval); setLoading(false); }, 3500);
      }
    }
    fetchBreakdown();
    return () => clearInterval(textInterval);
  }, []);

  // --- 5. CHECKLIST COMPLETION LOGIC ---
  const handleTaskComplete = (id) => {
    // Find the task
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    const task = tasks[taskIndex];

    // If it's already done or locked, ignore
    if (task.status !== 'active') return;

    // 1. REWARD & SAVE TO PROFILE
    setCoins(c => c + 20); // Safe update
    
    if (addToHistory) {
      addToHistory(`${task.text} — Completed`); 
    }

    // 2. UNLOCK NEXT TASK
    setTasks(prev => {
      const newTasks = [...prev];
      
      // Mark current as completed
      newTasks[taskIndex] = { ...newTasks[taskIndex], status: 'completed' };

      // Unlock next
      if (taskIndex + 1 < newTasks.length) {
         newTasks[taskIndex + 1].status = 'active';
      } else {
         setTimeout(() => setShowCelebration(true), 500);
      }
      return newTasks;
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 md:p-12 pt-24 relative overflow-hidden">
      
      {/* TOAST MESSAGE */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[110] bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-violet-400" /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL FOR INTERACTIVE MENU */}
      <AnimatePresence>
        {activeMenu && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[105] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setActiveMenu(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            {activeMenu.icon} {activeMenu.label}
                        </h3>
                        <button onClick={() => setActiveMenu(null)} className="p-2 hover:bg-slate-100 rounded-full">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {activeMenu.options.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleOptionClick(opt)}
                                className={`w-full p-4 rounded-xl text-left font-bold transition-transform hover:scale-[1.02] flex items-center justify-between ${opt.color || 'bg-slate-50 text-slate-700'}`}
                            >
                                {opt.label}
                                {opt.url && <ExternalLink className="w-4 h-4 opacity-50" />}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* CELEBRATION OVERLAY */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
          >
             <motion.div 
               initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
               className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full"
             >
                <div className="mx-auto bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                   <Trophy className="w-12 h-12 text-yellow-500 fill-yellow-500 animate-bounce" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Mission Complete!</h2>
                <p className="text-slate-500 mb-8">You crushed it. The dopamine is real.</p>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                >
                  <Home className="w-5 h-5" /> Go Home
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Control</span>
          </h1>
          <p className="text-slate-500 text-lg">Focus on one step. Forget the rest.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200 shadow-sm">
              <Coins className="w-5 h-5 text-yellow-600 fill-yellow-600" />
              <span className="font-bold text-yellow-800 text-lg">{coins}</span>
            </div>
            <button onClick={() => router.push('/profile')} className="group flex items-center gap-3 bg-white p-2 pr-4 rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200 transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilot</div>
                <div className="text-sm font-bold text-slate-800">Manzar</div>
              </div>
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: TASKS */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Play className="w-5 h-5 text-violet-600" /> Current Path
          </h2>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 h-96 border-2 border-dashed border-violet-100 rounded-3xl bg-white/50 relative overflow-hidden"
              >
                 <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative z-10">
                    <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
                        <motion.path d="M 60 100 L 20 200 H 180 L 140 100 Z" fill="url(#beamGradient)" initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 0.6, scaleY: 1 }} transition={{ delay: 1.5, duration: 0.5 }} style={{ originY: 0 }} />
                        <defs><linearGradient id="beamGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" /><stop offset="100%" stopColor="#d946ef" stopOpacity="0" /></linearGradient></defs>
                        <motion.path d="M 70 80 Q 100 40 130 80" fill="transparent" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                        <motion.path d="M 40 80 Q 100 110 160 80 Q 100 60 40 80 Z" fill="#ffffff" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                        <motion.ellipse cx="100" cy="80" rx="60" ry="15" fill="#c4b5fd" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5, duration: 0.5 }} className="blur-md" />
                    </svg>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: "spring" }} className="absolute -top-4 -right-4">
                        <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-100 animate-pulse" />
                    </motion.div>
                 </motion.div>
                 <div className="mt-8 text-center h-8">
                     <AnimatePresence mode="wait">
                         <motion.p key={loadingText} initial={{ y: 20, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(5px)" }} className="text-violet-600 font-bold font-mono text-lg uppercase tracking-widest">{loadingText}</motion.p>
                     </AnimatePresence>
                 </div>
              </motion.div>
            ) : (
              <div className="relative border-l-4 border-violet-100 ml-3 space-y-8 pl-8">
                {tasks.map((task, index) => (
                  <motion.div 
                    key={task.id}
                    layout 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <motion.div 
                      animate={{ 
                        backgroundColor: task.status === 'completed' ? '#22c55e' : task.status === 'active' ? '#7c3aed' : '#cbd5e1',
                        scale: task.status === 'active' ? 1.05 : 1
                      }}
                      className="absolute -left-[41px] top-9 w-6 h-6 rounded-full border-4 border-[#F8FAFC] z-10"
                    />

                    <motion.div 
                      className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden flex items-center justify-between gap-4
                        ${task.status === 'active' ? 'shadow-2xl shadow-violet-200/50 ring-4 ring-violet-50 bg-white border-violet-200' : 'bg-white border-slate-100'}
                        ${task.status === 'completed' ? 'opacity-60 grayscale-[0.5]' : ''}
                        ${task.status === 'pending' ? 'blur-[1px] opacity-70 select-none' : ''}
                      `}
                    >
                      <div className="flex-1">
                         <h3 className={`text-lg font-bold transition-all duration-300 ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                           {task.text}
                         </h3>
                      </div>
                      
                      {/* ACTION ICONS: CHECKLIST LOGIC */}
                      <div>
                        {task.status === 'completed' ? (
                            <CheckCircle className="w-7 h-7 text-green-500" />
                        ) : task.status === 'active' ? (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleTaskComplete(task.id)}
                                className="w-8 h-8 rounded-full border-2 border-violet-500 flex items-center justify-center bg-violet-50 text-violet-600 hover:bg-violet-500 hover:text-white transition-colors"
                            >
                                <Circle className="w-5 h-5" />
                            </motion.button>
                        ) : (
                            <Lock className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* --- RIGHT: INTERACTIVE STORE --- */}
        <div className="lg:col-span-5">
           <div className="bg-white rounded-3xl p-8 shadow-xl border border-fuchsia-50 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-fuchsia-500" /> Dopamine Store
                 </h2>
                 <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">Recharge</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {dopamineMenu.map((item) => (
                    <motion.div 
                        key={item.id} 
                        onClick={() => handleMenuClick(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all cursor-pointer group hover:shadow-lg relative overflow-hidden
                           ${coins < item.cost ? 'opacity-50 grayscale' : 'bg-white hover:border-fuchsia-200'}
                        `}
                    >
                       <div className={`p-3 rounded-full ${coins < item.cost ? 'bg-slate-200 text-slate-400' : 'bg-fuchsia-50 text-fuchsia-600'}`}>
                          {coins < item.cost ? <Lock className="w-5 h-5" /> : item.icon}
                       </div>
                       <div className="text-center">
                          <span className="text-sm font-bold block text-slate-700">{item.label}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 inline-block ${item.cost === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {item.costLabel}
                          </span>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}