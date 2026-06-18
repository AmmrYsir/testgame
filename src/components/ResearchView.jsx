import { useGameStore } from '../store';

export default function ResearchView() {
  const { research, startResearch, resources } = useGameStore();

  const technologies = [
    { 
      id: 'transformer', 
      category: 'Backbone',
      name: 'Transformer Architecture', 
      desc: 'The standard architecture for large language models. Provides baseline stats.', 
      cost: 0, 
      ticks: 1,
      unlocked: research.unlockedTech.includes('transformer') 
    },
    { 
      id: 'moe', 
      category: 'Backbone',
      name: 'Mixture of Experts (MoE)', 
      desc: 'Allows scaling model parameters efficiently. Grants a +25% bonus to training gains.', 
      cost: 500000, 
      ticks: 100,
      unlocked: research.unlockedTech.includes('moe') 
    },
    { 
      id: 'ssm', 
      category: 'Backbone',
      name: 'State Space Models (SSM)', 
      desc: 'Highly efficient alternative to attention mechanism. Grants a +40% bonus to training gains.', 
      cost: 1500000, 
      ticks: 200,
      unlocked: research.unlockedTech.includes('ssm') 
    },
    { 
      id: 'lora', 
      category: 'Technique',
      name: 'Low-Rank Adaptation (LoRA)', 
      desc: 'Reduces training computing cost by 30%.', 
      cost: 300000, 
      ticks: 60,
      unlocked: research.unlockedTech.includes('lora') 
    },
    { 
      id: 'synthetic', 
      category: 'Technique',
      name: 'Synthetic Data Generation', 
      desc: 'Filter synthetic reasoning datasets. Boosts model reasoning accuracy by 5%.', 
      cost: 600000, 
      ticks: 90,
      unlocked: research.unlockedTech.includes('synthetic') 
    },
    { 
      id: 'rlhf', 
      category: 'Technique',
      name: 'RLHF Alignment', 
      desc: 'Reinforcement Learning from Human Feedback. Increases all model stats by +10.', 
      cost: 1000000, 
      ticks: 140,
      unlocked: research.unlockedTech.includes('rlhf') 
    },
  ];

  const handleFundResearch = (techId, cost, ticks) => {
    if (research.activeResearch) return;
    startResearch(techId, cost, ticks);
  };

  const activeTech = research.activeResearch;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-6 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Research Lab</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Allocate resources to unlock new architectures and training optimizations.
        </p>
      </div>

      {/* Active Research Banner */}
      {activeTech && (
        <div className="col-span-1 lg:col-span-12">
          <div className="glass-panel p-md rounded-xl flex flex-col md:flex-row justify-between items-center gap-md border-l-4 border-l-primary bg-primary/5">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest block">Active Research Project</span>
              <h4 className="font-label-md text-label-md text-on-surface font-bold mt-1">
                Studying: {technologies.find(t => t.id === activeTech.techId)?.name || activeTech.techId.toUpperCase()}
              </h4>
            </div>
            
            <div className="flex-1 max-w-md w-full">
              <div className="flex justify-between text-xs text-outline mb-1 font-semibold">
                <span>Funding Rate: -${activeTech.fundingPerTick.toLocaleString()}/tick</span>
                <span>Day {activeTech.progress}/{activeTech.totalTicks} ({Math.round(activeTech.progress / activeTech.totalTicks * 100)}%)</span>
              </div>
              <div className="w-full bg-surface-dim rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${(activeTech.progress / activeTech.totalTicks) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tech Tree */}
      <div className="col-span-1 lg:col-span-12 flex flex-col gap-gutter mt-sm">
        <section className="glass-panel p-lg rounded-xl">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">
            Technology Tree
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-md">
            {technologies.map(tech => {
              const isCurrentlyResearchingThis = activeTech?.techId === tech.id;
              const isDefault = tech.cost === 0;
              
              return (
                <div 
                  key={tech.id} 
                  className={`p-md rounded-xl border transition-all flex flex-col gap-sm justify-between ${
                    tech.unlocked 
                      ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(173,198,255,0.1)]' 
                      : isCurrentlyResearchingThis
                      ? 'bg-primary/5 border-primary animate-pulse'
                      : 'bg-surface-container border-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        tech.category === 'Backbone' ? 'bg-primary/10 text-primary' : 'bg-secondary/15 text-secondary'
                      }`}>
                        {tech.category}
                      </span>
                      {tech.unlocked ? (
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Unlocked</span>
                      ) : isCurrentlyResearchingThis ? (
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Active</span>
                      ) : (
                        <span className="font-label-sm text-label-sm text-outline font-bold">${tech.cost.toLocaleString()}</span>
                      )}
                    </div>
                    
                    <h4 className={`font-label-md text-label-md mt-sm font-bold ${tech.unlocked ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {tech.name}
                    </h4>
                    <p className="font-body-md text-body-md text-outline mt-1 text-xs leading-normal">
                      {tech.desc}
                    </p>
                  </div>
                  
                  {!tech.unlocked && !isDefault && (
                    <button 
                      onClick={() => handleFundResearch(tech.id, tech.cost, tech.ticks)}
                      disabled={resources.cash < tech.cost || activeTech !== null}
                      className={`w-full font-label-md text-label-md py-sm rounded-lg transition-all duration-300 mt-md border ${
                        isCurrentlyResearchingThis
                          ? 'bg-primary/20 border-primary text-white cursor-default'
                          : 'bg-surface-dim border-outline-variant hover:border-primary text-on-surface hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isCurrentlyResearchingThis 
                        ? 'Researching...' 
                        : `Fund Research (${tech.ticks} ticks)`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
