import { useGameStore, formatDateFromTick } from '../store';

export default function TopBar({ onMailboxToggle }) {
  const { resources, company, simulationSpeed, setSimulationSpeed, emails, countries } = useGameStore();
  const totalCustomers = Object.values(countries || {}).reduce((sum, c) => sum + (c.playerUsers || 0), 0);

  return (
    <header className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl w-full z-50 border-b border-white/10 shadow-sm flex-none">
      <div className="flex justify-between items-center w-full px-lg py-sm h-16">
        {/* Left Side: Company Title + Mailbox Icon Button */}
        <div className="flex items-center gap-6">
          <span className="font-display-lg text-display-lg font-bold tracking-tighter text-primary dark:text-primary text-2xl uppercase">
            {company?.name || 'AETHER CORP'}
          </span>

          <button
            disabled={!company?.hqCountryId}
            onClick={onMailboxToggle}
            className="flex items-center gap-2 bg-surface-container/40 hover:bg-surface-bright/20 border border-white/10 px-4 py-2 rounded-xl transition-all duration-300 relative group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[18px]">mail</span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">Mailbox</span>
            {emails && emails.filter(e => !e.read).length > 0 && company?.hqCountryId && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 bg-error text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,100,100,0.6)] animate-pulse">
                {emails.filter(e => !e.read).length}
              </span>
            )}
          </button>
        </div>

        {/* Center: Basic Information */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>monetization_on</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline-variant uppercase text-[10px]">Cash Reserves</span>
              <span className="font-label-md text-label-md text-on-surface font-bold text-sm">${resources.cash.toLocaleString()}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>memory</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline-variant uppercase text-[10px]">Compute Power</span>
              <span className="font-label-md text-label-md text-on-surface font-bold text-sm">{resources.compute.toFixed(1)} PFLOPS</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>database</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline-variant uppercase text-[10px]">Proprietary Data</span>
              <span className="font-label-md text-label-md text-on-surface font-bold text-sm">{(resources.data || 0)} TB</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>groups</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline-variant uppercase text-[10px]">Active Customers</span>
              <span className="font-label-md text-label-md text-on-surface font-bold text-sm">{totalCustomers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Speed Controller & Day Counter */}
        <div className="flex items-center gap-3 bg-surface-container/50 px-4 py-2 rounded-xl border border-white/10">
          <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
            <button
              disabled={!company?.hqCountryId}
              onClick={() => setSimulationSpeed(0)}
              title="Pause simulation (Spacebar)"
              className={`p-1.5 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                simulationSpeed === 0
                  ? 'bg-error/20 text-error border border-error/30'
                  : 'text-outline hover:text-on-surface hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">pause</span>
            </button>
            <button
              disabled={!company?.hqCountryId}
              onClick={() => setSimulationSpeed(1)}
              title="Normal speed (1)"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border disabled:opacity-40 disabled:cursor-not-allowed ${
                simulationSpeed === 1
                  ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                  : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
              }`}
            >
              1x
            </button>
            <button
              disabled={!company?.hqCountryId}
              onClick={() => setSimulationSpeed(2)}
              title="Double speed (2)"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border disabled:opacity-40 disabled:cursor-not-allowed ${
                simulationSpeed === 2
                  ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                  : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
              }`}
            >
              2x
            </button>
            <button
              disabled={!company?.hqCountryId}
              onClick={() => setSimulationSpeed(3)}
              title="Triple speed (3)"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border disabled:opacity-40 disabled:cursor-not-allowed ${
                simulationSpeed === 3
                  ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                  : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
              }`}
            >
              3x
            </button>
            <button
              disabled={!company?.hqCountryId}
              onClick={() => setSimulationSpeed(4)}
              title="Quad speed (4)"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border disabled:opacity-40 disabled:cursor-not-allowed ${
                simulationSpeed === 4
                  ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                  : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
              }`}
            >
              4x
            </button>
            <button
              disabled={!company?.hqCountryId}
              onClick={() => setSimulationSpeed(5)}
              title="Hyper speed (5)"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-mono text-xs border disabled:opacity-40 disabled:cursor-not-allowed ${
                simulationSpeed === 5
                  ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                  : 'text-outline hover:text-on-surface hover:bg-white/5 border-transparent'
              }`}
            >
              5x
            </button>
          </div>
          
          <div className="flex flex-col text-right">
            <span className="font-label-sm text-label-sm text-outline uppercase leading-tight text-[10px]">
              {simulationSpeed === 0 ? 'PAUSED' : `${simulationSpeed}x Speed`}
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold font-mono leading-tight">{formatDateFromTick(resources.currentTick)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
