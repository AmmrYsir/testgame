import { useState } from 'react';
import { useGameStore } from '../store';

export default function CompanyModal({ isOpen, onClose }) {
  const { company, rivals, countries, llms, resources } = useGameStore();
  const [selectedTab, setSelectedTab] = useState('player'); // 'player', 'openai', 'anthropic'

  if (!isOpen) return null;

  // Find HQ Country Name
  const hqCountry = countries[company.hqCountryId]?.name || 'Not Established';

  // Get active released models for player
  const playerModels = llms.filter(m => m.status === 'released');

  // Compute player's total global share
  const activeCountries = Object.values(countries);
  const totalDemand = activeCountries.reduce((sum, c) => sum + c.demand, 0);
  const playerShareWeighted = activeCountries.reduce((sum, c) => sum + (c.playerShare * c.demand), 0);
  const playerGlobalShare = totalDemand > 0 ? Math.round(playerShareWeighted / totalDemand) : 0;

  // Find OpenAI, Google, and Anthropic details from store
  const activeRivals = rivals || [];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-fade-in">
      <div
        className="glass-panel w-full max-w-[900px] h-[550px] rounded-xl flex flex-col overflow-hidden shadow-2xl relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-lg py-4 border-b border-white/10 bg-surface-container/60 flex justify-between items-center flex-none">
          <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">corporate_fare</span>
            AI Industry Competitors
          </h3>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Company Selector (35% width) */}
          <div className="w-[35%] border-r border-white/10 flex flex-col h-full bg-surface-dim/20">
            <div className="p-3 border-b border-white/5 bg-surface-container-low/30 text-[10px] text-outline uppercase font-semibold tracking-wider px-4">
              Organizations
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {/* Player Company Tab */}
              <button
                onClick={() => setSelectedTab('player')}
                className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 relative ${
                  selectedTab === 'player'
                    ? 'bg-primary/10 border-primary/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                    : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                  style={{ backgroundColor: `${company.color}20`, color: company.color }}
                >
                  <span className="material-symbols-outlined text-base">{company.logo || 'memory'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate block uppercase">
                    {company.name || 'Your Company'}
                  </span>
                  <span className="text-[9px] text-primary font-mono uppercase tracking-wider font-semibold">
                    Player (Est. 2020)
                  </span>
                </div>
                {selectedTab === 'player' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary absolute right-3"></span>
                )}
              </button>

              {/* Rivals Tabs */}
              {activeRivals.map((rival) => {
                const rivalId = rival.name.toLowerCase();
                const isSelected = selectedTab === rivalId;
                const isRivalActive = rival.active;
                const activeColor = rival.color || '#ea580c';

                return (
                  <button
                    key={rival.name}
                    onClick={() => setSelectedTab(rivalId)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 relative ${
                      isSelected
                        ? 'bg-surface-bright/10 border-white/20'
                        : 'hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                      style={{ 
                        backgroundColor: `${activeColor}20`, 
                        color: isRivalActive ? activeColor : '#94a3b8' 
                      }}
                    >
                      <span className="material-symbols-outlined text-base">{rival.logo || 'smart_toy'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-bold truncate block ${isRivalActive ? 'text-on-surface' : 'text-outline-variant'}`}>
                        {rival.name}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider font-semibold" style={{ color: isRivalActive ? activeColor : '#64748b' }}>
                        {isRivalActive ? `Established ${rival.yearEst}` : `Launches in ${rival.yearEst}`}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full absolute right-3" style={{ backgroundColor: activeColor }}></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Company Inspector (65% width) */}
          <div className="w-[65%] flex flex-col h-full bg-surface-container-low/20 overflow-y-auto p-lg gap-lg">
            
            {/* Player Company details */}
            {selectedTab === 'player' && (
              <div className="space-y-lg text-left animate-fade-in">
                {/* Header Profile */}
                <div className="flex items-start justify-between border-b border-white/5 pb-md">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface tracking-tight uppercase">{company.name || 'YOUR CORPORATION'}</h2>
                    <p className="text-xs text-outline mt-1">Founded by <strong className="text-on-surface">{company.founder || 'You'}</strong> • HQ established in <strong className="text-primary">{hqCountry}</strong></p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: `${company.color}20`, color: company.color }}
                  >
                    <span className="material-symbols-outlined text-2xl">{company.logo || 'memory'}</span>
                  </div>
                </div>

                {/* Core Stats Overview */}
                <div className="grid grid-cols-3 gap-sm">
                  <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Cash Reserves</span>
                    <span className="font-bold text-sm text-on-surface">${resources.cash.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Total Compute</span>
                    <span className="font-bold text-sm text-on-surface">{resources.compute.toFixed(1)} PFLOPS</span>
                  </div>
                  <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Global Share</span>
                    <span className="font-bold text-sm text-primary">{playerGlobalShare}%</span>
                  </div>
                </div>

                {/* Released Models List */}
                <div className="space-y-sm">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider text-[10px]">Active Released Models</h3>
                  {playerModels.length === 0 ? (
                    <div className="py-8 border border-dashed border-white/10 rounded-lg text-center text-xs text-outline italic">
                      No models have been released to the market yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-sm max-h-[180px] overflow-y-auto custom-scrollbar">
                      {playerModels.map(m => (
                        <div key={m.id} className="bg-[#12151c]/40 p-3 rounded-lg border border-white/5 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-xs text-on-surface truncate">{m.name}</span>
                            <span className="text-[9px] px-1 bg-primary/20 border border-primary/30 text-primary rounded font-mono font-bold">
                              v{m.version.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-outline">
                            <span>Rating: <strong className="text-on-surface">{Math.round(m.rating)}</strong></span>
                            <span>Users: <strong className="text-on-surface">{m.marketMetrics?.users?.toLocaleString() || 0}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rival details inspector */}
            {selectedTab !== 'player' && (() => {
              const selectedRival = activeRivals.find(r => r.name.toLowerCase() === selectedTab);
              if (!selectedRival) return null;

              const isRivalActive = selectedRival.active;
              const rivalColor = selectedRival.color || '#ea580c';

              return (
                <div className="space-y-lg text-left animate-fade-in">
                  {/* Header Profile */}
                  <div className="flex items-start justify-between border-b border-white/5 pb-md">
                    <div>
                      <h2 className="text-xl font-bold text-on-surface tracking-tight uppercase">{selectedRival.name}</h2>
                      <p className="text-xs text-outline mt-1">
                        {isRivalActive 
                          ? `Active rival corporation established in ${selectedRival.yearEst}` 
                          : `Projected market entry in the year ${selectedRival.yearEst}`}
                      </p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                      style={{ 
                        backgroundColor: `${rivalColor}20`, 
                        color: isRivalActive ? rivalColor : '#94a3b8' 
                      }}
                    >
                      <span className="material-symbols-outlined text-2xl">{selectedRival.logo || 'smart_toy'}</span>
                    </div>
                  </div>

                  {!isRivalActive ? (
                    /* Locked Rival Screen */
                    <div className="py-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-lg gap-sm bg-surface-dim/10">
                      <span className="material-symbols-outlined text-outline text-4xl animate-pulse">lock</span>
                      <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Startup Stage (Inactive)</h3>
                      <p className="text-xs text-outline max-w-sm leading-relaxed">
                        {selectedRival.name} is currently in stealth mode and has not yet launched. They will officially enter the global AI market and begin competing for share in the year <strong>{selectedRival.yearEst}</strong>.
                      </p>
                    </div>
                  ) : (
                    /* Active Rival Screen */
                    <>
                      {/* Core Stats Overview */}
                      <div className="grid grid-cols-2 gap-sm">
                        <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] text-outline block uppercase tracking-wider">Flagship Model</span>
                          <span className="font-bold text-sm text-on-surface">{selectedRival.bestModel}</span>
                        </div>
                        <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] text-outline block uppercase tracking-wider">Global Target Share</span>
                          <span className="font-bold text-sm" style={{ color: rivalColor }}>
                            {selectedRival.share > 0 ? `${selectedRival.share}%` : 'Dynamic'}
                          </span>
                        </div>
                      </div>

                      {/* Capabilities Grid */}
                      <div className="space-y-md border-t border-white/5 pt-sm">
                        <h3 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider text-[10px]">Model Capability Benchmarks</h3>
                        
                        <div className="space-y-3">
                          {Object.entries(selectedRival.stats).map(([stat, val]) => (
                            <div key={stat} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                                <span className="text-[10px]">{stat}</span>
                                <span className="font-bold" style={{ color: rivalColor }}>{val} / 100</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ 
                                    width: `${val}%`, 
                                    background: `linear-gradient(to right, ${rivalColor}cc, ${rivalColor})` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

          </div>
        </div>
      </div>
    </div>
  );
}
