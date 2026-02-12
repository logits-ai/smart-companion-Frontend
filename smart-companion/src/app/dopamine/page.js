import DopamineMenu from '@/components/DopamineMenu';

export default function DopaminePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] mix-blend-multiply filter opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-300 rounded-full blur-[120px] mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-pink-300 rounded-full blur-[120px] mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Dopamine Menu</h1>
          <p className="text-slate-500">Spend your Neuro-Coins wisely to recharge.</p>
        </div>
        
        {/* Pass the streak here (in a real app, this comes from your database) */}
        <DopamineMenu userStreak={15} />
      </div>
    </div>
  );
}