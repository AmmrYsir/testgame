import { useState, useEffect, memo, useCallback } from 'react';
import TopBar from './TopBar';
import ModelModal from './ModelModal';
import TrainingCompletionPopup from './TrainingCompletionPopup';
import InfrastructureModal from './InfrastructureModal';
import ResearchModal from './ResearchModal';
import MailboxModal from './MailboxModal';
import BottomLogsDrawer from './BottomLogsDrawer';
import CompanyModal from './CompanyModal';
import AdminModal from './AdminModal';
import { useGameStore } from '../store';
import worldSvg from '../assets/world.svg?raw';

export default function TycoonUI() {
  const { 
    countries, 
    llms, 
    infrastructure, 
    initCountry, 
    allocateGpusToCountry,
    company,
    rivals,
    establishHq,
    openMarket,
    resources,
    subscriptionTiers
  } = useGameStore();

  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const country = selectedCountryId ? countries[selectedCountryId] : null;

  const totalGpus = infrastructure.gpus + (infrastructure.cloudGpusRented || 0);
  const trainingGpus = llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
  const allocatedToOthers = Object.entries(countries).reduce((sum, [cid, c]) => {
    if (cid === selectedCountryId) return sum;
    return sum + (c.allocatedGpus || 0);
  }, 0);
  const idleGpus = totalGpus - trainingGpus - allocatedToOthers;
  const countryAllocatedGpus = country?.allocatedGpus || 0;
  const maxAllocatable = idleGpus + countryAllocatedGpus;

  const handleMapClick = useCallback((e) => {
    const path = e.target.closest('path');
    if (path) {
      const id = path.getAttribute('id');
      const title = path.getAttribute('title') || id;
      initCountry(id, title);
      setSelectedCountryId(id);
    } else {
      setSelectedCountryId(null);
    }
  }, [initCountry, setSelectedCountryId]);

  const handleMapMouseMove = useCallback((e) => {
    const path = e.target.closest('path');
    if (path) {
      const id = path.getAttribute('id');
      const title = path.getAttribute('title') || id;
      const countryState = countries[id];
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredCountry({
        name: title,
        playerShare: countryState ? countryState.playerShare : 0,
        openaiShare: countryState ? countryState.openaiShare : 60,
        googleShare: countryState ? (countryState.googleShare || 0) : 40,
        anthropicShare: countryState ? countryState.anthropicShare : 0,
        openMarkets: countryState ? countryState.openMarkets : { openai: true, google: true },
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15
      });
    } else {
      setHoveredCountry(null);
    }
  }, [countries]);

  const handleMapMouseLeave = useCallback(() => {
    setHoveredCountry(null);
  }, []);



  return (
    <div className="flex flex-col h-screen w-screen bg-background text-on-surface overflow-hidden dark relative">
      <TopBar onMailboxToggle={() => setIsMailboxOpen(true)} />

      {/* HQ Setup Alert at top of map */}
      {!company?.hqCountryId && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#60a5fa] px-lg py-3 rounded-xl backdrop-blur-md font-mono text-[11px] uppercase tracking-wider animate-pulse flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <span className="material-symbols-outlined text-base animate-bounce">location_on</span>
          <span>Establish Headquarters: Select a country on the world map to set up your corporate headquarters</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">


        {/* LEFT SLIDING DRAWER: REGIONAL OPERATIONS */}
        {selectedCountryId && country && (
          <div className="absolute left-0 top-0 bottom-0 w-[320px] bg-[#0c0f16]/95 border-r border-white/10 z-30 shadow-2xl backdrop-blur-2xl flex flex-col animate-slide-in-left">
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-lg py-md border-b border-white/5 bg-surface-container/30">
              <h3 className="font-bold text-on-surface flex items-center gap-2 text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-primary text-base">location_on</span>
                {country.name}
                <span className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-outline normal-case font-semibold">
                  {selectedCountryId}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCountryId(null)}
                className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-lg flex flex-col gap-md">

              {/* HQ Selection Block */}
              {!company?.hqCountryId ? (
                <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl p-md flex flex-col gap-sm">
                  <p className="text-xs text-outline leading-relaxed">
                    Establish your corporate headquarters in <strong>{country.name}</strong> to unlock the technology tree, model training registries, B2B commercial contract boards, and start the simulation.
                  </p>
                  <button
                    type="button"
                    onClick={() => establishHq(selectedCountryId)}
                    className="w-full bg-[#3b82f6] text-white py-2.5 px-md rounded-xl font-mono text-[11px] uppercase tracking-wider font-bold hover:bg-[#2563eb] transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.4)] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">domain</span>
                    <span>Establish HQ Here</span>
                  </button>
                </div>
              ) : (
                <>
                  {company.hqCountryId === selectedCountryId && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-sm flex items-center justify-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-base">domain</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider font-bold">🏢 Corporate Headquarters</span>
                    </div>
                  )}

                  {/* Market Shares */}
                  <div className="space-y-4 border-t border-white/5 pt-sm">
                    <span className="text-[9px] text-outline uppercase tracking-wider font-bold block">Market Shares</span>
                    
                    <div className="space-y-4">
                      {/* Player */}
                      {/* Player */}
                      {country.openMarkets?.player ? (
                        <div className="space-y-3 animate-fade-in text-left">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-on-surface-variant flex items-center gap-1 text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Player Share
                              </span>
                              <span className="text-primary font-bold text-[11px]">{country.playerShare}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${country.playerShare}%` }}></div>
                            </div>
                          </div>

                          {/* GPU Compute Node Allocation */}
                          <div className="bg-[#10141f] border border-white/5 p-3 rounded-xl space-y-2 mt-4 text-left font-mono">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-outline uppercase tracking-wider font-bold">Regional Compute Node</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                country.latency === 999 
                                  ? 'bg-error/15 text-error animate-pulse' 
                                  : country.latency > 15 
                                    ? 'bg-tertiary/15 text-tertiary' 
                                    : 'bg-secondary/15 text-secondary'
                              }`}>
                                {country.latency === 999 ? 'Deficit' : `${country.latency}ms`}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs pt-1">
                              <span className="text-outline">Allocated H100s:</span>
                              <span className="font-bold text-on-surface">{countryAllocatedGpus} / {maxAllocatable}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <span className="text-outline">Required Compute:</span>
                              <span className="font-bold text-primary">{country.gpusRequired || 0} H100s</span>
                            </div>

                            {/* GPU Allocation Control Buttons */}
                            <div className="flex items-center gap-xs mt-2 w-full">
                              <button
                                type="button"
                                disabled={countryAllocatedGpus <= 0}
                                onClick={() => allocateGpusToCountry(selectedCountryId, countryAllocatedGpus - 4)}
                                className="flex-1 bg-white/5 border border-white/10 text-outline hover:text-on-surface hover:bg-white/10 rounded py-1 font-bold text-xs transition-all disabled:opacity-20 cursor-pointer"
                              >
                                -4
                              </button>
                              <button
                                type="button"
                                disabled={countryAllocatedGpus <= 0}
                                onClick={() => allocateGpusToCountry(selectedCountryId, countryAllocatedGpus - 1)}
                                className="flex-1 bg-white/5 border border-white/10 text-outline hover:text-on-surface hover:bg-white/10 rounded py-1 font-bold text-xs transition-all disabled:opacity-20 cursor-pointer"
                              >
                                -1
                              </button>
                              <button
                                type="button"
                                disabled={idleGpus <= 0}
                                onClick={() => allocateGpusToCountry(selectedCountryId, countryAllocatedGpus + 1)}
                                className="flex-1 bg-white/5 border border-white/10 text-outline hover:text-on-surface hover:bg-white/10 rounded py-1 font-bold text-xs transition-all disabled:opacity-20 cursor-pointer"
                              >
                                +1
                              </button>
                              <button
                                type="button"
                                disabled={idleGpus < 4}
                                onClick={() => allocateGpusToCountry(selectedCountryId, countryAllocatedGpus + 4)}
                                className="flex-1 bg-white/5 border border-white/10 text-outline hover:text-on-surface hover:bg-white/10 rounded py-1 font-bold text-xs transition-all disabled:opacity-20 cursor-pointer"
                              >
                                +4
                              </button>
                            </div>

                            {/* Slider */}
                            <input
                              type="range"
                              min="0"
                              max={maxAllocatable}
                              value={countryAllocatedGpus}
                              onChange={(e) => allocateGpusToCountry(selectedCountryId, parseInt(e.target.value))}
                              className="w-full accent-primary cursor-pointer mt-2"
                            />
                            <div className="flex justify-between text-[8px] text-outline/50 mt-0.5">
                              <span>0 H100s</span>
                              <span>Idle Cluster Pool: {idleGpus} H100s</span>
                            </div>
                          </div>

                          {/* Regional Subscriptions Breakdown */}
                          <div className="bg-[#10141f]/50 border border-white/5 p-3 rounded-xl space-y-2 mt-3 text-left font-mono text-[10px]">
                            <span className="text-outline uppercase tracking-wider font-bold block">Active Users Breakdown</span>
                            <div className="space-y-xs max-h-[140px] overflow-y-auto custom-scrollbar pr-1 pt-1">
                              {(subscriptionTiers || []).map(t => {
                                const usersInCountry = country.tierUsers?.[t.id] || 0;
                                if (usersInCountry <= 0) return null;
                                return (
                                  <div key={t.id} className="flex justify-between items-center py-0.5 border-b border-white/5">
                                    <span className="text-on-surface/80">{t.name}</span>
                                    <span className="font-bold text-primary">{usersInCountry.toLocaleString()}</span>
                                  </div>
                                );
                              })}
                              {(!country.tierUsers || Object.values(country.tierUsers).reduce((sum, u) => sum + u, 0) === 0) && (
                                <div className="text-center text-outline italic text-[9px] py-2">No local active subscribers.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/10 rounded-xl p-md flex flex-col gap-sm animate-fade-in text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-outline font-semibold">Player Market: Closed</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded text-[#3b82f6] font-semibold">$50,000</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openMarket(selectedCountryId)}
                            disabled={resources.cash < 50000}
                            className="w-full bg-[#3b82f6] text-white py-2 px-md rounded-xl font-mono text-[10px] uppercase tracking-wider font-bold hover:bg-[#2563eb] transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.4)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">rocket_launch</span>
                            <span>Open Market</span>
                          </button>
                        </div>
                      )}

                      {/* Rivals */}
                      {rivals.map(rival => {
                        const rivalKey = rival.name.toLowerCase();
                        const isRivalOpen = country.openMarkets?.[rivalKey];
                        if (!isRivalOpen) return null;

                        const shareKey = `${rivalKey}Share`;
                        const share = country[shareKey] || 0;
                        if (rival.name === 'Anthropic' && share <= 0) return null;
                        
                        return (
                          <div key={rival.name} className="space-y-1 animate-fade-in">
                            <div className="flex justify-between text-xs">
                              <span className="text-outline flex items-center gap-1 text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rival.color }}></span> {rival.name}
                              </span>
                              <span className="text-outline font-semibold text-[11px]">{share}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: rival.color }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* CENTER MAIN SCREEN: INTERACTIVE SVG WORLD MAP */}
        <main className="flex-1 h-full relative overflow-hidden bg-[#07090e] flex items-center justify-center">
          <WorldMap
            countries={countries}
            selectedCountryId={selectedCountryId}
            company={company}
            rivals={rivals}
            onClick={handleMapClick}
            onMouseMove={handleMapMouseMove}
            onMouseLeave={handleMapMouseLeave}
          />
          
          {/* Floating Hover Tooltip */}
          {hoveredCountry && (
            <div 
              className="absolute bg-[#0f131c]/95 border border-white/10 px-3 py-2 rounded-lg text-xs shadow-xl pointer-events-none z-50 flex flex-col gap-1 backdrop-blur-md"
              style={{ left: `${hoveredCountry.x}px`, top: `${hoveredCountry.y}px` }}
            >
              <span className="font-bold text-on-surface">{hoveredCountry.name}</span>
              <div className="flex flex-col gap-0.5 font-mono text-[9px] mt-0.5">
                {(!hoveredCountry.openMarkets || !Object.values(hoveredCountry.openMarkets).some(Boolean)) ? (
                  <span className="text-outline italic">No active markets</span>
                ) : (
                  <>
                    {hoveredCountry.openMarkets?.player && (
                      <span className="text-primary font-bold">Player Share: {hoveredCountry.playerShare}%</span>
                    )}
                    {rivals.map(rival => {
                      const rivalKey = rival.name.toLowerCase();
                      if (!hoveredCountry.openMarkets?.[rivalKey]) return null;
                      
                      const shareKey = `${rivalKey}Share`;
                      const share = hoveredCountry[shareKey] || 0;
                      if (rival.name === 'Anthropic' && share <= 0) return null;
                      return (
                        <span key={rival.name} style={{ color: rival.color }}>
                          {rival.name} Share: {share}%
                        </span>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}

          {/* FLOATING ACTION OVERLAY BUTTONS (Right Side) */}
          <div className="absolute right-6 top-6 z-20 flex flex-col gap-sm">
            {[
              { id: 'admin', label: 'SaaS Admin', icon: 'dashboard' },
              { id: 'models', label: 'Models', icon: 'psychology' },
              { id: 'infrastructure', label: 'Hardware', icon: 'dns' },
              { id: 'research', label: 'Research', icon: 'science' },
              { id: 'logs', label: 'Logs', icon: 'terminal' },
              { id: 'companyModal', label: 'Companies', icon: 'corporate_fare' }
            ].map(drawer => (
              <button
                key={drawer.id}
                disabled={!company?.hqCountryId}
                onClick={() => {
                  if (drawer.id === 'logs') {
                    setIsLogsOpen(!isLogsOpen);
                  } else if (drawer.id === 'companyModal') {
                    setIsCompanyModalOpen(true);
                  } else if (drawer.id === 'infrastructure') {
                    setIsInfrastructureModalOpen(true);
                  } else if (drawer.id === 'models') {
                    setIsModelModalOpen(true);
                  } else if (drawer.id === 'research') {
                    setIsResearchModalOpen(true);
                  } else if (drawer.id === 'admin') {
                    setIsAdminModalOpen(true);
                  }
                }}
                title={drawer.label}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg disabled:opacity-30 disabled:cursor-not-allowed ${
                  (drawer.id === 'logs' ? isLogsOpen : drawer.id === 'companyModal' ? isCompanyModalOpen : drawer.id === 'infrastructure' ? isInfrastructureModalOpen : drawer.id === 'models' ? isModelModalOpen : drawer.id === 'research' ? isResearchModalOpen : drawer.id === 'admin' ? isAdminModalOpen : false)
                    ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:scale-105'
                    : 'bg-surface-container/60 hover:bg-surface-bright/20 border-white/10 text-outline hover:text-on-surface hover:scale-105'
                }`}
              >
                <span className="material-symbols-outlined text-base">{drawer.icon}</span>
              </button>
            ))}
          </div>

        </main>
      </div>

      {/* Bottom Logs Drawer */}
      <BottomLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} />

      {/* Interactive Mailbox Modal */}
      <MailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />

      {/* Company/Rivals Modal */}
      <CompanyModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} />

      {/* Infrastructure/Hardware Modal */}
      <InfrastructureModal isOpen={isInfrastructureModalOpen} onClose={() => setIsInfrastructureModalOpen(false)} />

      {/* Model Modal */}
      <ModelModal isOpen={isModelModalOpen} onClose={() => setIsModelModalOpen(false)} />

      {/* Research Modal */}
      <ResearchModal isOpen={isResearchModalOpen} onClose={() => setIsResearchModalOpen(false)} />

      {/* SaaS Admin Modal */}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />

      {/* Training Completion Popup */}
      {llms?.find(m => m.status === 'trained_pending') && (
        <TrainingCompletionPopup 
          model={llms.find(m => m.status === 'trained_pending')} 
          key={llms.find(m => m.status === 'trained_pending')?.id || 'none'} 
        />
      )}
    </div>
  );
}

const WorldMap = memo(function WorldMap({ countries, selectedCountryId, company, rivals, onClick, onMouseMove, onMouseLeave }) {
  const initializeAllCountries = useGameStore(state => state.initializeAllCountries);

  // Pre-process raw SVG to make it fluid from the very first render (preventing size jump)
  const processedWorldSvg = worldSvg
    .replace('width="1009.6727"', 'viewBox="0 0 1010 666" width="100%"')
    .replace('height="665.96301"', 'height="100%" style="max-width: 100%; max-height: 100%;"');

  // Initialize all countries on mount and catch rehydration race conditions
  useEffect(() => {
    const container = document.getElementById('world-map-svg-container');
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    const countryList = [];
    paths.forEach(p => {
      const id = p.getAttribute('id');
      const name = p.getAttribute('title') || id;
      if (id) countryList.push({ id, name });
    });

    const needsInitialization = countryList.some(({ id }) => !countries[id]);

    if (needsInitialization && countryList.length > 0) {
      initializeAllCountries(countryList);
    }
  }, [initializeAllCountries, countries]);

  // Update country path colors dynamically when state or selection changes
  useEffect(() => {
    const container = document.getElementById('world-map-svg-container');
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const hexToRgb = (hex) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const baseBg = { r: 30, g: 35, b: 48 }; // #1e2330 base slate grey

    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
      const id = path.getAttribute('id');
      if (!id) return;
      const countryState = countries[id];
      
      path.style.cursor = 'pointer';
      
      let fill = '#1e2330'; // Sleek slate base with clear visibility
      let stroke = 'rgba(255, 255, 255, 0.15)'; // High-visibility fine border lines
      let strokeWidth = '0.6';
      
      // Find dominant company with open market in this country
      let dominantShare = 0;
      let dominantColor = '#3b82f6';
      
      const openMarkets = countryState ? countryState.openMarkets : { openai: true, google: true };
      const playerShare = countryState ? countryState.playerShare : 0;
      const openaiShare = countryState ? countryState.openaiShare : 60;
      const googleShare = countryState ? countryState.googleShare : 40;
      const anthropicShare = countryState ? countryState.anthropicShare : 0;

      // Player
      if (openMarkets?.player && playerShare > dominantShare) {
        dominantShare = playerShare;
        dominantColor = company?.color || '#3b82f6';
      }
      // Rivals
      if (rivals) {
        rivals.forEach(rival => {
          const rivalKey = rival.name.toLowerCase();
          const isRivalOpen = openMarkets?.[rivalKey];
          if (isRivalOpen) {
            let share = 0;
            if (rivalKey === 'openai') share = openaiShare;
            else if (rivalKey === 'google') share = googleShare;
            else if (rivalKey === 'anthropic') share = anthropicShare;

            if (share > dominantShare) {
              dominantShare = share;
              dominantColor = rival.color;
            }
          }
        });
      }
      
      let companyRgb = { r: 59, g: 130, b: 246 };
      if (dominantShare > 0) {
        companyRgb = hexToRgb(dominantColor) || { r: 59, g: 130, b: 246 };
        const ratio = dominantShare / 100;
        // Blend baseBg with companyRgb based on market share ratio
        const r = Math.round(baseBg.r + (companyRgb.r - baseBg.r) * ratio);
        const g = Math.round(baseBg.g + (companyRgb.g - baseBg.g) * ratio);
        const b = Math.round(baseBg.b + (companyRgb.b - baseBg.b) * ratio);
        fill = `rgb(${r}, ${g}, ${b})`;
        stroke = `rgba(${companyRgb.r}, ${companyRgb.g}, ${companyRgb.b}, 0.4)`;
        strokeWidth = '1.0';
      }
      
      if (id === selectedCountryId) {
        stroke = dominantShare > 0 ? dominantColor : '#3b82f6';
        strokeWidth = '2.2';
        path.style.filter = `drop-shadow(0 0 6px ${dominantShare > 0 ? stroke : 'rgba(59, 130, 246, 0.6)'}) brightness(1.25)`;
      } else {
        path.style.filter = '';
      }
      
      path.setAttribute('fill', fill);
      path.setAttribute('stroke', stroke);
      path.setAttribute('stroke-width', strokeWidth);
      path.style.transition = 'fill 0.3s ease, stroke 0.3s ease, filter 0.3s ease';

      // Mouse interactive hover effects
      path.onmouseenter = () => {
        if (id !== selectedCountryId) {
          path.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
          path.style.filter = 'brightness(1.15)';
        }
      };
      path.onmouseleave = () => {
        if (id !== selectedCountryId) {
          path.setAttribute('stroke', dominantShare > 0 ? `rgba(${companyRgb.r}, ${companyRgb.g}, ${companyRgb.b}, 0.4)` : 'rgba(255, 255, 255, 0.15)');
          path.style.filter = '';
        }
      };
    });
  }, [countries, selectedCountryId, company, rivals]);

  return (
    <div
      id="world-map-svg-container"
      className="w-full h-full p-6 flex items-center justify-center select-none"
      dangerouslySetInnerHTML={{ __html: processedWorldSvg }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    />
  );
});
