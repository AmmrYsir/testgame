import { useGameStore } from '../store';

export default function TopBar({ onMailboxToggle }) {
  const { resources, company, simulationSpeed, setSimulationSpeed, emails } = useGameStore();

  return (
    <header className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl w-full z-50 border-b border-white/10 shadow-sm flex-none">
      <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-4">
          <span className="font-display-lg text-display-lg font-bold tracking-tighter text-primary dark:text-primary text-2xl uppercase">
            {company?.name || 'AETHER CORP'}
          </span>
        </div>

        {/* Mailbox Toggle Button */}
        <button
          onClick={onMailboxToggle}
          className="flex items-center gap-2 bg-surface-container/40 hover:bg-surface-bright/20 border border-white/10 px-4 py-2 rounded-xl transition-all duration-300 relative group"
        >
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[18px]">mail</span>
          <span className="font-label-sm text-label-sm text-on-surface font-semibold">Mailbox</span>
          {emails && emails.filter(e => !e.read).length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 bg-error text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,100,100,0.6)] animate-pulse">
              {emails.filter(e => !e.read).length}
            </span>
          )}
        </button>

        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>monetization_on</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline-variant uppercase">Cash Reserves</span>
                <span className="font-label-md text-label-md text-on-surface">${resources.cash.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>memory</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline-variant uppercase">Compute Power</span>
                <span className="font-label-md text-label-md text-on-surface">{resources.compute.toFixed(1)} PFLOPS</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>shutter_speed</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline-variant uppercase">Hype Index</span>
                <span className="font-label-md text-label-md text-on-surface">{resources.hype} / 100</span>
              </div>
            </div>
          </div>
          
          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-3 bg-surface-container/50 px-4 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
              <button
                onClick={() => setSimulationSpeed(0)}
                title="Pause simulation (Spacebar)"
                className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                  simulationSpeed === 0
                    ? 'bg-error/20 text-error border border-error/30'
                    : 'text-outline hover:text-on-surface hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">pause</span>
              </button>
              <button
                onClick={() => setSimulationSpeed(1)}
                title="Normal speed (1)"
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border ${
                  simulationSpeed === 1
                    ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                    : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setSimulationSpeed(2)}
                title="Double speed (2)"
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border ${
                  simulationSpeed === 2
                    ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                    : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
                }`}
              >
                2x
              </button>
              <button
                onClick={() => setSimulationSpeed(4)}
                title="Fast forward (3)"
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border ${
                  simulationSpeed === 4
                    ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                    : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
                }`}
              >
                4x
              </button>
            </div>
            
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-label-sm text-outline uppercase leading-tight text-[10px]">
                {simulationSpeed === 0 ? 'PAUSED' : `${simulationSpeed}x Speed`}
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold font-mono leading-tight">Day {resources.currentTick}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
