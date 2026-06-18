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

  // Find OpenAI and Anthropic details from store
  const openaiRival = rivals.find(r => r.name === 'OpenAI') || { name: 'OpenAI', bestModel: 'GPT 3.0', share: 60, stats: { knowledge: 35, coding: 20, math: 15, creativity: 40, hallucination: 40 } };
  const anthropicRival = rivals.find(r => r.name === 'Anthropic') || { name: 'Anthropic', bestModel: 'Claude 1.0', share: 30, stats: { knowledge: 40, coding: 25, math: 20, creativity: 45, hallucination: 35 } };

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
                    Player (HQ: {hqCountry})
                  </span>
                </div>
                {selectedTab === 'player' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary absolute right-3"></span>
                )}
              </button>

              {/* OpenAI Tab */}
              <button
                onClick={() => setSelectedTab('openai')}
                className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 relative ${
                  selectedTab === 'openai'
                    ? 'bg-[#ea580c]/10 border-[#ea580c]/30 shadow-[0_0_12px_rgba(234,88,12,0.15)]'
                    : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-base">smart_toy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate block">
                    OpenAI
                  </span>
                  <span className="text-[9px] text-orange-400 font-mono uppercase tracking-wider font-semibold">
                    Rival Corporation
                  </span>
                </div>
                {selectedTab === 'openai' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 absolute right-3"></span>
                )}
              </button>

              {/* Anthropic Tab */}
              <button
                onClick={() => setSelectedTab('anthropic')}
                className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 relative ${
                  selectedTab === 'anthropic'
                    ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                    : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-base">radar</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate block">
                    Anthropic
                  </span>
                  <span className="text-[9px] text-purple-400 font-mono uppercase tracking-wider font-semibold">
                    Rival Corporation
                  </span>
                </div>
                {selectedTab === 'anthropic' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 absolute right-3"></span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Company Inspector (65% width) */}
          <div className="w-[65%] flex flex-col h-full bg-surface-container-low/20 overflow-y-auto p-lg gap-lg">
            
            {/* Player Company details */}
            {selectedTab === 'player' && (
              <div className="space-y-lg text-left">
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

            {/* OpenAI details */}
            {selectedTab === 'openai' && (
              <div className="space-y-lg text-left">
                {/* Header Profile */}
                <div className="flex items-start justify-between border-b border-white/5 pb-md">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface tracking-tight">OPENAI</h2>
                    <p className="text-xs text-outline mt-1">Leading silicon valley rival corporation • San Francisco, CA, US</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-2xl">smart_toy</span>
                  </div>
                </div>

                {/* Core Stats Overview */}
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Flagship Model</span>
                    <span className="font-bold text-sm text-on-surface">{openaiRival.bestModel}</span>
                  </div>
                  <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Global Target Share</span>
                    <span className="font-bold text-sm text-orange-400">{openaiRival.share}%</span>
                  </div>
                </div>

                {/* Capabilities Grid */}
                <div className="space-y-md border-t border-white/5 pt-sm">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider text-[10px]">Model Capability Benchmarks</h3>
                  
                  <div className="space-y-3">
                    {Object.entries(openaiRival.stats).map(([stat, val]) => (
                      <div key={stat} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                          <span className="text-[10px]">{stat}</span>
                          <span className="font-bold text-orange-400">{val} / 100</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" style={{ width: `${val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Anthropic details */}
            {selectedTab === 'anthropic' && (
              <div className="space-y-lg text-left">
                {/* Header Profile */}
                <div className="flex items-start justify-between border-b border-white/5 pb-md">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface tracking-tight">ANTHROPIC</h2>
                    <p className="text-xs text-outline mt-1">Safety-focused research lab competitor • San Francisco, CA, US</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-2xl">radar</span>
                  </div>
                </div>

                {/* Core Stats Overview */}
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Flagship Model</span>
                    <span className="font-bold text-sm text-on-surface">{anthropicRival.bestModel}</span>
                  </div>
                  <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Global Target Share</span>
                    <span className="font-bold text-sm text-purple-400">{anthropicRival.share}%</span>
                  </div>
                </div>

                {/* Capabilities Grid */}
                <div className="space-y-md border-t border-white/5 pt-sm">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider text-[10px]">Model Capability Benchmarks</h3>
                  
                  <div className="space-y-3">
                    {Object.entries(anthropicRival.stats).map(([stat, val]) => (
                      <div key={stat} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                          <span className="text-[10px]">{stat}</span>
                          <span className="font-bold text-purple-400">{val} / 100</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: `${val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
