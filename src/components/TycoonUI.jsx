import { useState, useEffect, memo, useCallback } from 'react';
import TopBar from './TopBar';
import ModelView from './ModelView';
import InfrastructureView from './InfrastructureView';
import ResearchView from './ResearchView';
import MarketView from './MarketView';
import MailboxModal from './MailboxModal';
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
    allocateGpusToCountry 
  } = useGameStore();

  const [selectedCountryId, setSelectedCountryId] = useState('US');
  const [activeDrawer, setActiveDrawer] = useState(null); // null, 'models', 'infrastructure', 'research', 'market'
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [logFilter, setLogFilter] = useState('all');

  const country = countries[selectedCountryId];



  const handleMapClick = useCallback((e) => {
    const path = e.target.closest('path');
    if (path) {
      const id = path.getAttribute('id');
      const title = path.getAttribute('title') || id;
      initCountry(id, title);
      setSelectedCountryId(id);
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
        anthropicShare: countryState ? countryState.anthropicShare : 40,
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

  // Filter logs for bottom-left console
  const filteredLogs = newsFeed.filter(log => {
    if (logFilter === 'all') return true;
    if (logFilter === 'system') return log.type === 'memory' || log.type === 'ac_unit' || log.type === 'cloud';
    if (logFilter === 'training') return log.type === 'model_training' || log.type === 'check_circle';
    if (logFilter === 'public') return log.type === 'public' || log.type === 'warning' || log.type === 'handshake';
    return true;
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-on-surface overflow-hidden dark relative">
      <TopBar onMailboxToggle={() => setIsMailboxOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT PANEL: OPERATIONS & DIAGNOSTICS */}
        <aside className="w-80 bg-surface-container/60 dark:bg-surface-container/60 backdrop-blur-2xl border-r border-white/5 z-20 flex-none h-full flex flex-col overflow-hidden">
          
          {/* Top Section: Regional Details */}
          <div className="flex-none p-md border-b border-white/5 bg-surface-container/10">
            <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider text-[11px] font-bold mb-3">
              Regional Operations
            </h2>
            
            {country ? (
              <div className="space-y-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">public</span>
                    <h3 className="font-bold text-base text-on-surface leading-tight">{country.name}</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded font-bold font-mono text-outline">
                    {selectedCountryId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-surface/30 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Demand</span>
                    <span className="font-semibold text-xs text-on-surface">{country.demand?.toLocaleString()} q/tick</span>
                  </div>
                  <div className="bg-surface/30 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-outline block uppercase tracking-wider">Satisfaction</span>
                    <span className={`font-semibold text-xs flex items-center gap-1 ${
                      country.satisfaction >= 80 ? 'text-emerald-500' : country.satisfaction >= 50 ? 'text-yellow-500' : 'text-error'
                    }`}>
                      {country.satisfaction}%
                    </span>
                  </div>
                </div>

                {/* Deployed Model Selector */}
                <div className="space-y-xs">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] text-outline uppercase tracking-wider font-bold">Active Model</label>
                    {country.deployedModelId && (
                      <button 
                        onClick={() => deployModelToCountry(selectedCountryId, null)}
                        className="text-[9px] text-error hover:underline"
                      >
                        Undeploy
                      </button>
                    )}
                  </div>
                  <select
                    value={country.deployedModelId || ''}
                    onChange={(e) => deployModelToCountry(selectedCountryId, e.target.value || null)}
                    className="w-full bg-surface-container-high border border-white/10 text-on-surface rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="">-- No Model Deployed --</option>
                    {llms.filter(m => m.status === 'released').map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} v{m.version.toFixed(1)} ({m.targetSegment?.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* GPU Compute Allocation */}
                <div className="space-y-xs">
                  {(() => {
                    const totalGpus = infrastructure.gpus + infrastructure.cloudGpusRented;
                    const activeTrainingGpus = llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
                    const allocatedToOthers = Object.entries(countries || {}).reduce((sum, [cid, c]) => {
                      if (cid === selectedCountryId) return sum;
                      return sum + (c.allocatedGpus || 0);
                    }, 0);
                    const maxAllocatable = totalGpus - activeTrainingGpus - allocatedToOthers;
                    const currentAllocated = country.allocatedGpus || 0;

                    return (
                      <>
                        <div className="flex justify-between text-[9px] text-outline uppercase tracking-wider font-bold">
                          <span>Allocate GPUs</span>
                          <span>Idle: {maxAllocatable - currentAllocated} GPUs</span>
                        </div>
                        
                        <div className="flex items-center gap-sm bg-surface-container-high border border-white/5 rounded-lg px-2.5 py-1.5">
                          <input
                            type="range"
                            min="0"
                            max={maxAllocatable}
                            value={currentAllocated}
                            onChange={(e) => allocateGpusToCountry(selectedCountryId, parseInt(e.target.value))}
                            className="flex-1 accent-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="font-mono text-xs font-bold text-primary shrink-0 w-8 text-right">
                            {currentAllocated}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-outline mt-1">
                          <span>Latency: <strong className={country.latency > 100 ? "text-error" : "text-emerald-500"}>{country.latency}ms</strong></span>
                          <span>Required: <strong>{country.gpusRequired || 0} GPUs</strong></span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Market Shares */}
                <div className="space-y-2 mt-sm border-t border-white/5 pt-sm">
                  <span className="text-[9px] text-outline uppercase tracking-wider font-bold block">Market Shares</span>
                  
                  <div className="space-y-1.5">
                    {/* Player */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-on-surface-variant flex items-center gap-1 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Player
                        </span>
                        <span className="text-primary font-bold text-[11px]">{country.playerShare}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${country.playerShare}%` }}></div>
                      </div>
                    </div>

                    {/* OpenAI */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-outline flex items-center gap-1 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> OpenAI
                        </span>
                        <span className="text-outline font-semibold text-[11px]">{country.openaiShare}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${country.openaiShare}%` }}></div>
                      </div>
                    </div>

                    {/* Anthropic */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-outline flex items-center gap-1 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Anthropic
                        </span>
                        <span className="text-outline font-semibold text-[11px]">{country.anthropicShare}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${country.anthropicShare}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-md text-outline text-xs">
                Select a country on the map to begin regional operations.
              </div>
            )}
          </div>

          {/* Bottom Section: Integrated Diagnostics Logs */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-md py-2 border-b border-white/5 bg-surface-container/30 flex flex-col gap-1.5 flex-none">
              <h3 className="font-label-md text-label-md text-on-surface flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                <span className="material-symbols-outlined text-[13px] text-primary animate-pulse">terminal</span>
                Operations Log
              </h3>
              
              <div className="flex gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'system', label: 'Infra' },
                  { id: 'training', label: 'Train' },
                  { id: 'public', label: 'Market' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setLogFilter(cat.id)}
                    className={`text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors ${
                      logFilter === cat.id 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-surface-dim hover:bg-surface-bright/20 border border-white/5 text-outline'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs List Container */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-1.5 select-text custom-scrollbar">
              {filteredLogs.length === 0 ? (
                <p className="text-outline italic text-center pt-8">No operations logged.</p>
              ) : (
                filteredLogs.map((log, index) => {
                  const time = `[${formatDateFromTick(log.tick)}]`;
                  
                  let colorClass = 'text-on-surface-variant';
                  if (log.type === 'warning' || log.type === 'error') colorClass = 'text-error font-bold';
                  else if (log.type === 'check_circle' || log.type === 'handshake') colorClass = 'text-secondary font-bold';
                  else if (log.type === 'model_training' || log.type === 'science') colorClass = 'text-primary';
                  else if (log.type === 'cloud' || log.type === 'memory') colorClass = 'text-outline';

                  return (
                    <div key={index} className="flex gap-2 items-start leading-relaxed border-b border-white/5 pb-1 last:border-0 hover:bg-white/5 px-1 py-0.5 rounded transition-colors">
                      <span className="text-outline shrink-0 text-[9px]">{time}</span>
                      <span className={colorClass}>{log.text}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

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
                <span className="text-orange-400">OpenAI Share: {hoveredCountry.openaiShare}%</span>
                <span className="text-purple-400">Anthropic Share: {hoveredCountry.anthropicShare}%</span>
              </div>
            </div>
          )}

          {/* FLOATING ACTION OVERLAY BUTTONS (Right Side) */}
          <div className="absolute right-6 top-6 z-20 flex flex-col gap-sm">
            {[
              { id: 'models', label: 'Models', icon: 'psychology' },
              { id: 'infrastructure', label: 'Hardware', icon: 'dns' },
              { id: 'research', label: 'Research', icon: 'science' },
              { id: 'market', label: 'Contracts', icon: 'handshake' }
            ].map(drawer => (
              <button
                key={drawer.id}
                onClick={() => setActiveDrawer(activeDrawer === drawer.id ? null : drawer.id)}
                title={drawer.label}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg ${
                  activeDrawer === drawer.id
                    ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:scale-105'
                    : 'bg-surface-container/60 hover:bg-surface-bright/20 border-white/10 text-outline hover:text-on-surface hover:scale-105'
                }`}
              >
                <span className="material-symbols-outlined text-base">{drawer.icon}</span>
              </button>
            ))}
          </div>

          {/* SLIDE-OUT OVERLAY VIEW DRAWERS (Right Side) */}
          {activeDrawer && (
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

      {/* Interactive Mailbox Modal */}
      <MailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />
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
