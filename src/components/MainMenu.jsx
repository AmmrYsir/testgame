import { useGameStore } from '../store';

export default function MainMenu() {
  const { company, setGameStage, resetGame } = useGameStore();
  const hasSavedGame = !!company.name;

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-[#0d0f14] overflow-hidden dark select-none">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800b_1px,transparent_1px)] bg-[size:32px_32px]">
        {/* Soft Radial Ambient Backlights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>
      </div>

      <main className="relative z-10 w-full max-w-[500px] px-lg flex flex-col items-center gap-xl">
        {/* Command Center Title & Subtitle */}
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-[0.25em] block animate-pulse">
            Welcome Executive
          </span>
          <h1 className="font-display-lg text-[28px] md:text-[38px] text-on-surface font-extrabold uppercase tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
            AI Race Simulator
          </h1>
          <p className="font-mono text-[10px] text-outline uppercase tracking-[0.18em]">
            Management Strategy Tycoon
          </p>
        </div>

        {/* Action Panel Card */}
        <div className="bg-[#191b23]/70 backdrop-blur-2xl border border-white/10 rounded-xl p-lg w-full flex flex-col gap-sm shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          {/* New Game - Primary Button */}
          <button
            onClick={resetGame}
            className="w-full bg-[#3b82f6] text-white py-3.5 px-lg rounded-lg font-mono text-xs uppercase tracking-[0.12em] font-bold flex items-center justify-center gap-sm hover:bg-[#2563eb] transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">rocket_launch</span>
            <span>New Game</span>
          </button>
          
          {/* Continue - Secondary Button */}
          <button 
            disabled={!hasSavedGame}
            onClick={() => setGameStage('playing')}
            className={`w-full py-3.5 px-lg rounded-lg font-mono text-xs uppercase tracking-[0.12em] font-bold flex items-center justify-center gap-sm transition-all border ${
              hasSavedGame
                ? 'bg-transparent border-white/10 text-on-surface hover:bg-white/5 hover:border-white/20 hover:scale-[1.01] cursor-pointer'
                : 'bg-white/5 border-transparent text-outline opacity-30 cursor-not-allowed'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${hasSavedGame ? 'text-primary' : 'text-outline'}`}>play_arrow</span>
            <span>Continue</span>
          </button>

          {/* Settings - Ghost/Disabled Button */}
          <button className="w-full bg-transparent border-transparent text-outline/40 py-3.5 px-lg rounded-lg font-mono text-xs uppercase tracking-[0.12em] font-bold flex items-center justify-center gap-sm hover:text-outline hover:bg-white/5 transition-all opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined text-base">settings</span>
            <span>Settings</span>
          </button>
        </div>

        {/* Footer Credit info */}
        <div className="text-center font-mono text-[9px] text-outline/40 uppercase tracking-[0.1em] mt-md">
          Corporate System Version 1.2.0-LTS • Secure Connection
        </div>
      </main>
    </div>
  );
}
