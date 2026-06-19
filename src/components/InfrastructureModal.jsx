import { useGameStore } from '../store';

export default function InfrastructureModal({ isOpen, onClose }) {
  const { infrastructure, resources, buyGPUs, setCloudGpus, buyCooling, llms, company, countries } = useGameStore();

  if (!isOpen) return null;

  const hqCountryId = company?.hqCountryId;
  const hqCountry = hqCountryId ? countries[hqCountryId] : null;
  const hqCountryName = hqCountry ? hqCountry.name : 'Unknown Location';

  const handleBuyGpus = () => {
    buyGPUs(64, 250000); // Buy 64 for $250k
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

  const getCoolingSystemLabel = (level) => {
    switch(level) {
      case 1: return 'Basic Air HVAC System';
      case 2: return 'Precision Liquid Cooling';
      case 3: return 'Immersive Oil System';
      case 4: return 'Liquid Nitrogen Cryo-Loop';
      case 5: return 'Geothermal Sub-Zero Exchange';
      default: return `Advanced Cryo-Loop (Tier ${level})`;
    }
  };

  // Determine Server Racks list
  // Each rack holds 64 GPUs. Let's list them.
  const physicalGpus = infrastructure.gpus;
  const rackCount = Math.max(1, Math.ceil(physicalGpus / 64));
  
  // Allocate status to racks for visual representation
  // We distribute totalTrainingGpus and totalProductionGpus across the racks
  let trainingLeft = totalTrainingGpus;
  let productionLeft = totalProductionGpus;

  const racks = [];
  for (let i = 0; i < rackCount; i++) {
    const rackGpus = Math.min(64, physicalGpus - i * 64);
    let trainingAlloc = 0;
    let productionAlloc = 0;

    if (trainingLeft > 0) {
      trainingAlloc = Math.min(rackGpus, trainingLeft);
      trainingLeft -= trainingAlloc;
    }
    const spaceLeft = rackGpus - trainingAlloc;
    if (spaceLeft > 0 && productionLeft > 0) {
      productionAlloc = Math.min(spaceLeft, productionLeft);
      productionLeft -= productionAlloc;
    }
    const idleAlloc = rackGpus - trainingAlloc - productionAlloc;

    // Determine status label/color
    let status = 'Operational - Idle';
    let statusColor = 'text-emerald-500';
    let borderStyle = 'border-white/5';
    let glow = '';

    if (trainingAlloc > 0 && productionAlloc > 0) {
      status = `Active (Train: ${trainingAlloc} | Serve: ${productionAlloc})`;
      statusColor = 'text-amber-400';
      borderStyle = 'border-amber-500/20';
      glow = 'shadow-[0_0_15px_rgba(245,158,11,0.08)]';
    } else if (trainingAlloc > 0) {
      status = `Active (Training: ${trainingAlloc} GPUs)`;
      statusColor = 'text-amber-500';
      borderStyle = 'border-amber-500/20';
      glow = 'shadow-[0_0_15px_rgba(245,158,11,0.08)]';
    } else if (productionAlloc > 0) {
      status = `Active (Serving: ${productionAlloc} GPUs)`;
      statusColor = 'text-cyan-400';
      borderStyle = 'border-cyan-500/20';
      glow = 'shadow-[0_0_15px_rgba(34,211,238,0.08)]';
    }

    racks.push({
      id: i + 1,
      total: rackGpus,
      training: trainingAlloc,
      production: productionAlloc,
      idle: idleAlloc,
      status,
      statusColor,
      borderStyle,
      glow
    });
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-fade-in" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-[950px] h-[650px] rounded-xl flex flex-col overflow-hidden shadow-2xl relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-lg py-4 border-b border-white/10 bg-surface-container/60 flex justify-between items-center flex-none">
          <div className="flex flex-col">
            <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">dns</span>
              Main Headquarters Datacenter Operations
            </h3>
            <span className="font-mono text-[9.5px] text-outline uppercase tracking-wider mt-0.5">
              Facility Location: <strong className="text-primary">{hqCountryName} HQ</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter bg-[#0a0d14]/40">
          
          {/* LEFT COLUMN: Server Racks & Physical Hardware (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-gutter h-full">
            
            {/* Compute Capacity Info */}
            <div className="bg-[#0b0e15]/80 border border-white/5 rounded-xl p-md flex flex-col gap-sm shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-outline uppercase font-semibold">Total Compute Capacity</span>
                <span className="text-[10px] px-2 py-0.5 bg-primary/10 border border-primary/20 rounded font-mono text-primary font-bold">HQ ONLINE</span>
              </div>
              <div className="flex justify-between items-baseline mt-xs">
                <span className="font-display-lg text-2xl font-bold text-on-surface">
                  {totalGpus} GPUs <span className="text-sm font-normal text-outline">({(totalGpus * 5).toFixed(0)} PFLOPS)</span>
                </span>
                <span className="text-xs text-outline">
                  Idle: <strong className="text-emerald-500">{idleGpus}</strong> | Active: <strong className="text-primary">{totalTrainingGpus + totalProductionGpus}</strong>
                </span>
              </div>

              {/* Allocation Split Bar */}
              <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden flex border border-white/5 shadow-inner mt-sm">
                {totalTrainingGpus > 0 && (
                  <div 
                    className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500 flex items-center justify-center text-[8px] font-bold text-white shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" 
                    style={{ width: `${(totalTrainingGpus / totalGpus) * 100}%` }}
                    title={`Training: ${totalTrainingGpus} GPUs`}
                  >
                    {Math.round((totalTrainingGpus / totalGpus) * 100)}%
                  </div>
                )}
                {totalProductionGpus > 0 && (
                  <div 
                    className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full transition-all duration-500 flex items-center justify-center text-[8px] font-bold text-white shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" 
                    style={{ width: `${(totalProductionGpus / totalGpus) * 100}%` }}
                    title={`Inference/Deployment: ${totalProductionGpus} GPUs`}
                  >
                    {Math.round((totalProductionGpus / totalGpus) * 100)}%
                  </div>
                )}
                {idleGpus > 0 && (
                  <div 
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-500 flex items-center justify-center text-[8px] font-bold text-white shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" 
                    style={{ width: `${(idleGpus / totalGpus) * 100}%` }}
                    title={`Idle: ${idleGpus} GPUs`}
                  >
                    {Math.round((idleGpus / totalGpus) * 100)}%
                  </div>
                )}
              </div>
            </div>

            {/* Server Racks Visualizer */}
            <div className="flex-1 flex flex-col gap-sm overflow-hidden">
              <span className="font-mono text-[9px] text-outline uppercase tracking-wider font-bold block">Datacenter Server Racks ({racks.length})</span>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-xs space-y-sm max-h-[300px]">
                {racks.map(rack => (
                  <div 
                    key={rack.id} 
                    className={`bg-[#0b0e15]/40 border ${rack.borderStyle} ${rack.glow} rounded-xl p-md flex items-center justify-between transition-all duration-300 hover:bg-[#0b0e15]/60`}
                  >
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-[#07090e] border border-white/5 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-outline text-xl">database</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold">Server Rack #{rack.id}</h4>
                        <span className="text-[10px] text-outline font-mono block mt-0.5">Capacity: {rack.total} / 64 GPUs • {(rack.total * 5).toFixed(0)} PFLOPS</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono text-[10px] font-semibold ${rack.statusColor}`}>
                        {rack.status}
                      </span>
                      <div className="flex gap-1.5 mt-1 justify-end">
                        {rack.training > 0 && <span className="w-2.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Training load"></span>}
                        {rack.production > 0 && <span className="w-2.5 h-1.5 rounded-full bg-cyan-400" title="Deployment load"></span>}
                        {rack.idle > 0 && <span className="w-2.5 h-1.5 rounded-full bg-emerald-500" title="Idle capacity"></span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Rack Control */}
            <div className="bg-[#0b0e15]/40 border border-white/5 rounded-xl p-md flex items-center justify-between mt-auto flex-none shadow-md">
              <div className="max-w-[60%]">
                <h4 className="font-label-md text-label-md text-on-surface font-bold">Deploy Physical Server Rack</h4>
                <p className="text-[10.5px] text-outline leading-tight mt-0.5">Adds 64 high-speed hardware nodes to the headquarters cluster.</p>
              </div>
              <button 
                onClick={handleBuyGpus}
                disabled={resources.cash < 250000}
                className="bg-primary hover:bg-primary-container text-on-primary border border-transparent font-mono text-[10px] uppercase tracking-wider font-bold py-2.5 px-md rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Deploy Rack ($250,000)
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Facility Subsystems - Thermals, Cooling, Cloud (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-gutter h-full">
            
            {/* Thermals & Heating Control Panel */}
            <div className="bg-[#0b0e15]/60 border border-white/5 rounded-xl p-md flex flex-col gap-md shadow-lg flex-1 justify-between">
              
              <div>
                <h4 className="font-mono text-[9px] text-outline uppercase tracking-wider font-bold border-b border-white/10 pb-xs">
                  HQ Temperature Controls
                </h4>
                
                <div className="mt-md flex flex-col items-center justify-center py-xs">
                  {/* Circular / Large Temperature indicator */}
                  <div className="relative w-24 h-24 rounded-full border-4 border-white/5 flex flex-col items-center justify-center shadow-inner">
                    <span className={`font-display-lg text-2xl font-extrabold ${infrastructure.serverHeat > 80 ? 'text-error animate-pulse' : 'text-primary'}`}>
                      {infrastructure.serverHeat}%
                    </span>
                    <span className="text-[7.5px] text-outline font-mono mt-0.5 uppercase tracking-wider">Facility Heat</span>
                    
                    {/* Glowing arc overlay */}
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-transparent transition-all"
                      style={{ 
                        borderTopColor: infrastructure.serverHeat > 80 ? '#ef4444' : '#3b82f6',
                        transform: `rotate(${infrastructure.serverHeat * 3.6}deg)`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-surface-dim/40 p-3 rounded-xl border border-white/5 space-y-sm mt-sm">
                  <div className="font-body-md text-body-md text-on-surface-variant text-[10px] leading-relaxed">
                    System temperature is driven by datacenter activity:
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-outline">
                      <li><span className="text-amber-500 font-semibold">Training Racks</span> run at 100% thermal load.</li>
                      <li><span className="text-cyan-500 font-semibold">Inference/Serving Racks</span> run at 30% load.</li>
                      <li><span className="text-emerald-500 font-semibold">Idle Racks</span> generate 0% thermal load.</li>
                    </ul>
                    <p className="mt-1">
                      Safety systems shut down active model training if temperature exceeds <strong className="text-error">85%</strong>.
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-[9px] text-outline pt-1.5 border-t border-white/5 font-mono">
                    <span>Cooling Level: Tier {infrastructure.coolingLevel}</span>
                    <span>Efficiency: -{infrastructure.coolingLevel * 15}% Heat</span>
                  </div>
                </div>
              </div>

              {/* Cooling Upgrade button */}
              <div className="border-t border-white/10 pt-md mt-xs flex flex-col gap-sm flex-none">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-outline font-semibold">HQ HVAC System</span>
                  <span className="text-primary font-bold font-mono">Tier {infrastructure.coolingLevel} &rarr; {nextCoolingLevel}</span>
                </div>
                <button
                  onClick={handleBuyCooling}
                  disabled={resources.cash < coolingUpgradeCost}
                  className="w-full bg-[#0b0e15] hover:bg-white/5 border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-mono text-[9.5px] uppercase tracking-wider font-bold py-2.5 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">ac_unit</span>
                  Upgrade HVAC to {getCoolingSystemLabel(nextCoolingLevel)} (${coolingUpgradeCost.toLocaleString()})
                </button>
              </div>

            </div>

            {/* Cloud Lease Uplink Card */}
            <div className="bg-[#0b0e15]/60 border border-white/5 rounded-xl p-md flex flex-col justify-between shadow-lg h-[195px] flex-none">
              <div>
                <div className="flex justify-between items-center border-b border-white/10 pb-xs">
                  <span className="font-mono text-[9px] text-outline uppercase tracking-wider font-bold">Cloud Uplink Bridge</span>
                  <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${isCloudRented ? 'bg-secondary/15 text-secondary border border-secondary/20 animate-pulse' : 'bg-white/5 text-outline border border-white/10'}`}>
                    {isCloudRented ? `${infrastructure.cloudGpusRented} Cloud GPUs` : 'DISCONNECTED'}
                  </span>
                </div>
                
                {/* Granular Slider Control */}
                <div className="mt-sm space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-outline font-mono">
                    <span>Lease Capacity</span>
                    <span className="text-on-surface font-semibold">{infrastructure.cloudGpusRented} / 512 Cloud GPUs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="512"
                    step="32"
                    value={infrastructure.cloudGpusRented}
                    onChange={(e) => setCloudGpus(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#0b0e15] rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Billing Summary */}
                <div className="flex justify-between text-[9px] text-outline mt-sm font-mono leading-tight">
                  <span>BILLING COST RATE:</span>
                  <span className={isCloudRented ? 'text-error font-bold' : 'text-outline-variant font-semibold'}>
                    {isCloudRented ? `-$${(infrastructure.cloudGpusRented * 15).toLocaleString()}/tick ($15/GPU)` : '$0'}
                  </span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex gap-1 border-t border-white/5 pt-sm mt-xs">
                {[
                  { label: 'None', val: 0 },
                  { label: '64x', val: 64 },
                  { label: '128x', val: 128 },
                  { label: '256x', val: 256 },
                  { label: '512x', val: 512 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setCloudGpus(preset.val)}
                    className={`flex-1 text-[8.5px] font-mono py-1 rounded border transition-all cursor-pointer font-bold ${
                      infrastructure.cloudGpusRented === preset.val
                        ? 'bg-primary/25 border-primary text-primary shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                        : 'bg-[#0b0e15]/40 border-white/5 text-outline hover:border-white/20'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
