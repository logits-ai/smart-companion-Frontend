"use client";
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Utensils, Zap, ShoppingBag, Lock, X, Droplets, Check 
} from 'lucide-react';

const DopamineMenu = () => {
  const { coins, charges, useCharge, buyItem, rechargeMenu } = useUser();
  const [activePopup, setActivePopup] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const favorites = {
    food: [ { name: "Dark Chocolate", icon: "🍫" }, { name: "Almonds", icon: "🥜" }, { name: "Protein Bar", icon: "bars" }, { name: "Spicy Chips", icon: "🌶️" } ],
    water: [ { name: "Lemon Water", icon: "🍋" }, { name: "Green Tea", icon: "🍵" }, { name: "Cold Brew", icon: "☕" }, { name: "Sparkling Water", icon: "🫧" } ]
  };

  const handleOpenSpotify = () => {
    if (useCharge()) window.open('https://open.spotify.com', '_blank');
    else setActivePopup('store');
  };

  const handleOpenPopup = (type) => {
    if (useCharge()) setActivePopup(type);
    else setActivePopup('store');
  };

  const handleBuyRecharge = (cost, amount) => {
    if (buyItem(cost)) {
      rechargeMenu(amount);
      setActivePopup(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/50 backdrop-blur-xl rounded-[2rem] border border-white/60 p-4 shadow-xl">
      
      {/* 1. STATUS CARD */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-white shadow-lg mb-4 flex justify-between items-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
         
         <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><Zap size={20} fill="currentColor" className="text-yellow-300" /></div>
            <div>
               <p className="text-[10px] uppercase font-bold opacity-70">Neuro-Coins</p>
               <p className="text-xl font-mono font-bold">{coins}</p>
            </div>
         </div>
         
         <div className="relative z-10 flex items-center gap-2">
             <div className="text-right mr-2">
               <p className="text-[10px] uppercase font-bold opacity-70">Charges</p>
               <p className={`text-xl font-mono font-bold ${charges === 0 ? 'text-red-300' : 'text-cyan-300'}`}>{charges}</p>
             </div>
             <button onClick={() => setActivePopup('store')} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition border border-white/30">
                <ShoppingBag size={18} />
             </button>
         </div>
      </div>

      {/* 2. MENU GRID */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        <MenuCard title="Music" icon={Music} color="green" onClick={handleOpenSpotify} isLocked={charges === 0} />
        <MenuCard title="Hydrate" icon={Droplets} color="cyan" onClick={() => handleOpenPopup('water')} isLocked={charges === 0} />
        <MenuCard title="Snack" icon={Utensils} color="orange" onClick={() => handleOpenPopup('food')} isLocked={charges === 0} />
      </div>

      {/* 3. POPUPS */}
      <AnimatePresence>
        {(activePopup === 'food' || activePopup === 'water') && (
          <Modal onClose={() => setActivePopup(null)} title={activePopup === 'food' ? "Snack Bar" : "Hydration Station"}>
             <div className="grid grid-cols-2 gap-3">
                {favorites[activePopup].map((item, idx) => (
                   <button key={idx} onClick={() => { setSelectedItem(item.name); setActivePopup(null); }} className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition flex flex-col items-center gap-2 group">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="font-bold text-slate-700 text-xs text-center">{item.name}</span>
                   </button>
                ))}
             </div>
          </Modal>
        )}

        {activePopup === 'store' && (
           <Modal onClose={() => setActivePopup(null)} title="Recharge Store">
              <div className="space-y-3">
                 <StoreItem cost={100} amount={1} coins={coins} onBuy={() => handleBuyRecharge(100, 1)} label="1 Charge" />
                 <StoreItem cost={250} amount={3} coins={coins} onBuy={() => handleBuyRecharge(250, 3)} label="3 Charges" isBest />
                 <StoreItem cost={500} amount={10} coins={coins} onBuy={() => handleBuyRecharge(500, 10)} label="God Mode" />
              </div>
           </Modal>
        )}

        {selectedItem && (
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onAnimationComplete={() => setTimeout(() => setSelectedItem(null), 3000)} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-3 whitespace-nowrap z-50">
              <Check size={18} className="bg-green-500 text-white rounded-full p-0.5" /> Enjoy your {selectedItem}!
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuCard = ({ title, icon: Icon, color, onClick, isLocked }) => {
  const styles = {
    green: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100",
  };
  return (
    <button onClick={onClick} className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all h-32 ${isLocked ? 'opacity-50 grayscale cursor-not-allowed bg-slate-100 border-slate-200' : `${styles[color]}`}`}>
      <div className="p-3 bg-white rounded-xl shadow-sm"><Icon size={24} /></div>
      <span className="font-bold text-sm">{title}</span>
      {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-[1px] rounded-2xl"><Lock size={20} className="text-slate-400" /></div>}
    </button>
  );
};

const StoreItem = ({ cost, amount, coins, onBuy, label, isBest }) => (
  <button onClick={onBuy} disabled={coins < cost} className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${coins >= cost ? 'bg-white border-slate-200 hover:border-indigo-500 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'}`}>
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">{amount}x</div>
        <div className="text-left">
           <span className="block text-slate-700 font-bold text-sm">{label}</span>
           {isBest && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">BEST VALUE</span>}
        </div>
     </div>
     <span className="font-mono text-indigo-600 font-bold text-sm">{cost} pts</span>
  </button>
);

const Modal = ({ children, onClose, title }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-md rounded-[2rem]" onClick={onClose}>
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden" onClick={(e) => e.stopPropagation()}>
       <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><h3 className="font-bold text-slate-800">{title}</h3><button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button></div>
       <div className="p-4">{children}</div>
    </motion.div>
  </div>
);

export default DopamineMenu;