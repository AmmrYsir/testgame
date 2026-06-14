import { useGameStore } from '../store';

export default function InfrastructureView() {
  const { infrastructure, resources, buyGPUs, toggleCloudGpus, buyCooling, llms } = useGameStore();

  const handleBuyGpus = () => {
    buyGPUs(64, 250000); // Buy 64 for $250k
  };

  const handleToggleCloud = () => {
    toggleCloudGpus(128); // Leases/unleases 128 Cloud GPUs
  };

  const handleBuyCooling = () => {
    buyCooling();
  };

  const nextCoolingLevel = infrastructure.coolingLevel + 1;
  const coolingUpgradeCost = nextCoolingLevel * 100000;
  const isCloudRented = infrastructure.cloudGpusRented > 0;

  // Split compute metrics
  const totalTrainingGpus = llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
  const totalProductionGpus = llms.reduce((sum, m) => sum + (m.productionGpus || 0), 0);
  const totalGpus = infrastructure.gpus + infrastructure.cloudGpusRented;
  const idleGpus = Math.max(0, totalGpus - totalTrainingGpus - totalProductionGpus);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-6 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Compute Infrastructure</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Manage hardware resources, server cooling efficiency, and lease cloud clusters.
        </p>
      </div>

      {/* FULL WIDTH: Split Compute Visualizer */}
      <div className="col-span-1 lg:col-span-12">
        <section className="glass-panel p-lg rounded-xl flex flex-col gap-md">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs flex justify-between items-center">
            <span>Cluster Compute Allocation Split</span>
            <span className="text-primary font-bold">Live Status</span>
          </h3>

          <div className="space-y-md">
            <div className="flex justify-between items-end text-xs text-outline">
              <div>
                <span className="text-on-surface font-semibold">Total Cluster Compute Capacity</span>
                <p className="text-[11px] mt-0.5">Physical H100s + Cloud rented nodes</p>
              </div>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                {totalGpus} GPUs <span className="text-sm font-normal text-outline">({(totalGpus * 5).toFixed(0)} PFLOPS)</span>
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full bg-surface-container-highest h-5 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
              {totalTrainingGpus > 0 && (
                <div 
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" 
                  style={{ width: `${(totalTrainingGpus / totalGpus) * 100}%` }}
                >
                  {Math.round((totalTrainingGpus / totalGpus) * 100)}%
                </div>
              )}
              {totalProductionGpus > 0 && (
                <div 
                  className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" 
                  style={{ width: `${(totalProductionGpus / totalGpus) * 100}%` }}
                >
                  {Math.round((totalProductionGpus / totalGpus) * 100)}%
                </div>
              )}
              {idleGpus > 0 && (
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" 
                  style={{ width: `${(idleGpus / totalGpus) * 100}%` }}
                >
                  {Math.round((idleGpus / totalGpus) * 100)}%
                </div>
              )}
            </div>

            {/* Grid Legends */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md pt-xs">
              <div className="flex items-center gap-sm bg-surface-dim/40 p-3 rounded-lg border border-white/5">
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 shrink-0 animate-pulse"></span>
                <div>
                  <span className="block font-label-md text-label-md text-outline">Training Nodes</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">{totalTrainingGpus} GPUs</span>
                </div>
              </div>
              <div className="flex items-center gap-sm bg-surface-dim/40 p-3 rounded-lg border border-white/5">
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 shrink-0"></span>
                <div>
                  <span className="block font-label-md text-label-md text-outline">Production Nodes</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">{totalProductionGpus} GPUs</span>
                </div>
              </div>
              <div className="flex items-center gap-sm bg-surface-dim/40 p-3 rounded-lg border border-white/5">
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 shrink-0"></span>
                <div>
                  <span className="block font-label-md text-label-md text-outline">Idle Pool</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">{idleGpus} GPUs</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* COLUMN 1: Physical & Cloud GPU Clusters */}
      <div className="col-span-1 lg:col-span-6 flex flex-col gap-gutter">
        {/* Physical Nodes */}
        <section className="glass-panel p-lg rounded-xl flex flex-col gap-md">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs flex justify-between items-center">
            <span>Physical GPU Nodes</span>
            <span className="text-primary font-bold">On-Premises</span>
          </h3>
          
          <div className="space-y-sm mt-xs">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-outline">Owned H100 Hardware</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">{infrastructure.gpus}x H100s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-outline">On-Prem Compute Yield</span>
              <span className="font-label-md text-label-md text-primary font-semibold">{(infrastructure.gpus * 5).toFixed(0)} PFLOPS</span>
            </div>
          </div>
          
          <button 
            onClick={handleBuyGpus}
            disabled={resources.cash < 250000}
            className="w-full bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md text-label-md py-md rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed mt-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">memory</span>
            Acquire 64x H100 Node ($250,000)
          </button>
        </section>

        {/* Cloud Cluster Rental */}
        <section className="glass-panel p-lg rounded-xl flex flex-col gap-md">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs flex justify-between items-center">
            <span>Cloud Compute Rental</span>
            <span className="text-secondary font-bold">On-Demand</span>
          </h3>
          
          <p className="font-body-md text-body-md text-outline text-xs">
            Instantly scale compute by leasing cloud nodes. No upfront capital expense, but incurs continuous rental charges per tick.
          </p>

          <div className="space-y-sm mt-xs">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-outline">Leased H100 Clusters</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                {infrastructure.cloudGpusRented}x Cloud GPUs
              </span>
            </div>
            {isCloudRented && (
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-outline">Rental Flat Cost</span>
                <span className="font-label-md text-label-md text-error font-semibold">
                  -${(infrastructure.cloudGpusRented * 15).toLocaleString()}/tick
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleToggleCloud}
            className={`w-full font-label-md text-label-md py-md rounded-xl transition-all duration-300 mt-md flex items-center justify-center gap-2 border ${
              isCloudRented
                ? 'bg-error/10 border-error/30 text-error hover:bg-error/20'
                : 'bg-primary hover:bg-primary-container text-on-primary border-transparent shadow-[0_0_15px_rgba(173,198,255,0.2)]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{isCloudRented ? 'cloud_off' : 'cloud_queue'}</span>
            {isCloudRented ? 'Terminate 128x GPU Lease' : 'Lease 128x Cloud GPUs'}
          </button>
        </section>
      </div>

      {/* COLUMN 2: Facilities & Server Heat */}
      <div className="col-span-1 lg:col-span-6 flex flex-col gap-gutter">
        {/* Thermals & Heating */}
        <section className="glass-panel p-lg rounded-xl relative overflow-hidden flex flex-col gap-md h-full justify-between">
          <div>
            <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">
              Thermal Diagnostics
            </h3>
            
            <div className="space-y-md mt-md">
              <div>
                <div className="flex justify-between mb-xs">
                  <span className="font-label-md text-label-md text-on-surface">Data Center Heat Load</span>
                  <span className={`font-label-md text-label-md font-bold ${infrastructure.serverHeat > 80 ? 'text-error animate-pulse' : 'text-primary'}`}>
                    {infrastructure.serverHeat}%
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      infrastructure.serverHeat > 80 
                        ? 'bg-gradient-to-r from-error/60 to-error shadow-[0_0_10px_rgba(255,100,100,0.5)]' 
                        : 'bg-gradient-to-r from-primary/60 to-primary'
                    }`} 
                    style={{width: `${infrastructure.serverHeat}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="bg-surface-dim p-4 rounded-xl border border-white/5 space-y-sm">
                <div className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
                  Data center thermal load is driven by active GPU compute:
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-outline">
                    <li><span className="text-amber-500 font-semibold">Training Nodes</span> run at 100% thermal load.</li>
                    <li><span className="text-cyan-500 font-semibold">Production Nodes</span> run at 30% thermal load (inference).</li>
                    <li><span className="text-emerald-500 font-semibold">Idle Nodes</span> generate 0% thermal load.</li>
                  </ul>
                  <p className="mt-2">
                    If temperature exceeds <strong className="text-error">85%</strong>, safety failsafes trigger, aborting active training runs to prevent physical damage.
                  </p>
                </div>
                <div className="flex justify-between text-[11px] text-outline pt-2 border-t border-white/5">
                  <span>Current Cooling Tier: Lvl {infrastructure.coolingLevel}</span>
                  <span>Mitigation Factor: -{infrastructure.coolingLevel * 15}% Heat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cooling Facility Upgrades */}
          <div className="mt-lg border-t border-white/10 pt-lg space-y-sm">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-label-md text-label-md text-on-surface font-bold">Facility HVAC Coolers</h4>
                <p className="text-[11px] text-outline">Upgrade air cooling fans to reduce GPU heat output.</p>
              </div>
              <span className="font-label-md text-label-md text-primary font-bold">Tier {nextCoolingLevel}</span>
            </div>

            <button
              onClick={handleBuyCooling}
              disabled={resources.cash < coolingUpgradeCost}
              className="w-full bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md text-label-md py-md rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">ac_unit</span>
              Upgrade Coolers to Lvl {nextCoolingLevel} (${coolingUpgradeCost.toLocaleString()})
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
