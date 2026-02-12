"use client";
import { useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Battery, BatteryCharging, Zap, Coffee } from "lucide-react";

export default function EnergySlider() {
  const [value, setValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Smooth physics
  const springValue = useSpring(value, { stiffness: 200, damping: 25 });
  const width = useTransform(springValue, (v) => `${v}%`);

  // NEW COLOR PALETTE: "Cyber-Focus"
  // Slate (Low) -> Sky Blue (Med) -> Electric Violet (High) -> Hot Pink (Max)
  const color = useTransform(
    springValue,
    [0, 33, 66, 100],
    ["#94a3b8", "#38bdf8", "#8b5cf6", "#f472b6"] 
  );

  // Dynamic Glow
  const boxShadow = useTransform(
    springValue,
    [0, 100],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 25px rgba(139, 92, 246, 0.5)"]
  );

  const getFeedback = (val) => {
    if (val < 25) return { icon: <Battery className="w-4 h-4" />, text: "Low Battery", color: "text-slate-500" };
    if (val < 60) return { icon: <Coffee className="w-4 h-4" />, text: "Recharging", color: "text-sky-500" };
    if (val < 90) return { icon: <BatteryCharging className="w-4 h-4" />, text: "Focused", color: "text-violet-500" };
    return { icon: <Zap className="w-4 h-4" />, text: "Unstoppable", color: "text-pink-500" };
  };

  const feedback = getFeedback(value);

  return (
    <div className="w-full max-w-md mx-auto p-2">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Energy State</span>
          <motion.div 
            key={feedback.text}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`flex items-center gap-2 font-bold ${feedback.color}`}
          >
             {feedback.icon}
             <span>{feedback.text}</span>
          </motion.div>
        </div>
        <span className="text-3xl font-black text-slate-800 font-mono tracking-tighter">{value}%</span>
      </div>

      {/* TRACK */}
      <div className="relative h-12 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
        
        {/* LIQUID FILL */}
        <motion.div 
          style={{ width, backgroundColor: color, boxShadow }}
          className="absolute top-0 left-0 h-full rounded-r-2xl relative"
        >
           {/* Shine effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
           
           {/* Animated Striping */}
           <motion.div 
             animate={{ x: ["0%", "-20%"] }}
             transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
             className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)' }}
           />
        </motion.div>

        {/* INPUT */}
        <input 
          type="range" 
          min="0" max="100" 
          value={value}
          onChange={(e) => { setValue(Number(e.target.value)); springValue.set(Number(e.target.value)); }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
        />
      </div>

      <div className="flex justify-between mt-3 px-1">
         <div className="w-1 h-1 rounded-full bg-slate-300"></div>
         <div className="w-1 h-1 rounded-full bg-slate-300"></div>
         <div className="w-1 h-1 rounded-full bg-slate-300"></div>
         <div className="w-1 h-1 rounded-full bg-slate-300"></div>
         <div className="w-1 h-1 rounded-full bg-slate-300"></div>
      </div>
    </div>
  );
}