import { useGameStore } from '../store';

export default function MarketView() {
  const { llms, rivals } = useGameStore();

  const segments = [
    {
      id: 'consumer',
      name: 'B2C Consumer App Store',
      icon: 'person',
      priceUnit: '/mo sub',
      basePrice: 15,
      maxMarket: 50000,
      stats: ['creativity', 'knowledge'],
      labels: ['Creativity', 'Knowledge'],
      desc: 'Consumer apps demand natural dialog, storytelling, and broad knowledge. High user volume, low price sensitivity.'
    },
    {
      id: 'dev',
      name: 'Developer API Gateway',
      icon: 'code',
      priceUnit: '/M tokens',
      basePrice: 5,
      maxMarket: 5000,
      stats: ['coding', 'math'],
      labels: ['Coding', 'Math'],
      desc: 'Software developers require precise code synthesis, debugging, and mathematical reasoning. Sensitive to latency.'
    },
    {
      id: 'business',
      name: 'Business SaaS Portal',
      icon: 'business',
      priceUnit: '/seat/mo',
      basePrice: 25,
      maxMarket: 1000,
      stats: ['coding', 'knowledge'],
      labels: ['Coding', 'Knowledge'],
      desc: 'Corporate workflows need data analysis, report generation, and coding automation. Steady growth, moderate scaling.'
    },
    {
      id: 'enterprise',
      name: 'Dedicated Enterprise Clouds',
      icon: 'cloud',
      priceUnit: '/mo lease',
      basePrice: 5000,
      maxMarket: 50,
      stats: ['math', 'knowledge'],
      labels: ['Math', 'Knowledge'],
      desc: 'Heavy enterprise clouds leased to defense, finance, and logistics. Highly demanding benchmarks, very low tolerance for latency.'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-6 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Commercialization & Market</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Deploy trained models, scale production compute nodes, and monitor competitor benchmarks.
        </p>
      </div>

      {/* LEFT COLUMN: 4-Quadrant Market Segments Overview */}
      <div className="col-span-1 lg:col-span-9 flex flex-col gap-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {segments.map(segment => {
            const activeModels = llms.filter(m => m.status === 'released' && m.targetSegment === segment.id);

            return (
              <section key={segment.id} className="glass-panel p-lg rounded-xl flex flex-col gap-md">
                <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs flex justify-between items-center">
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">{segment.icon}</span>
                    {segment.name}
                  </span>
                  <span className="text-[10px] text-outline">Max size: {segment.maxMarket.toLocaleString()}</span>
                </h3>

                <p className="font-body-md text-body-md text-outline text-xs leading-relaxed">
                  {segment.desc}
                </p>

                {/* Player Deployments */}
                <div className="space-y-sm flex-1">
                  <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block">Your Deployed Instances</span>
                  
                  {activeModels.length === 0 ? (
                    <div className="p-md rounded-xl border border-dashed border-white/10 text-center text-outline text-xs py-6">
                      No active instances.
                      <p className="text-[10px] mt-1">Deploy a trained model to this segment in the Models tab.</p>
                    </div>
                  ) : (
                    <div className="space-y-sm">
                      {activeModels.map(model => {
                        const finalPrice = model.priceTag || segment.basePrice;
                        const users = model.marketMetrics?.users || 0;
                        const satisfaction = model.marketMetrics?.satisfaction || 100;
                        const liveYield = Math.round(users * finalPrice * (satisfaction / 100));
                        const sharePercent = ((users / segment.maxMarket) * 100).toFixed(1);
                        const latency = model.marketMetrics?.latency || 10;
                        const gpusRequired = model.marketMetrics?.gpusRequired || 0;
                        const gpusAllocated = model.productionGpus || 0;

                        return (
                          <div key={model.id} className="p-3 bg-surface-dim/40 border border-white/5 rounded-lg space-y-sm text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-on-surface text-sm">{model.name}</span>
                                <span className="text-[10px] text-outline ml-1.5 px-1.5 py-0.5 bg-surface-container rounded border border-white/5">v{model.version.toFixed(1)}</span>
                              </div>
                              <span className="text-primary font-semibold">Active</span>
                            </div>

                            <div className="grid grid-cols-2 gap-sm text-[11px] text-outline">
                              <div>
                                <span className="block text-[9px] font-semibold text-outline-variant">TRAFFIC / SHARE</span>
                                <span className="text-on-surface font-semibold">{users.toLocaleString()} ({sharePercent}%)</span>
                              </div>
                              <div>
                                <span className="block text-[9px] font-semibold text-outline-variant">PRICE TAG</span>
                                <span className="text-on-surface font-semibold">${finalPrice.toLocaleString()}{segment.priceUnit}</span>
                              </div>
                              <div>
                                <span className="block text-[9px] font-semibold text-outline-variant">GPU PROD LOAD</span>
                                <span className={`font-semibold ${gpusAllocated >= gpusRequired ? 'text-emerald-500' : 'text-error animate-pulse'}`}>
                                  {gpusAllocated} / {gpusRequired} GPUs
                                </span>
                              </div>
                              <div>
                                <span className="block text-[9px] font-semibold text-outline-variant">LIVE TICK YIELD</span>
                                <span className="text-emerald-500 font-semibold">+{liveYield > 0 ? `$${liveYield.toLocaleString()}` : '$0'}/tick</span>
                              </div>
                            </div>

                            {/* Latency & Satisfaction row */}
                            <div className="flex justify-between items-center pt-xs border-t border-white/5 text-[10px]">
                              <span className="flex items-center gap-xs text-outline">
                                <span className={`w-2 h-2 rounded-full ${latency <= 15 ? 'bg-emerald-500' : latency <= 50 ? 'bg-amber-500' : 'bg-error animate-pulse'}`}></span>
                                Latency: {latency}ms
                              </span>
                              <span className="text-outline">
                                Satisfaction: <span className="font-bold text-on-surface">{satisfaction}%</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Rival Benchmarks */}
                <div className="space-y-xs border-t border-white/5 pt-md">
                  <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block">
                    Rival benchmarks ({segment.labels[0]} & {segment.labels[1]})
                  </span>
                  <div className="space-y-1">
                    {rivals.map((rival, idx) => {
                      const rivalRating = (rival.stats[segment.stats[0]] + rival.stats[segment.stats[1]]) / 2;
                      const rivalPenalty = rival.stats.hallucination * 1.5;
                      const rivalScore = Math.max(5, rivalRating - rivalPenalty).toFixed(0);
                      return (
                        <div key={idx} className="flex justify-between text-[11px] bg-surface-dim/20 p-2 rounded border border-white/5 text-outline">
                          <span>{rival.name} ({rival.bestModel})</span>
                          <span className="text-on-surface font-semibold">Score: {rivalScore} • ${segment.basePrice.toLocaleString()}{segment.priceUnit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Competitor Market Intelligence */}
      <div className="col-span-1 lg:col-span-3 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl flex flex-col gap-md">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs">
            Competitor Diagnostics
          </h3>
          
          <p className="font-body-md text-body-md text-outline text-xs leading-relaxed">
            Rivals continuously optimize weight paths. Watch benchmark comparisons to maintain market share.
          </p>

          <div className="space-y-lg mt-md">
            {rivals.map((rival, i) => (
              <div key={i} className="space-y-xs pb-sm border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-label-md text-label-md text-on-surface font-bold">{rival.name}</h4>
                  <span className="text-xs text-outline font-semibold">{rival.share}% Market Share</span>
                </div>
                <div className="flex justify-between text-[11px] text-outline">
                  <span>Frontrunner: {rival.bestModel}</span>
                </div>
                
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-outline-variant font-semibold pt-1">
                  <div>KNOW: {rival.stats.knowledge}%</div>
                  <div>CREA: {rival.stats.creativity}%</div>
                  <div>CODE: {rival.stats.coding}%</div>
                  <div className="text-error/85">HAL: {rival.stats.hallucination}%</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
