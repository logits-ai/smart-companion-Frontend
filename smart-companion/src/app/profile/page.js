"use client";
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Trophy, Calendar, Coins, Zap } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  // Safe destructuring
  const { coins = 0, history = [] } = useUser(); 

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-bold">
        <ArrowLeft className="w-5 h-5" /> Back to Mission Control
      </button>

      {/* HEADER CARD */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
         <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <User className="w-10 h-10" />
         </div>
         <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-extrabold text-slate-800">Pilot Profile</h1>
            <p className="text-slate-500">Level 1 • Ready for Action</p>
         </div>
         <div className="flex gap-6">
            <div className="text-center">
               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Coins</div>
               <div className="text-2xl font-black text-yellow-500 flex items-center justify-center gap-1"><Coins className="w-6 h-6 fill-yellow-500" /> {coins}</div>
            </div>
            <div className="text-center">
               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Missions</div>
               {/* FIX FOR THE ERROR: Check existence before length */}
               <div className="text-2xl font-black text-violet-600">{history?.length || 0}</div>
            </div>
         </div>
      </div>

      {/* HISTORY LIST */}
      <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-violet-500" /> Mission Log</h2>

      <div className="space-y-4">
        {history && history.length > 0 ? (
          history.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition">
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-lg">{task.text}</h3>
                      {/* DIFFICULTY BADGE */}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          task.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 
                          task.difficulty === 'Medium' ? 'bg-violet-100 text-violet-600' : 
                          'bg-green-100 text-green-600'
                      }`}>
                          {task.difficulty || "Medium"}
                      </span>
                  </div>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.date}</p>
               </div>
               <span className="text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl flex items-center gap-1 border border-green-100">
                 <Coins className="w-4 h-4" /> +{task.coinsEarned} Coins
               </span>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
             <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <p>No missions completed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}