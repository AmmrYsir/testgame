import { useState } from 'react';
import { useGameStore } from '../store';
import RivalLogo from './RivalLogo';

const TECH_NAMES = {
  transformer: 'Transformer Base',
  web_crawling: 'Web Crawling',
  instruction_sft: 'Instruction Tuning (SFT)',
  moe: 'Mixture of Experts (MoE)',
  ssm: 'State Space Models (SSM)',
  liquid_nn: 'Liquid Neural Networks',
  textbook_acquisition: 'Textbook Acquisition',
  synthetic_data: 'Synthetic Data',
  multimodal_tokenizers: 'Multimodal Tokenizers',
  rlhf: 'RLHF Preference Alignment',
  dpo: 'Direct Preference Optimization (DPO)',
  constitutional_ai: 'Constitutional AI',
  fp8_quantization: 'FP8 Model Quantization',
  speculative_decoding: 'Speculative Decoding',
  flash_attention: 'FlashAttention Kernels'
};


export default function CompanyModal({ isOpen, onClose }) {
  const { company, rivals, countries, llms, resources, executeDeal, activeApiLeases, activeComputeLeases } = useGameStore();
  const [selectedTab, setSelectedTab] = useState('player'); // 'player', 'google', 'openai', 'anthropic'

  // Deal Modal State
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealRival, setDealRival] = useState(null);

  // Deal Offer & Request States
  const [offerCash, setOfferCash] = useState(0);
  const [offerData, setOfferData] = useState(0);
  const [offerApiLease, setOfferApiLease] = useState(false);
  const [offerApiYears, setOfferApiYears] = useState(1);
  const [offerComputeLease, setOfferComputeLease] = useState(false);
  const [offerComputeYears, setOfferComputeYears] = useState(1);

  const [requestCash, setRequestCash] = useState(0);
  const [requestData, setRequestData] = useState(0);
  const [requestApiLease, setRequestApiLease] = useState(false);
  const [requestApiYears, setRequestApiYears] = useState(1);
  const [requestComputeLease, setRequestComputeLease] = useState(false);
  const [requestComputeYears, setRequestComputeYears] = useState(1);

  const [dealFeedback, setDealFeedback] = useState(null); // { dealStatus: 'accepted'|'declined'|'error', dealMessage: '' }

  // Models Catalog Modal State
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogCompany, setCatalogCompany] = useState(null);

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

  const activeRivals = rivals || [];

  // Calculate player's capability benchmarks dynamically
  const playerStats = {
    agentic: 10,
    coding: 10,
    reasoning: 10,
    knowledge: 10,
    math: 10,
    multilingual: 10,
    multimodal: 10
  };
  if (playerModels.length > 0) {
    playerModels.forEach(m => {
      playerStats.agentic = Math.max(playerStats.agentic, m.stats.agentic || 0);
      playerStats.coding = Math.max(playerStats.coding, m.stats.coding || 0);
      playerStats.reasoning = Math.max(playerStats.reasoning, m.stats.reasoning || 0);
      playerStats.knowledge = Math.max(playerStats.knowledge, m.stats.knowledge || 0);
      playerStats.math = Math.max(playerStats.math, m.stats.math || 0);
      playerStats.multilingual = Math.max(playerStats.multilingual, m.stats.multilingual || 0);
      playerStats.multimodal = Math.max(playerStats.multimodal, m.stats.multimodal || 0);
    });
  }

  // Handle open deal modal
  const openDealModal = (rival) => {
    setDealRival(rival);
    setOfferCash(0);
    setOfferData(0);
    setOfferApiLease(false);
    setOfferApiYears(1);
    setOfferComputeLease(false);
    setOfferComputeYears(1);
    setRequestCash(0);
    setRequestData(0);
    setRequestApiLease(false);
    setRequestApiYears(1);
    setRequestComputeLease(false);
    setRequestComputeYears(1);
    setDealFeedback(null);
    setIsDealModalOpen(true);
  };

  // Propose Deal logic
  const handleProposeDeal = () => {
    if (!dealRival) return;
    const playerOffer = {
      cash: offerCash,
      data: offerData,
      apiLease: offerApiLease ? offerApiYears : 0,
      computeLease: offerComputeLease ? offerComputeYears : 0
    };
    const playerRequest = {
      cash: requestCash,
      data: requestData,
      apiLease: requestApiLease ? requestApiYears : 0,
      computeLease: requestComputeLease ? requestComputeYears : 0
    };

    const res = executeDeal(dealRival.name, playerOffer, playerRequest);
    setDealFeedback(res);
  };

  // Live valuation helper for real-time slider feedback
  const getLiveValuation = () => {
    if (!dealRival) return null;
    const baseValues = {
      cash: 1,
      data: 1500,
      apiLease: 150000,
      computeLease: 200000
    };

    const modifiers = {
      Google: { cash: 1.0, data: 0.8, apiLease: 1.2, computeLease: 1.3, greed: 0.10 },
      OpenAI: { cash: 0.8, data: 1.5, apiLease: 1.1, computeLease: 1.2, greed: 0.15 },
      Anthropic: { cash: 1.0, data: 1.0, apiLease: 1.0, computeLease: 1.5, greed: 0.05 }
    };

    const mods = modifiers[dealRival.name] || { cash: 1.0, data: 1.0, apiLease: 1.0, computeLease: 1.0, greed: 0.1 };

    let offeredVal = 0;
    offeredVal += offerCash * mods.cash;
    offeredVal += offerData * baseValues.data * mods.data;
    if (offerApiLease) offeredVal += baseValues.apiLease * offerApiYears * mods.apiLease;
    if (offerComputeLease) offeredVal += baseValues.computeLease * offerComputeYears * mods.computeLease;

    let requestedVal = 0;
    requestedVal += requestCash * mods.cash;
    requestedVal += requestData * baseValues.data * mods.data;
    if (requestApiLease) requestedVal += baseValues.apiLease * requestApiYears * mods.apiLease;
    if (requestComputeLease) requestedVal += baseValues.computeLease * requestComputeYears * mods.computeLease;

    const requiredVal = requestedVal * (1 + mods.greed);
    const difference = offeredVal - requiredVal;

    return {
      offeredVal,
      requiredVal,
      isAcceptable: offeredVal >= requiredVal,
      difference
    };
  };

  const liveVal = getLiveValuation();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-fade-in text-on-surface animate-fade-in">
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
                      <RivalLogo name={rival.name} className="w-4.5 h-4.5 shrink-0" fallbackLogo={rival.logo || 'smart_toy'} />
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
          <div className="w-[65%] flex flex-col h-full bg-surface-container-low/20 overflow-y-auto p-lg gap-lg text-left">
            
            {/* Inspector Details */}
            {(() => {
              const isPlayer = selectedTab === 'player';
              const rival = activeRivals.find(r => r.name.toLowerCase() === selectedTab);
              
              if (!isPlayer && !rival) return null;

              const name = isPlayer ? (company.name || 'YOUR CORPORATION') : rival.name;
              const leader = isPlayer ? (company.founder || 'You') : (rival.name === 'Google' ? 'Larry & Sergey' : rival.name === 'OpenAI' ? 'Sam Altman' : 'Dario Amodei');
              const hqName = isPlayer ? hqCountry : 'United States';
              const color = isPlayer ? company.color : (rival.color || '#ea580c');
              const logo = isPlayer ? (company.logo || 'memory') : (rival.logo || 'smart_toy');
              const isActive = isPlayer ? true : rival.active;
              const yearEst = isPlayer ? 2020 : rival.yearEst;

              // Grid values
              const cashVal = isPlayer ? resources.cash : (rival.cash || 0);
              const computeVal = isPlayer ? resources.compute : (rival.compute || 0);
              const shareVal = isPlayer ? playerGlobalShare : (rival.share || 0);
              const flagshipVal = isPlayer 
                ? (playerModels.length > 0 ? playerModels.sort((a, b) => b.rating - a.rating)[0].name : 'None') 
                : rival.bestModel;

              return (
                <div className="space-y-lg animate-fade-in">
                  {/* Header Profile */}
                  <div className="flex items-start justify-between border-b border-white/5 pb-md">
                    <div>
                      <h2 className="text-xl font-bold text-on-surface tracking-tight uppercase">{name}</h2>
                      <p className="text-xs text-outline mt-1">
                        Leader: <strong className="text-on-surface">{leader}</strong> • HQ: <strong style={{ color: color }}>{hqName}</strong>
                      </p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                      style={{ 
                        backgroundColor: `${color}20`, 
                        color: isActive ? color : '#94a3b8' 
                      }}
                    >
                      {isPlayer ? (
                        <span className="material-symbols-outlined text-2xl">{logo}</span>
                      ) : (
                        <RivalLogo name={name} className="w-6 h-6" fallbackLogo={logo} />
                      )}
                    </div>
                  </div>

                  {!isActive ? (
                    /* Locked Stealth Rival Screen */
                    <div className="py-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-lg gap-sm bg-surface-dim/10">
                      <span className="material-symbols-outlined text-outline text-4xl animate-pulse">lock</span>
                      <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Stealth Mode (Inactive)</h3>
                      <p className="text-xs text-outline max-w-sm leading-relaxed">
                        {name} is currently operating in stealth. They will officially enter the global AI market and unlock for negotiations and trading in the year <strong>{yearEst}</strong>.
                      </p>
                    </div>
                  ) : (
                    /* Active Company View */
                    <>
                      {/* Consistent Performance Metrics Grid */}
                      <div className="grid grid-cols-2 gap-sm">
                        <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
                          <span className="text-[9px] text-outline block uppercase tracking-wider">Cash Reserves</span>
                          <span className="font-bold text-sm text-on-surface">${cashVal.toLocaleString()}</span>
                        </div>
                        <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
                          <span className="text-[9px] text-outline block uppercase tracking-wider">Compute Capacity</span>
                          <span className="font-bold text-sm text-on-surface">{computeVal.toFixed(0)} PFLOPS</span>
                        </div>
                        <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
                          <span className="text-[9px] text-outline block uppercase tracking-wider">Global Market Share</span>
                          <span className="font-bold text-sm" style={{ color: color }}>{shareVal}%</span>
                        </div>
                        <div className="bg-[#12151c]/60 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
                          <span className="text-[9px] text-outline block uppercase tracking-wider">Flagship Model</span>
                          <span className="font-bold text-sm text-on-surface truncate block" title={flagshipVal}>{flagshipVal}</span>
                        </div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => {
                            setCatalogCompany(isPlayer ? 'player' : name);
                            setIsCatalogModalOpen(true);
                          }}
                          className="px-4 py-1.5 rounded-lg border border-white/10 bg-[#12151c]/60 hover:bg-[#12151c]/90 text-on-surface text-xs font-semibold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 hover:border-white/20 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          View Released Models
                        </button>
                      </div>

                      {isPlayer ? null : (
                        <div className="space-y-lg border-t border-white/5 pt-sm">
                          {/* Active Operations & Unlocked Tech */}
                          <div className="space-y-md">
                            <h3 className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">Active Operations</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                              {/* R&D Status */}
                              <div className="bg-[#12151c]/40 p-3 rounded-lg border border-white/5 flex flex-col justify-between min-h-[90px]">
                                <div>
                                  <span className="text-[9.5px] text-outline block uppercase tracking-wider font-mono">Current R&D</span>
                                  <span className="font-bold text-xs text-on-surface mt-1.5 block">
                                    {rival.activeResearch 
                                      ? (TECH_NAMES[rival.activeResearch.techId] || rival.activeResearch.techId)
                                      : 'Idle (No Active Research)'}
                                  </span>
                                </div>
                                {rival.activeResearch && (
                                  <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-[9px] text-outline font-mono">
                                      <span>Progress ({rival.activeResearch.progress}/{rival.activeResearch.totalTicks} days)</span>
                                      <span>{Math.round((rival.activeResearch.progress / rival.activeResearch.totalTicks) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-[#0b0e15] h-1.5 rounded-full overflow-hidden border border-white/5">
                                      <div 
                                        className="bg-primary h-full rounded-full transition-all duration-300"
                                        style={{ width: `${(rival.activeResearch.progress / rival.activeResearch.totalTicks) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Training Status */}
                              <div className="bg-[#12151c]/40 p-3 rounded-lg border border-white/5 flex flex-col justify-between min-h-[90px]">
                                <div>
                                  <span className="text-[9.5px] text-outline block uppercase tracking-wider font-mono">Pre-Training Run</span>
                                  <span className="font-bold text-xs text-on-surface mt-1.5 block">
                                    {rival.activeTraining 
                                      ? rival.activeTraining.modelName 
                                      : 'Idle (No Active Training)'}
                                  </span>
                                </div>
                                {rival.activeTraining && (
                                  <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-[9px] text-outline font-mono">
                                      <span>Progress ({rival.activeTraining.progress}/{rival.activeTraining.totalTicks} days)</span>
                                      <span>{Math.round((rival.activeTraining.progress / rival.activeTraining.totalTicks) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-[#0b0e15] h-1.5 rounded-full overflow-hidden border border-white/5">
                                      <div 
                                        className="bg-secondary h-full rounded-full transition-all duration-300"
                                        style={{ width: `${(rival.activeTraining.progress / rival.activeTraining.totalTicks) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Unlocked Technologies */}
                            <div className="space-y-1.5">
                              <span className="text-[9.5px] text-outline block uppercase tracking-wider font-mono">Unlocked Technologies</span>
                              <div className="flex flex-wrap gap-1.5">
                                {rival.unlockedTech && rival.unlockedTech.length > 0 ? (
                                  rival.unlockedTech.map(techId => {
                                    const name = TECH_NAMES[techId] || techId;
                                    return (
                                      <span 
                                        key={techId} 
                                        className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-on-surface font-mono"
                                      >
                                        {name}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="text-xs text-outline italic">No technology unlocked.</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Rivals Action Panel: Request For Deal */}
                          <div className="space-y-md border-t border-white/5 pt-md">
                            <h3 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider text-[10px]">Commercial Relations</h3>
                            <div className="bg-[#12151c]/40 p-lg rounded-xl border border-white/5 space-y-sm flex flex-col justify-center text-center">
                              <span className="material-symbols-outlined text-outline text-3xl">handshake</span>
                              <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider mt-1">Barter & Partnership Agreements</h4>
                              <p className="text-[11px] text-outline max-w-md mx-auto leading-relaxed">
                                Negotiate bilateral transactions with {name}. Offer your Cash or Proprietary Crawled Data to acquire their resources, set up shared training runs, or lease their API pipeline to speed up your operations.
                              </p>
                              <button
                                onClick={() => openDealModal(rival)}
                                className="mt-2 mx-auto px-6 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all border border-transparent bg-[#10b981] hover:bg-[#059669] text-white hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                              >
                                Request For Deal
                              </button>
                            </div>

                            {/* Active Agreements section */}
                            {(() => {
                              const rivalApiLeases = (activeApiLeases || []).filter(l => l.company === name);
                              const rivalComputeLeases = (activeComputeLeases || []).filter(l => l.company === name);
                              const hasActiveAgreements = rivalApiLeases.length > 0 || rivalComputeLeases.length > 0;
                              if (!hasActiveAgreements) return null;
                              return (
                                <div className="mt-md space-y-sm bg-[#12151c]/40 p-md rounded-xl border border-white/5">
                                  <h4 className="font-bold text-[10px] text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                                    <span className="material-symbols-outlined text-sm text-[#10b981]">verified_user</span>
                                    Active Agreements ({rivalApiLeases.length + rivalComputeLeases.length})
                                  </h4>
                                  <div className="space-y-2">
                                    {rivalApiLeases.map((lease, idx) => (
                                      <div key={`api-lease-${idx}`} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5 text-[11px]">
                                        <div className="flex items-center gap-2">
                                          <span className="material-symbols-outlined text-[#10b981] text-md">
                                            {lease.type === 'outgoing' ? 'upload' : 'download'}
                                          </span>
                                          <div>
                                            <span className="font-semibold text-on-surface block">
                                              {lease.type === 'outgoing' ? 'Model API Leased to Them' : 'Lease Model API Access'}
                                            </span>
                                            <span className="text-[9px] text-outline">
                                              {lease.type === 'outgoing' ? 'Outbound API Funnel' : 'Inbound Training speed (+20%)'}
                                            </span>
                                          </div>
                                        </div>
                                        <span className="font-mono text-outline bg-white/5 px-2 py-0.5 rounded text-[10px]">
                                          {lease.ticksLeft} days left ({(lease.ticksLeft / 365).toFixed(1)} yr)
                                        </span>
                                      </div>
                                    ))}
                                    {rivalComputeLeases.map((lease, idx) => (
                                      <div key={`compute-lease-${idx}`} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5 text-[11px]">
                                        <div className="flex items-center gap-2">
                                          <span className="material-symbols-outlined text-primary text-md">
                                            {lease.type === 'outgoing' ? 'dns' : 'memory'}
                                          </span>
                                          <div>
                                            <span className="font-semibold text-on-surface block">
                                              {lease.type === 'outgoing' ? 'Compute Leased to Them' : 'Lease Compute Power'}
                                            </span>
                                            <span className="text-[9px] text-outline">
                                              {lease.type === 'outgoing' ? 'Outbound -200 PFLOPS' : 'Inbound +200 PFLOPS'}
                                            </span>
                                          </div>
                                        </div>
                                        <span className="font-mono text-outline bg-white/5 px-2 py-0.5 rounded text-[10px]">
                                          {lease.ticksLeft} days left ({(lease.ticksLeft / 365).toFixed(1)} yr)
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* NESTED DEAL BARTER MODAL */}
      {isDealModalOpen && dealRival && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-[110] p-6 animate-fade-in text-left">
          <div className="glass-panel w-full max-w-[800px] rounded-xl flex flex-col overflow-hidden shadow-2xl border border-white/10 bg-[#161a24] p-lg gap-md relative">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-md">
              <h3 className="font-bold text-md text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b981]">handshake</span>
                Barter Proposal: {dealRival.name}
              </h3>
              <button
                onClick={() => setIsDealModalOpen(false)}
                className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Split Column Panel */}
            <div className="grid grid-cols-2 gap-lg my-sm">
              
              {/* Left Column: Player Offer */}
              <div className="space-y-md bg-[#0f121a]/60 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  What You Offer
                </h4>
                
                {/* Cash slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-outline">
                    <span>Cash Transferred</span>
                    <span className="font-bold text-on-surface">${offerCash.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={resources.cash}
                    step={Math.max(10000, Math.floor(resources.cash / 100))}
                    value={offerCash}
                    onChange={(e) => {
                      setOfferCash(Number(e.target.value));
                      setDealFeedback(null);
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-outline opacity-60">
                    <span>$0</span>
                    <span>Max: ${resources.cash.toLocaleString()}</span>
                  </div>
                </div>

                {/* Data slider */}
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-[11px] font-mono text-outline">
                    <span>Proprietary Data</span>
                    <span className="font-bold text-on-surface">{offerData} TB</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={resources.data || 0}
                    step={Math.max(1, Math.floor((resources.data || 0) / 100))}
                    value={offerData}
                    onChange={(e) => {
                      setOfferData(Number(e.target.value));
                      setDealFeedback(null);
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-outline opacity-60">
                    <span>0 TB</span>
                    <span>Max: {(resources.data || 0)} TB</span>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={offerApiLease}
                        disabled={playerModels.length === 0}
                        onChange={(e) => {
                          setOfferApiLease(e.target.checked);
                          setDealFeedback(null);
                        }}
                        className="accent-primary rounded bg-black/40 border-white/10"
                      />
                      <span className={playerModels.length === 0 ? "text-outline/40 cursor-not-allowed" : "text-on-surface"}>
                        Lease Model API Access {playerModels.length === 0 && <span className="text-[9px] text-error block">(Needs released model)</span>}
                      </span>
                    </label>
                    {offerApiLease && (
                      <div className="pl-5 pt-1 space-y-1">
                        <div className="flex justify-between text-[10px] text-outline font-mono">
                          <span>API Lease Duration</span>
                          <span className="text-on-surface font-bold">{offerApiYears} Year{offerApiYears > 1 ? 's' : ''}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={offerApiYears}
                          onChange={(e) => {
                            setOfferApiYears(Number(e.target.value));
                            setDealFeedback(null);
                          }}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={offerComputeLease}
                        disabled={resources.compute < 200}
                        onChange={(e) => {
                          setOfferComputeLease(e.target.checked);
                          setDealFeedback(null);
                        }}
                        className="accent-primary rounded bg-black/40 border-white/10"
                      />
                      <span className={resources.compute < 200 ? "text-outline/40 cursor-not-allowed" : "text-on-surface"}>
                        Lease Compute Power (200 PFLOPS) {resources.compute < 200 && <span className="text-[9px] text-error block">(Needs 200 PFLOPS compute capacity)</span>}
                      </span>
                    </label>
                    {offerComputeLease && (
                      <div className="pl-5 pt-1 space-y-1">
                        <div className="flex justify-between text-[10px] text-outline font-mono">
                          <span>Compute Lease Duration</span>
                          <span className="text-on-surface font-bold">{offerComputeYears} Year{offerComputeYears > 1 ? 's' : ''}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={offerComputeYears}
                          onChange={(e) => {
                            setOfferComputeYears(Number(e.target.value));
                            setDealFeedback(null);
                          }}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Rival Request */}
              <div className="space-y-md bg-[#0f121a]/60 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-xs text-[#10b981] uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  What You Request
                </h4>
                
                {/* Cash slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-outline">
                    <span>Cash Transferred</span>
                    <span className="font-bold text-on-surface">${requestCash.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={dealRival.cash || 100000}
                    step={Math.max(10000, Math.floor((dealRival.cash || 100000) / 100))}
                    value={requestCash}
                    onChange={(e) => {
                      setRequestCash(Number(e.target.value));
                      setDealFeedback(null);
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                  />
                  <div className="flex justify-between text-[9px] text-outline opacity-60">
                    <span>$0</span>
                    <span>Max: ${(dealRival.cash || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Data slider */}
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-[11px] font-mono text-outline">
                    <span>Rival Data</span>
                    <span className="font-bold text-on-surface">{requestData} TB</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={dealRival.data || 100}
                    step={Math.max(1, Math.floor((dealRival.data || 100) / 100))}
                    value={requestData}
                    onChange={(e) => {
                      setRequestData(Number(e.target.value));
                      setDealFeedback(null);
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                  />
                  <div className="flex justify-between text-[9px] text-outline opacity-60">
                    <span>0 TB</span>
                    <span>Max: {(dealRival.data || 0)} TB</span>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={requestApiLease}
                        onChange={(e) => {
                          setRequestApiLease(e.target.checked);
                          setDealFeedback(null);
                        }}
                        className="accent-[#10b981] rounded bg-black/40 border-white/10"
                      />
                      <span className="text-on-surface">Lease Model API Access</span>
                    </label>
                    {requestApiLease && (
                      <div className="pl-5 pt-1 space-y-1">
                        <div className="flex justify-between text-[10px] text-outline font-mono">
                          <span>API Lease Duration</span>
                          <span className="text-on-surface font-bold">{requestApiYears} Year{requestApiYears > 1 ? 's' : ''}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={requestApiYears}
                          onChange={(e) => {
                            setRequestApiYears(Number(e.target.value));
                            setDealFeedback(null);
                          }}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={requestComputeLease}
                        disabled={(dealRival.compute || 0) < 200}
                        onChange={(e) => {
                          setRequestComputeLease(e.target.checked);
                          setDealFeedback(null);
                        }}
                        className="accent-[#10b981] rounded bg-black/40 border-white/10"
                      />
                      <span className={(dealRival.compute || 0) < 200 ? "text-outline/40 cursor-not-allowed" : "text-on-surface"}>
                        Lease Compute Power (200 PFLOPS) {(dealRival.compute || 0) < 200 && <span className="text-[9px] text-error block">(Rival needs 200 PFLOPS compute)</span>}
                      </span>
                    </label>
                    {requestComputeLease && (
                      <div className="pl-5 pt-1 space-y-1">
                        <div className="flex justify-between text-[10px] text-outline font-mono">
                          <span>Compute Lease Duration</span>
                          <span className="text-on-surface font-bold">{requestComputeYears} Year{requestComputeYears > 1 ? 's' : ''}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={requestComputeYears}
                          onChange={(e) => {
                            setRequestComputeYears(Number(e.target.value));
                            setDealFeedback(null);
                          }}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Live Valuation Panel */}
            {liveVal && (
              <div className="p-3 bg-[#080a0f] rounded-lg border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-outline uppercase font-mono">Real-time Proposal Balance</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-outline">Offered: <strong className="text-primary">${Math.round(liveVal.offeredVal).toLocaleString()}</strong></span>
                    <span className="text-outline opacity-40">|</span>
                    <span className="text-outline">Required: <strong className="text-[#10b981]">${Math.round(liveVal.requiredVal).toLocaleString()}</strong></span>
                  </div>
                </div>
                <div>
                  {liveVal.isAcceptable ? (
                    <span className="text-[#10b981] font-bold font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Proposals Balanced
                    </span>
                  ) : (
                    <span className="text-[#f59e0b] font-mono flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-base">warning</span>
                      Deficit: -${Math.ceil(Math.abs(liveVal.difference)).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Deal Feedback message area */}
            {dealFeedback && (
              <div className={`p-3 rounded-lg text-xs font-medium border ${
                dealFeedback.dealStatus === 'accepted'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {dealFeedback.dealMessage}
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex justify-between items-center border-t border-white/10 pt-md mt-sm">
              <button
                onClick={() => setIsDealModalOpen(false)}
                className="px-5 py-2 rounded-lg border border-white/10 text-outline hover:text-on-surface hover:bg-white/5 font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
              >
                Back to profile
              </button>

              <button
                disabled={dealFeedback?.dealStatus === 'accepted'}
                onClick={handleProposeDeal}
                className={`px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-sm transition-all border ${
                  dealFeedback?.dealStatus === 'accepted'
                    ? 'bg-emerald-600/30 border-transparent text-emerald-400/50 cursor-not-allowed'
                    : 'bg-[#10b981] text-white border-transparent hover:bg-[#059669] hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer'
                }`}
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Propose Exchange</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NESTED MODELS CATALOG MODAL */}
      {isCatalogModalOpen && catalogCompany && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-[120] p-6 animate-fade-in text-left">
          <div className="glass-panel w-full max-w-[650px] rounded-xl flex flex-col overflow-hidden shadow-2xl border border-white/10 bg-[#161a24] p-lg gap-md relative">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-md">
              <h3 className="font-bold text-md text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility</span>
                Models Catalogue: {catalogCompany === 'player' ? company.name || 'Your Corporation' : catalogCompany}
              </h3>
              <button
                onClick={() => setIsCatalogModalOpen(false)}
                className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Models List Scrollable Container */}
            <div className="space-y-md overflow-y-auto max-h-[450px] pr-2 mt-sm">
              {(() => {
                let companyModels;
                if (catalogCompany === 'player') {
                  companyModels = llms
                    .filter(m => m.status === 'released')
                    .map(m => ({
                      name: `${m.name} v${m.version}`,
                      stats: m.stats,
                      isPlayerModel: true,
                      releaseType: m.releaseType
                    }));
                } else {
                  const targetRival = rivals.find(r => r.name === catalogCompany);
                  companyModels = (targetRival?.models || []).map(m => ({
                    name: m.name,
                    stats: m.stats,
                    isPlayerModel: false
                  }));
                }

                if (companyModels.length === 0) {
                  return (
                    <div className="py-8 text-center text-xs text-outline border border-dashed border-white/10 rounded-lg">
                      No released models found for this company.
                    </div>
                  );
                }

                // Sort models in reverse order so newest are on top
                return companyModels.slice().reverse().map((model, index) => (
                  <div key={index} className="bg-[#12151c]/60 p-md rounded-xl border border-white/5 space-y-sm">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-bold text-xs text-on-surface uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        {model.name}
                      </span>
                      {model.isPlayerModel && (
                        <span className="text-[9px] font-bold font-mono text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded uppercase">
                          {model.releaseType || 'Commercial'}
                        </span>
                      )}
                    </div>

                    {/* Stats bar grid */}
                    <div className="grid grid-cols-2 gap-x-lg gap-y-2 pt-1">
                      {Object.entries(model.stats || {}).map(([stat, val]) => (
                        <div key={stat} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-outline">
                            <span>{stat}</span>
                            <span className="font-bold text-on-surface">{val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${val}%`, 
                                background: 'linear-gradient(to right, #3b82f6, #60a5fa)' 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-white/10 pt-md mt-sm">
              <button
                onClick={() => setIsCatalogModalOpen(false)}
                className="px-5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface cursor-pointer"
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
