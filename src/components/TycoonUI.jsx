import { useState, useEffect, memo, useCallback } from 'react';
import TopBar from './TopBar';
import ModelView from './ModelView';
import InfrastructureView from './InfrastructureView';
import ResearchView from './ResearchView';
import MarketView from './MarketView';
import MailboxModal from './MailboxModal';
import BottomLogsDrawer from './BottomLogsDrawer';
import CompanyModal from './CompanyModal';
import { useGameStore, formatDateFromTick } from '../store';
import worldSvg from '../assets/world.svg?raw';

export default function TycoonUI() {
  const { 
    countries, 
    llms, 
    newsFeed, 
    infrastructure, 
    initCountry, 
    deployModelToCountry, 
    allocateGpusToCountry,
    company,
    rivals,
    establishHq
  } = useGameStore();

  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [activeDrawer, setActiveDrawer] = useState(null); // null, 'models', 'infrastructure', 'research', 'market'
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const country = selectedCountryId ? countries[selectedCountryId] : null;

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
                  <div className="space-y-2 border-t border-white/5 pt-sm">
                    <span className="text-[9px] text-outline uppercase tracking-wider font-bold block">Market Shares</span>
                    
                    <div className="space-y-2">
                      {/* Player */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-on-surface-variant flex items-center gap-1 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Player
                          </span>
                          <span className="text-primary font-bold text-[11px]">{country.playerShare}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${country.playerShare}%` }}></div>
                        </div>
                      </div>

                      {/* Rivals */}
                      {rivals.map(rival => {
                        const shareKey = `${rival.name.toLowerCase()}Share`;
                        const share = country[shareKey] || 0;
                        if (rival.name === 'Anthropic' && share <= 0) return null;
                        
                        return (
                          <div key={rival.name} className="space-y-0.5 animate-fade-in">
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
                <span className="text-primary font-bold">Player Share: {hoveredCountry.playerShare}%</span>
                {rivals.map(rival => {
                  const shareKey = `${rival.name.toLowerCase()}Share`;
                  const share = hoveredCountry[shareKey] || 0;
                  if (rival.name === 'Anthropic' && share <= 0) return null;
                  return (
                    <span key={rival.name} style={{ color: rival.color }}>
                      {rival.name} Share: {share}%
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* FLOATING ACTION OVERLAY BUTTONS (Right Side) */}
          <div className="absolute right-6 top-6 z-20 flex flex-col gap-sm">
            {[
              { id: 'models', label: 'Models', icon: 'psychology' },
              { id: 'infrastructure', label: 'Hardware', icon: 'dns' },
              { id: 'research', label: 'Research', icon: 'science' },
              { id: 'market', label: 'Contracts', icon: 'handshake' },
              { id: 'logs', label: 'Logs', icon: 'terminal' },
              { id: 'companyModal', label: 'Companies', icon: 'corporate_fare' }
            ].map(drawer => (
              <button
                key={drawer.id}
                disabled={!company?.hqCountryId}
                onClick={() => {
                  if (drawer.id === 'logs') {
                    setIsLogsOpen(!isLogsOpen);
                    setActiveDrawer(null);
                  } else if (drawer.id === 'companyModal') {
                    setIsCompanyModalOpen(true);
                  } else {
                    setActiveDrawer(activeDrawer === drawer.id ? null : drawer.id);
                    setIsLogsOpen(false);
                  }
                }}
                title={drawer.label}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg disabled:opacity-30 disabled:cursor-not-allowed ${
                  (drawer.id === 'logs' ? isLogsOpen : drawer.id === 'companyModal' ? isCompanyModalOpen : activeDrawer === drawer.id)
                    ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:scale-105'
                    : 'bg-surface-container/60 hover:bg-surface-bright/20 border-white/10 text-outline hover:text-on-surface hover:scale-105'
                }`}
              >
                <span className="material-symbols-outlined text-base">{drawer.icon}</span>
              </button>
            ))}
          </div>

          {/* SLIDE-OUT OVERLAY VIEW DRAWERS (Right Side) */}
          {activeDrawer && company?.hqCountryId && (
            <div className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-[850px] bg-[#0c0f16]/95 border-l border-white/10 z-30 shadow-2xl backdrop-blur-2xl flex flex-col animate-slide-in">
              {/* Drawer Header */}
              <div className="flex justify-between items-center px-lg py-md border-b border-white/5 bg-surface-container/30">
                <h3 className="font-bold text-on-surface flex items-center gap-2 text-xs uppercase tracking-wider">
                  {activeDrawer === 'models' && <><span className="material-symbols-outlined text-primary text-base">psychology</span> Models</>}
                  {activeDrawer === 'infrastructure' && <><span className="material-symbols-outlined text-primary text-base">dns</span> Hardware & Cooling</>}
                  {activeDrawer === 'research' && <><span className="material-symbols-outlined text-primary text-base">science</span> Research Lab</>}
                  {activeDrawer === 'market' && <><span className="material-symbols-outlined text-primary text-base">handshake</span> Contracts</>}
                </h3>
                <button
                  onClick={() => setActiveDrawer(null)}
                  className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              
              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-lg">
                {activeDrawer === 'models' && <ModelView />}
                {activeDrawer === 'infrastructure' && <InfrastructureView />}
                {activeDrawer === 'research' && <ResearchView />}
                {activeDrawer === 'market' && <MarketView />}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Logs Drawer */}
      <BottomLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} />

      {/* Interactive Mailbox Modal */}
      <MailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />

      {/* Company/Rivals Modal */}
      <CompanyModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} />
    </div>
  );
}

const WorldMap = memo(function WorldMap({ countries, selectedCountryId, onClick, onMouseMove, onMouseLeave }) {
  // Pre-process raw SVG to make it fluid from the very first render (preventing size jump)
  const processedWorldSvg = worldSvg
    .replace('width="1009.6727"', 'viewBox="0 0 1010 666" width="100%"')
    .replace('height="665.96301"', 'height="100%" style="max-width: 100%; max-height: 100%;"');

  // Update country path colors dynamically when state or selection changes
  useEffect(() => {
    const container = document.getElementById('world-map-svg-container');
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
      const id = path.getAttribute('id');
      if (!id) return;
      const countryState = countries[id];
      const playerShare = countryState ? countryState.playerShare : 0;
      
      path.style.cursor = 'pointer';
      
      let fill = '#1e2330'; // Sleek slate base with clear visibility
      let stroke = 'rgba(255, 255, 255, 0.15)'; // High-visibility fine border lines
      let strokeWidth = '0.6';
      
      if (playerShare > 0) {
        // Interpolate HSL from slate grey HSL(220, 20%, 15%) to active HSL(221, 83%, 45%)
        const ratio = playerShare / 100;
        const h = 221;
        const s = Math.round(20 + (83 - 20) * ratio);
        const l = Math.round(15 + (45 - 15) * ratio);
        fill = `hsl(${h}, ${s}%, ${l}%)`;
        stroke = 'rgba(59, 130, 246, 0.4)';
        strokeWidth = '1.0';
      }
      
      if (id === selectedCountryId) {
        stroke = '#3b82f6';
        strokeWidth = '2.2';
        path.style.filter = 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6)) brightness(1.25)';
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
          path.setAttribute('stroke', playerShare > 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.15)');
          path.style.filter = '';
        }
      };
    });
  }, [countries, selectedCountryId]);

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
