import { useGameStore } from '../store';

export default function ResearchView() {
  const { research, unlockTech, resources } = useGameStore();

  const technologies = [
    { id: 'transformer', name: 'Transformer Architecture', desc: 'The baseline neural network architecture for large language models.', cost: 0, unlocked: research.unlockedTech.includes('transformer') },
    { id: 'moe', name: 'Mixture of Experts', desc: 'Allows scaling parameter count without proportionally increasing compute costs.', cost: 500000, unlocked: research.unlockedTech.includes('moe') },
    { id: 'sso', name: 'State Space Models', desc: 'Highly efficient architectures that process context more effectively than standard attention.', cost: 1500000, unlocked: research.unlockedTech.includes('sso') },
    { id: 'qlora', name: 'Quantized LoRA', desc: 'Enables fine-tuning on consumer hardware, dramatically lowering training costs.', cost: 800000, unlocked: research.unlockedTech.includes('qlora') },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-12 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Neural Labs</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Unlock advanced architectures and techniques to stay ahead in the race.</p>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-12 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">Tech Tree</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-md">
            {technologies.map(tech => (
              <div key={tech.id} className={`p-md rounded-xl border transition-all flex flex-col gap-sm ${tech.unlocked ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(173,198,255,0.1)]' : 'bg-surface-container border-outline-variant hover:border-white/20'}`}>
                <div className="flex justify-between items-start">
                  <span className={`material-symbols-outlined ${tech.unlocked ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {tech.unlocked ? 'science' : 'lock'}
                  </span>
                  {!tech.unlocked && <span className="font-label-sm text-label-sm text-outline">${tech.cost.toLocaleString()}</span>}
                  {tech.unlocked && <span className="font-label-sm text-label-sm text-primary uppercase">Unlocked</span>}
                </div>
                <div>
                  <h4 className={`font-label-md text-label-md ${tech.unlocked ? 'text-on-surface' : 'text-on-surface-variant'}`}>{tech.name}</h4>
                  <p className="font-body-md text-body-md text-outline mt-xs leading-tight">{tech.desc}</p>
                </div>
                {!tech.unlocked && (
                  <button 
                    onClick={() => unlockTech(tech.id, tech.cost)}
                    disabled={resources.cash < tech.cost}
                    className="mt-auto w-full bg-surface-dim border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md text-label-md py-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Fund Research
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
