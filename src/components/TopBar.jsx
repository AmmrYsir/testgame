import { useGameStore } from '../store';

export default function TopBar() {
  const { resources, company, simulationSpeed } = useGameStore();

  return (
    <header className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl w-full z-50 border-b border-white/10 shadow-sm flex-none">
      <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-4">
          <span className="font-display-lg text-display-lg font-bold tracking-tighter text-primary dark:text-primary text-2xl uppercase">
            {company?.name || 'AETHER CORP'}
          </span>
        </div>
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings:"'FILL' 0"}}>monetization_on</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline-variant uppercase">Cash Reserves</span>
                <span className="font-label-md text-label-md text-on-surface">${resources.cash.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings:"'FILL' 0"}}>memory</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline-variant uppercase">Compute Power</span>
                <span className="font-label-md text-label-md text-on-surface">{resources.compute.toFixed(1)} PFLOPS</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{fontVariationSettings:"'FILL' 0"}}>shutter_speed</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline-variant uppercase">Hype Index</span>
                <span className="font-label-md text-label-md text-on-surface">{resources.hype} / 100</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-surface-container/50 px-4 py-2 rounded-lg border-l border-t border-white/5">
            <span className="material-symbols-outlined text-outline-variant text-sm">
              {simulationSpeed === 0 ? 'pause' : 'play_arrow'}
            </span>
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-label-sm text-outline uppercase leading-tight">
                {simulationSpeed === 0 ? 'PAUSED' : `${simulationSpeed}x Speed`}
              </span>
              <span className="font-label-md text-label-md text-on-surface leading-tight">Day {resources.currentTick}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
