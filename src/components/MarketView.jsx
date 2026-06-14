import { useState } from 'react';
import { useGameStore } from '../store';

export default function MarketView() {
  const { llms, marketContracts, rivals, resources, bindModelToContract, cancelContract } = useGameStore();
  const [selectedModels, setSelectedModels] = useState({}); // contractId -> modelId mapping for select inputs

  const releasedModels = llms.filter(m => m.status === 'released');
  const trainedModels = llms.filter(m => m.status === 'trained' || m.status === 'released');

  const handleSelectModelForContract = (contractId, modelId) => {
    setSelectedModels(prev => ({ ...prev, [contractId]: modelId }));
  };

  const handleBind = (contractId) => {
    const modelId = selectedModels[contractId];
    if (!modelId) return;
    bindModelToContract(modelId, contractId);
  };

  // Check if a model meets a contract's requirements
  const checkEligibility = (model, contract) => {
    if (model.contractId) return false; // Already bound
    if (model.status === 'draft' || model.status === 'training') return false;

    const reqStat = contract.requirement.stat;
    const reqVal = contract.requirement.value;
    const modelVal = model.stats[reqStat];

    if (reqStat === 'hallucination') {
      return modelVal <= reqVal;
    }
    return modelVal >= reqVal;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-6 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Commercialization & Market</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Deploy trained models to commercial contracts, review active API revenues, and monitor competitor metrics.
        </p>
      </div>

      {/* LEFT COLUMN: Active API Releases & B2B Contracts Board */}
      <div className="col-span-1 lg:col-span-8 flex flex-col gap-gutter">
        
        {/* Active API Releases */}
        <section className="glass-panel p-lg rounded-xl flex flex-col gap-md">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs">
            Active Public Deployments
          </h3>
          
          <div className="space-y-md">
            {releasedModels.length === 0 ? (
              <p className="text-outline italic text-xs py-4 text-center">No models are currently deployed to the public market.</p>
            ) : (
              releasedModels.map(model => (
                <div key={model.id} className="p-4 rounded-xl border border-white/5 bg-surface-dim/40 flex flex-col md:flex-row justify-between items-center gap-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">cloud_done</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-bold">
                        {model.name} <span className="text-outline text-xs">v{model.version.toFixed(1)}</span>
                      </h4>
                      <p className="text-xs text-outline capitalize mt-0.5">
                        Channel: {model.releaseType === 'b2b' ? 'Enterprise API' : 'Consumer App'} • Yield: +${model.revenuePerTick}/tick
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-sm items-center font-label-sm text-label-sm">
                    <span className="text-primary font-bold">Active</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Commercial B2B Contracts Board */}
        <section className="glass-panel p-lg rounded-xl flex flex-col gap-md">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs">
            B2B Commercial Contracts Board
          </h3>
          
          <div className="flex flex-col gap-md">
            {marketContracts.map(contract => {
              const activeModel = llms.find(m => m.id === contract.activeModelId);
              
              // Filter models that are eligible for this contract
              const eligibleModels = trainedModels.filter(m => checkEligibility(m, contract));
              const selectedModelId = selectedModels[contract.id] || '';

              return (
                <div key={contract.id} className="p-md rounded-xl border border-white/5 bg-surface-container/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                  <div className="flex-1 space-y-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="font-label-md text-label-md text-on-surface font-bold text-lg">{contract.client}</h4>
                      <span className="text-xs font-semibold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">
                        ${contract.rewardPerTick.toLocaleString()}/tick
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-sm text-xs text-outline pt-2 border-t border-white/5">
                      <div>
                        <span className="block font-semibold">STAT REQUIREMENT:</span>
                        <span className="capitalize text-on-surface">
                          {contract.requirement.stat === 'hallucination' 
                            ? `Hallucination <= ${contract.requirement.value}%` 
                            : `${contract.requirement.stat} >= ${contract.requirement.value}%`}
                        </span>
                      </div>
                      <div>
                        <span className="block font-semibold">LEASE LIFETIME:</span>
                        <span className="text-on-surface">
                          {contract.activeModelId ? `Completing in ${contract.timeLeft} ticks` : `${contract.duration} ticks`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 flex flex-col gap-sm pt-2 md:pt-0">
                    {contract.activeModelId && activeModel ? (
                      <div className="flex flex-col items-end gap-xs w-full md:w-auto">
                        <span className="px-3 py-1 bg-secondary/15 border border-secondary/30 text-secondary text-xs rounded font-bold">
                          Leased: {activeModel.name}
                        </span>
                        <button
                          onClick={() => cancelContract(contract.id)}
                          className="text-xs text-outline hover:text-error hover:underline transition-colors mt-1"
                        >
                          Cancel Lease (No penalty)
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full md:w-auto">
                        <select
                          value={selectedModelId}
                          onChange={(e) => handleSelectModelForContract(contract.id, e.target.value)}
                          className="bg-surface-dim border border-outline-variant rounded-lg px-2 py-1.5 text-xs text-on-surface outline-none max-w-[150px]"
                        >
                          <option value="">Select Model...</option>
                          {eligibleModels.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name} (v{m.version.toFixed(1)})
                            </option>
                          ))}
                        </select>
                        
                        <button
                          onClick={() => handleBind(contract.id)}
                          disabled={!selectedModelId}
                          className="bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm px-4 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Bind
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Competitor Market Intelligence (4 Cols) */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl flex flex-col gap-md">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest border-b border-white/10 pb-xs">
            Competitor Diagnostics
          </h3>
          
          <p className="font-body-md text-body-md text-outline text-xs">
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
                <div className="grid grid-cols-4 gap-1 text-[10px] text-outline-variant font-semibold pt-1">
                  <div>KNOW: {rival.stats.knowledge}%</div>
                  <div>CODE: {rival.stats.coding}%</div>
                  <div>MATH: {rival.stats.math}%</div>
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
