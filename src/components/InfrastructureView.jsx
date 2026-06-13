import { useGameStore } from '../store';

export default function InfrastructureView() {
  const { infrastructure, resources, buyGPUs } = useGameStore();

  const handleBuy = () => {
    buyGPUs(64, 250000); // Buy 64 for $250k
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-12 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Server Infrastructure</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage compute clusters and physical hardware capabilities.</p>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-6 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">GPU Cluster Alpha</h3>
          <div className="space-y-lg mt-md">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface">Active Units</span>
              <span className="font-headline-md text-headline-md text-primary">{infrastructure.gpus}x H100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface">Compute Yield</span>
              <span className="font-headline-md text-headline-md text-primary">{resources.compute.toFixed(1)} PFLOPS</span>
            </div>
            
            <button 
              onClick={handleBuy}
              disabled={resources.cash < 250000}
              className="w-full bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md text-label-md py-md rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-md"
            >
              Acquire 64x H100 Node ($250,000)
            </button>
          </div>
        </section>
      </div>

      <div className="col-span-1 lg:col-span-6 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl relative overflow-hidden">
          <h3 className="relative z-10 font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">Power & Cooling</h3>
          <div className="relative z-10 space-y-md mt-md">
            <div>
              <div className="flex justify-between mb-xs">
                <span className="font-label-md text-label-md text-on-surface">Server Heat Load</span>
                <span className={`font-label-md text-label-md ${infrastructure.serverHeat > 80 ? 'text-error' : 'text-primary'}`}>
                  {infrastructure.serverHeat}%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${infrastructure.serverHeat > 80 ? 'bg-error' : 'bg-primary'}`} 
                  style={{width: `${infrastructure.serverHeat}%`}}
                ></div>
              </div>
            </div>
            <div className="mt-lg">
              <p className="font-body-md text-body-md text-on-surface-variant">Cooling systems are operating within nominal parameters. Consider upgrading HVAC if heat load exceeds 85%.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
