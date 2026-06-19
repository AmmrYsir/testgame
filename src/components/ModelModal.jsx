import { useState } from 'react';
import { useGameStore } from '../store';

export default function ModelModal({ isOpen, onClose }) {
  const { 
    llms, 
    research, 
    infrastructure, 
    resources, 
    createModel, 
    startTraining, 
    releaseLLM, 
    setModelPrice, 
    countries, 
    deployModelToCountry, 
    allocateGpusToCountry 
  } = useGameStore();
  
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Model Form State
  const [newName, setNewName] = useState('Aether');
  const [newArch, setNewArch] = useState('transformer');

  // Training Config State
  const [allocatedGpus, setAllocatedGpus] = useState(64);
  const [epochs, setEpochs] = useState(3);
  const [datasetType, setDatasetType] = useState('web_dump');

  // Release Config State
  const [releasePrice, setReleasePrice] = useState(15);

  if (!isOpen) return null;

  // Selected Model Object
  const selectedModel = llms.find(m => m.id === selectedModelId) || llms[0];

  // Calculate available GPUs
  const totalGpus = infrastructure.gpus + infrastructure.cloudGpusRented;
  const activeTrainingGpus = llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
  const activeProductionGpus = llms.reduce((sum, m) => sum + (m.productionGpus || 0), 0);
  const idleGpus = Math.max(0, totalGpus - activeTrainingGpus - activeProductionGpus);

  const liveYield = selectedModel ? Math.round((selectedModel.marketMetrics?.users || 0) * (selectedModel.priceTag || 0) * ((selectedModel.marketMetrics?.satisfaction || 100) / 100)) : 0;

  const handleCreateModelSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createModel(newName, newArch);
    setIsCreating(false);
    setNewName('Aether');
  };

  const handleLaunchTraining = (modelId) => {
    const cost = calculateTrainingCost();
    if (resources.cash < cost || allocatedGpus > idleGpus) return;
    startTraining(modelId, allocatedGpus, epochs, datasetType);
  };

  // Dataset descriptions and gains
  const datasets = {
    web_dump: { name: 'Common Crawl Scraping', cost: 15000, desc: 'Scrape raw public web data. Broad coverage but lower quality.', gainText: '+5% Knowledge, +5% Multilingual, +3% Multimodal', unlocked: true },
    textbooks: { name: 'Premium Textbook Corpus', cost: 80000, desc: 'Licensed educational text. Strong knowledge and reasoning foundations.', gainText: '+12% Knowledge, +8% Reasoning, +6% Math', unlocked: research.unlockedTech.includes('textbook_acquisition') },
    synthetic: { name: 'Synthetic Reasoning Data', cost: 200000, desc: 'AI-generated logic proofs and code. Heavy coding and math boost.', gainText: '+20% Coding & Math, +10% Reasoning', unlocked: research.unlockedTech.includes('synthetic_data') },
    rlhf_align: { name: 'RLHF Expert Alignment', cost: 350000, desc: 'Human feedback refinement. Boosts agentic capability and broad skills.', gainText: '+15% Agentic, +10% Coding, +8% Reasoning', unlocked: research.unlockedTech.includes('rlhf') }
  };

  // Helper to calculate total training cost
  const calculateTrainingCost = () => {
    const dataCost = datasets[datasetType]?.cost || 0;
    const computeCost = allocatedGpus * epochs * 10;
    return dataCost + computeCost;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-fade-in" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-[1050px] h-[670px] rounded-xl flex flex-col overflow-hidden shadow-2xl relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-lg py-4 border-b border-white/10 bg-surface-container/60 flex justify-between items-center flex-none">
          <div className="flex flex-col">
            <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">psychology</span>
              AI Model Registry
            </h3>
            <span className="font-mono text-[9.5px] text-outline uppercase tracking-wider mt-0.5">
              Design, Train, and Deploy Artificial Intelligence Assets
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content Pane */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Model List (38% width) */}
          <div className="w-[38%] border-r border-white/10 flex flex-col h-full bg-surface-dim/20">
            <div className="p-3 border-b border-white/5 bg-surface-container-low/30 flex justify-between items-center px-lg">
              <span className="text-[10px] text-outline uppercase font-semibold tracking-wider">Repository ({llms.length})</span>
              <button
                onClick={() => {
                  setIsCreating(true);
                  setSelectedModelId(null);
                }}
                className="bg-primary hover:bg-primary-container text-on-primary font-mono text-[9px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[12px]">add</span>
                Create Design
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-md">
              {llms.length === 0 ? (
                <div className="p-lg rounded-xl text-center flex flex-col items-center justify-center py-12 gap-sm">
                  <span className="material-symbols-outlined text-outline text-4xl">folder_open</span>
                  <p className="text-outline text-xs">No models found in repository.</p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="mt-xs text-primary text-xs hover:underline cursor-pointer"
                  >
                    Design your first model
                  </button>
                </div>
              ) : (
                llms.map((model) => {
                  const isActive = selectedModel?.id === model.id && !isCreating;
                  const isDeveloping = model.status === 'developing';
                  const isTraining = model.status === 'training';
                  const isReleased = model.status === 'released';
                  
                  return (
                    <div
                      key={model.id}
                      onClick={() => {
                        setSelectedModelId(model.id);
                        setIsCreating(false);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                        isActive
                          ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(173,198,255,0.1)]'
                          : 'bg-surface-container/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h3 className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 font-bold truncate">
                            {model.name}
                            <span className="text-outline text-[10px] px-1.5 py-0.5 bg-surface-container-highest rounded border border-white/5 shrink-0">
                              v{model.version}
                            </span>
                          </h3>
                          <span className="font-label-sm text-[10px] text-outline capitalize block mt-0.5">
                            {model.architecture === 'moe' ? 'Mixture of Experts' : model.architecture === 'ssm' ? 'State Space' : model.architecture === 'liquid_nn' ? 'Liquid Neural Network' : 'Transformer'}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold border ${
                            isDeveloping
                              ? 'bg-primary/10 border-primary/20 text-primary'
                              : isTraining
                              ? 'bg-secondary/10 border-secondary/20 text-secondary animate-pulse'
                              : isReleased
                              ? 'bg-primary/10 border-primary/20 text-primary'
                              : model.status === 'trained'
                              ? 'bg-tertiary/10 border-tertiary/20 text-tertiary'
                              : 'bg-surface-container-highest border-outline-variant text-outline'
                          }`}
                        >
                          {model.status}
                        </span>
                      </div>

                      {/* Training Progress Bar */}
                      {isTraining && model.training && (
                        <div className="w-full mt-1">
                          <div className="flex justify-between text-[10px] text-outline mb-1 font-mono">
                            <span>Training Weights...</span>
                            <span>{Math.min(100, Math.round((model.training.progress / model.training.totalTicks) * 100))}%</span>
                          </div>
                          <div className="w-full bg-surface-dim rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-secondary h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (model.training.progress / model.training.totalTicks) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Development Progress Bar */}
                      {isDeveloping && (
                        <div className="w-full mt-1">
                          <div className="flex justify-between text-[10px] text-outline mb-1 font-mono">
                            <span>Backbone Compilation...</span>
                            <span>{Math.round((model.creationProgress / model.creationTotalTicks) * 100)}%</span>
                          </div>
                          <div className="w-full bg-surface-dim rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${(model.creationProgress / model.creationTotalTicks) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Miniature Stats Row */}
                      {!isTraining && !isDeveloping && (
                        <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-white/5 text-[9px] font-mono">
                          {Object.entries(model.stats).slice(0, 4).map(([stat, val]) => (
                            <div key={stat} className="flex flex-col">
                              <span className="text-outline uppercase font-semibold">{stat.slice(0,4)}</span>
                              <span className="text-on-surface">{val}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detail Inspector (62% width) */}
          <div className="w-[62%] flex flex-col h-full bg-surface-container-low/20 overflow-y-auto custom-scrollbar p-lg">
            {isCreating ? (
              /* NEW MODEL FORM */
              <form onSubmit={handleCreateModelSubmit} className="flex flex-col gap-lg h-full">
                <div className="border-b border-white/10 pb-sm">
                  <h2 className="font-headline-md text-headline-md text-on-surface text-lg font-bold">Create New Model Layout</h2>
                  <p className="text-outline text-xs mt-1">
                    Design and configure a new neural backbone. Layout development requires 6 months.
                  </p>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-outline font-semibold" htmlFor="modal-m-name">Model Name</label>
                  <input
                    id="modal-m-name"
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-[#0b0e15]/60 border border-white/10 rounded-lg p-sm font-body-md text-body-md text-on-surface focus:border-primary transition-all outline-none"
                    placeholder="e.g. Aether"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-outline font-semibold mb-2">Backbone Architecture</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                    {/* Transformer */}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="newArch"
                        value="transformer"
                        checked={newArch === 'transformer'}
                        onChange={() => setNewArch('transformer')}
                        className="peer sr-only"
                      />
                      <div className="p-4 rounded-xl bg-[#0b0e15]/40 border border-white/5 peer-checked:border-primary peer-checked:bg-primary/10 transition-all flex flex-col gap-2 items-center text-center hover:bg-[#0b0e15]/80">
                        <span className="material-symbols-outlined text-outline peer-checked:text-primary">schema</span>
                        <div>
                          <h4 className="font-label-md text-label-md text-on-surface font-bold text-xs">Transformer</h4>
                          <p className="text-[10px] text-outline mt-0.5">Classic attention model.</p>
                        </div>
                      </div>
                    </label>

                    {/* MoE */}
                    {research.unlockedTech.includes('moe') ? (
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="newArch"
                          value="moe"
                          checked={newArch === 'moe'}
                          onChange={() => setNewArch('moe')}
                          className="peer sr-only"
                        />
                        <div className="p-4 rounded-xl bg-[#0b0e15]/40 border border-white/5 peer-checked:border-primary peer-checked:bg-primary/10 transition-all flex flex-col gap-2 items-center text-center hover:bg-[#0b0e15]/80">
                          <span className="material-symbols-outlined text-outline peer-checked:text-primary">account_tree</span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold text-xs">MoE</h4>
                            <p className="text-[10px] text-outline mt-0.5">Mix of experts.</p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-dim/30 border border-white/5 opacity-40 flex flex-col gap-2 items-center text-center select-none animate-pulse-slow">
                        <span className="material-symbols-outlined text-outline text-sm">lock</span>
                        <div>
                          <h4 className="font-label-md text-label-md text-outline font-bold text-xs">MoE Locked</h4>
                          <p className="text-[10px] text-outline mt-0.5">Requires research.</p>
                        </div>
                      </div>
                    )}

                    {/* SSM */}
                    {research.unlockedTech.includes('ssm') ? (
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="newArch"
                          value="ssm"
                          checked={newArch === 'ssm'}
                          onChange={() => setNewArch('ssm')}
                          className="peer sr-only"
                        />
                        <div className="p-4 rounded-xl bg-[#0b0e15]/40 border border-white/5 peer-checked:border-primary peer-checked:bg-primary/10 transition-all flex flex-col gap-2 items-center text-center hover:bg-[#0b0e15]/80">
                          <span className="material-symbols-outlined text-outline peer-checked:text-primary">dns</span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold text-xs">SSM</h4>
                            <p className="text-[10px] text-outline mt-0.5">Linear complexity model.</p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-dim/30 border border-white/5 opacity-40 flex flex-col gap-2 items-center text-center select-none animate-pulse-slow">
                        <span className="material-symbols-outlined text-outline text-sm">lock</span>
                        <div>
                          <h4 className="font-label-md text-label-md text-outline font-bold text-xs">SSM Locked</h4>
                          <p className="text-[10px] text-outline mt-0.5">Requires research.</p>
                        </div>
                      </div>
                    )}

                    {/* Liquid NN */}
                    {research.unlockedTech.includes('liquid_nn') ? (
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="newArch"
                          value="liquid_nn"
                          checked={newArch === 'liquid_nn'}
                          onChange={() => setNewArch('liquid_nn')}
                          className="peer sr-only"
                        />
                        <div className="p-4 rounded-xl bg-[#0b0e15]/40 border border-white/5 peer-checked:border-primary peer-checked:bg-primary/10 transition-all flex flex-col gap-2 items-center text-center hover:bg-[#0b0e15]/80">
                          <span className="material-symbols-outlined text-outline peer-checked:text-primary">waves</span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold text-xs">Liquid NN</h4>
                            <p className="text-[10px] text-outline mt-0.5">Adaptive differential flow.</p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-dim/30 border border-white/5 opacity-40 flex flex-col gap-2 items-center text-center select-none animate-pulse-slow">
                        <span className="material-symbols-outlined text-outline text-sm">lock</span>
                        <div>
                          <h4 className="font-label-md text-label-md text-outline font-bold text-xs">Liquid Locked</h4>
                          <p className="text-[10px] text-outline mt-0.5">Requires research.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto border-t border-white/10 pt-md flex justify-end gap-md">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="border border-white/10 hover:border-white/20 text-on-surface font-mono text-[10px] uppercase font-bold px-lg py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-container text-on-primary font-mono text-[10px] uppercase font-bold px-lg py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                  >
                    Start Development (6 mo)
                  </button>
                </div>
              </form>
            ) : selectedModel ? (
              /* MODEL DETAILS & TRAINING PANELS */
              <div className="flex flex-col gap-lg h-full">
                
                {/* Header Info */}
                <div className="flex justify-between items-start border-b border-white/10 pb-md flex-none">
                  <div>
                    <div className="flex items-center gap-sm">
                      <h2 className="font-headline-lg text-headline-lg text-on-surface text-xl font-bold">{selectedModel.name}</h2>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary font-bold">
                        v{selectedModel.version}
                      </span>
                    </div>
                    <p className="text-outline text-xs capitalize mt-1">
                      Neural Architecture: {selectedModel.architecture === 'moe' ? 'Mixture of Experts' : selectedModel.architecture === 'ssm' ? 'State Space Model' : selectedModel.architecture === 'liquid_nn' ? 'Liquid Neural Network' : 'Transformer'}
                    </p>
                  </div>

                  {selectedModel.status === 'released' && (
                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] uppercase tracking-wider font-bold">
                        DEPLOYED
                      </span>
                      {liveYield > 0 && (
                        <span className="text-[10px] text-emerald-500 font-mono mt-1 font-semibold">+${liveYield.toLocaleString()}/tick</span>
                      )}
                    </div>
                  )}

                  {selectedModel.status === 'training' && (
                    <span className="px-2.5 py-0.5 rounded bg-secondary/15 border border-secondary/20 text-secondary font-mono text-[9px] uppercase tracking-wider font-bold animate-pulse flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] animate-spin">sync</span> Training
                    </span>
                  )}

                  {selectedModel.status === 'developing' && (
                    <span className="px-2.5 py-0.5 rounded bg-primary/15 border border-primary/20 text-primary font-mono text-[9px] uppercase tracking-wider font-bold animate-pulse">
                      Developing
                    </span>
                  )}
                </div>

                {/* Model Body Split */}
                <div className="flex-1 overflow-y-auto space-y-lg custom-scrollbar pr-1">
                  
                  {/* If Developing, show development panel */}
                  {selectedModel.status === 'developing' ? (
                    <div className="bg-[#0b0e15]/40 border border-white/5 rounded-xl p-lg space-y-md flex flex-col justify-center items-center text-center py-12">
                      <span className="material-symbols-outlined text-primary text-5xl animate-pulse">schema</span>
                      <div>
                        <h4 className="font-label-lg text-label-lg text-on-surface font-bold">Neural Backbone Under Development</h4>
                        <p className="text-outline text-xs mt-2 leading-relaxed max-w-sm">
                          Our research engineers are compiling the neural layers, attention heads, and weights mapping. This compile takes 6 months total.
                        </p>
                      </div>
                      <div className="w-full max-w-md mt-sm space-y-2">
                        <div className="flex justify-between text-[11px] font-mono text-outline">
                          <span>Progress: Month {Math.floor(selectedModel.creationProgress / 30) + 1} / 6</span>
                          <span>{Math.round((selectedModel.creationProgress / selectedModel.creationTotalTicks) * 100)}%</span>
                        </div>
                        <div className="w-full bg-[#0b0e15] rounded-full h-2 overflow-hidden border border-white/5">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${(selectedModel.creationProgress / selectedModel.creationTotalTicks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Stats Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-[#0b0e15]/30 p-md rounded-xl border border-white/5">
                        <div className="space-y-xs">
                          <span className="text-[10px] text-outline font-mono uppercase tracking-wider block font-bold">Benchmark Scores</span>
                          {[  
                            { key: 'agentic', label: 'Agentic Capability' },
                            { key: 'coding', label: 'Coding (HumanEval)' },
                            { key: 'reasoning', label: 'Reasoning (ARC-AGI)' },
                            { key: 'knowledge', label: 'Knowledge (MMLU)' },
                            { key: 'math', label: 'Math (GSM8K)' },
                            { key: 'multilingual', label: 'Multilingual' },
                            { key: 'multimodal', label: 'Multimodal Understanding' }
                          ].map(({ key, label }) => (
                            <div key={key}>
                              <div className="flex justify-between text-[11px] text-on-surface mb-0.5 font-mono">
                                <span>{label}</span>
                                <span className="font-bold">{selectedModel.stats[key]}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${selectedModel.stats[key]}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-md md:pt-0 md:pl-lg gap-sm">
                          <span className="text-[10px] text-outline font-mono uppercase tracking-wider block font-bold">Chassis Details</span>
                          <div className="space-y-sm text-xs font-mono">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-outline">Status:</span>
                              <span className="text-on-surface capitalize font-bold">{selectedModel.status}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-outline">Deployed:</span>
                              <span className="text-on-surface font-bold">
                                {selectedModel.status === 'released' ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex justify-between pb-1">
                              <span className="text-outline">Allocated Nodes:</span>
                              <span className="text-on-surface font-bold">{selectedModel.productionGpus} GPUs</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Training Progress / Configuration */}
                      {selectedModel.status === 'training' && selectedModel.training ? (
                        /* ACTIVE TRAINING RUN VIEW */
                        <div className="bg-secondary/5 border border-secondary/15 rounded-xl p-md space-y-md flex flex-col">
                          <h4 className="font-mono text-[10px] text-secondary uppercase font-bold tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm animate-spin">sync</span> Training Weights Aligner Active
                          </h4>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center bg-[#07090d]/80 p-3 rounded-lg border border-white/5">
                            <div>
                              <span className="text-[9px] text-outline uppercase font-mono block">Compute Nodes</span>
                              <p className="font-mono text-sm font-bold text-on-surface mt-0.5">{selectedModel.training.allocatedGpus} H100s</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-outline uppercase font-mono block">Duration</span>
                              <p className="font-mono text-sm font-bold text-on-surface mt-0.5">{selectedModel.training.totalTicks} days</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-outline uppercase font-mono block">Budget Cost</span>
                              <p className="font-mono text-sm font-bold text-on-surface mt-0.5">${selectedModel.training.cost.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-outline uppercase font-mono block">Next Suffix</span>
                              <p className="font-mono text-sm font-bold text-secondary mt-0.5">Pending</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-outline font-mono">
                              <span>Training Progress (Day {Math.min(selectedModel.training.totalTicks, Math.round(selectedModel.training.progress))}/{selectedModel.training.totalTicks})</span>
                              <span className="text-secondary font-bold">{Math.min(100, Math.round((selectedModel.training.progress / selectedModel.training.totalTicks) * 100))}%</span>
                            </div>
                            <div className="w-full bg-[#0b0e15] rounded-full h-1.5 overflow-hidden border border-white/5">
                              <div
                                className="bg-secondary h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, (selectedModel.training.progress / selectedModel.training.totalTicks) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : selectedModel.status === 'released' ? (
                        /* SERVE & SCALE FOR RELEASED */
                        <div className="space-y-md border-t border-white/10 pt-md">
                          <h3 className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">cloud</span> Deployment Platform Settings
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-md bg-[#0b0e15]/40 p-4 rounded-xl border border-white/5">
                            <div className="space-y-md">
                              <h4 className="text-outline font-mono text-[10px] font-bold uppercase tracking-wider">Performance Indicators</h4>
                              
                              {/* Latency */}
                              <div className="flex justify-between items-center bg-[#0b0e15] p-2.5 rounded-lg border border-white/5 text-xs font-mono">
                                <div>
                                  <span className="text-outline text-[9.5px] uppercase block">Average Latency</span>
                                  <span className="font-bold text-on-surface">{selectedModel.marketMetrics?.latency || 10} ms</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  (selectedModel.marketMetrics?.latency || 10) <= 15
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                    : (selectedModel.marketMetrics?.latency || 10) <= 50
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                    : 'bg-error/10 border-error/20 text-error animate-pulse'
                                }`}>
                                  {(selectedModel.marketMetrics?.latency || 10) <= 15 ? 'Optimal' : 
                                   (selectedModel.marketMetrics?.latency || 10) <= 50 ? 'High Latency' : 'Throttled'}
                                </span>
                              </div>

                              {/* Satisfaction */}
                              <div className="bg-[#0b0e15] p-2.5 rounded-lg border border-white/5 space-y-1 text-xs">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-outline uppercase">Customer Satisfaction</span>
                                  <span className={`font-bold ${(selectedModel.marketMetrics?.satisfaction || 100) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {selectedModel.marketMetrics?.satisfaction || 100}%
                                  </span>
                                </div>
                                <div className="w-full bg-[#0b0e15] h-1.5 rounded-full overflow-hidden border border-white/5">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      (selectedModel.marketMetrics?.satisfaction || 100) >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${selectedModel.marketMetrics?.satisfaction || 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* Traffic & Pricing */}
                            <div className="space-y-md">
                              <h4 className="text-outline font-mono text-[10px] font-bold uppercase tracking-wider">Pricing & Demand</h4>
                              
                              <div className="flex justify-between items-center bg-[#0b0e15] p-2.5 rounded-lg border border-white/5 text-xs font-mono">
                                <div>
                                  <span className="text-outline text-[9.5px] uppercase block">Active Customers</span>
                                  <span className="font-bold text-on-surface">{(selectedModel.marketMetrics?.users || 0).toLocaleString()}</span>
                                </div>
                                <span className="text-[10px] text-outline">
                                  Max Routed Demand: {Object.values(countries || {}).filter(c => c.deployedModelId === selectedModel.id).reduce((sum, c) => sum + c.demand, 0).toLocaleString()}
                                </span>
                              </div>

                              {/* Pricing tag slider */}
                              <div className="bg-[#0b0e15] p-2.5 rounded-lg border border-white/5 space-y-1 text-xs">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-outline uppercase">Adjust Price</span>
                                  <span className="font-bold text-primary">
                                    ${(selectedModel.priceTag || 15).toLocaleString()}/mo
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min={1}
                                  max={100}
                                  step={1}
                                  value={selectedModel.priceTag || 15}
                                  onChange={(e) => setModelPrice(selectedModel.id, parseInt(e.target.value))}
                                  className="w-full accent-primary h-1 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Regional Deployments */}
                          <div className="bg-[#0b0e15]/40 border border-white/5 p-md rounded-xl space-y-md">
                            <div>
                              <h4 className="font-bold text-xs text-on-surface">Regional Routing Hub</h4>
                              <p className="text-[10.5px] text-outline mt-0.5">Route incoming regional queries to this model.</p>
                            </div>

                            {(() => {
                              const deployed = Object.entries(countries || {}).filter(
                                ([_, country]) => country.deployedModelId === selectedModel.id
                              );

                              if (deployed.length === 0) {
                                return (
                                  <div className="text-center py-6 border border-dashed border-white/10 rounded-lg">
                                    <p className="text-xs text-outline italic">No regional instances deployed.</p>
                                  </div>
                                );
                              }

                              return (
                                <div className="space-y-sm max-h-[160px] overflow-y-auto custom-scrollbar pr-xs font-mono">
                                  {deployed.map(([code, country]) => (
                                    <div key={code} className="flex flex-col gap-2 bg-[#0c0f16]/60 p-2.5 rounded-lg border border-white/5 text-xs">
                                      <div className="flex justify-between items-center">
                                        <span className="font-bold text-on-surface">{country.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => deployModelToCountry(code, null)}
                                          className="text-[9.5px] text-error hover:underline font-bold"
                                        >
                                          Undeploy
                                        </button>
                                      </div>
                                      
                                      <div className="flex gap-md text-[10px] text-outline">
                                        <span>Share: <strong className="text-primary">{country.playerShare}%</strong></span>
                                        <span>Latency: <strong className="text-emerald-500">{country.latency}ms</strong></span>
                                      </div>

                                      {/* GPU Allocator inside Regional Hub */}
                                      {(() => {
                                        const allocatedToOthers = Object.entries(countries || {}).reduce((sum, [cid, c]) => {
                                          if (cid === code) return sum;
                                          return sum + (c.allocatedGpus || 0);
                                        }, 0);
                                        const maxAlloc = totalGpus - activeTrainingGpus - allocatedToOthers;
                                        const currentAlloc = country.allocatedGpus || 0;

                                        return (
                                          <div className="mt-1 bg-[#0b0e15]/60 p-2 rounded border border-white/5 space-y-1">
                                            <div className="flex justify-between text-[9px] text-outline font-semibold">
                                              <span>Route Compute Nodes</span>
                                              <span>Available Pool: {maxAlloc} GPUs</span>
                                            </div>
                                            <div className="flex items-center gap-sm">
                                              <input
                                                type="range"
                                                min="0"
                                                max={maxAlloc}
                                                value={currentAlloc}
                                                onChange={(e) => allocateGpusToCountry(code, parseInt(e.target.value))}
                                                className="flex-1 accent-primary h-1 cursor-pointer"
                                              />
                                              <span className="text-[11px] font-bold text-primary w-6 text-right shrink-0">
                                                {currentAlloc}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}

                            {/* Select Dropdown to Deploy */}
                            <div className="flex gap-sm items-center border-t border-white/5 pt-md">
                              <select
                                className="bg-[#0b0e15] border border-white/10 rounded-lg p-2 text-xs text-on-surface focus:border-primary transition-all outline-none flex-1"
                                defaultValue=""
                                onChange={(e) => {
                                  const code = e.target.value;
                                  if (code) {
                                    deployModelToCountry(code, selectedModel.id);
                                    e.target.value = "";
                                  }
                                }}
                              >
                                <option value="">-- Route to New Region --</option>
                                {Object.entries(countries || {}).map(([code, country]) => {
                                  if (country.deployedModelId !== selectedModel.id && country.openMarkets?.player) {
                                    return (
                                      <option key={code} value={code}>
                                        {country.name} ({code}) {country.deployedModelId ? ' - Overwrite' : ''}
                                      </option>
                                    );
                                  }
                                  return null;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* TRAINING CONFIGURATOR (FOR DRAFT OR TRAINED MODELS) */
                        <div className="space-y-md border-t border-white/10 pt-md">
                          <div className="flex justify-between items-center font-mono">
                            <h3 className="text-[10px] text-primary uppercase font-bold tracking-wider">
                              {selectedModel.status === 'draft' ? 'Configure Training' : 'Configure Fine-Tuning'}
                            </h3>
                            <span className="text-[10px] text-outline">
                              Targeting: Upgrade
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-md bg-[#0b0e15]/40 p-4 rounded-xl border border-white/5">
                            <div className="space-y-md">
                              {/* GPU Allocator */}
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs font-mono">
                                  <label className="text-outline font-semibold">GPU Nodes Allocation</label>
                                  <span className="font-bold text-primary">{allocatedGpus} H100s</span>
                                </div>
                                <input
                                  className="w-full accent-primary h-1 cursor-pointer"
                                  max={Math.max(16, idleGpus)}
                                  min="8"
                                  step="8"
                                  type="range"
                                  disabled={idleGpus < 8}
                                  value={allocatedGpus}
                                  onChange={(e) => setAllocatedGpus(parseInt(e.target.value))}
                                />
                                <div className="flex justify-between text-[9px] text-outline font-mono mt-1">
                                  <span>Min: 8</span>
                                  <span>Available Max: {idleGpus} GPUs</span>
                                </div>
                                {idleGpus < 8 && (
                                  <p className="text-[9.5px] text-error mt-1">Not enough idle GPUs. Buy physical nodes or lease Cloud GPU capacity.</p>
                                )}
                              </div>

                              {/* Epochs */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs font-mono">
                                  <label className="text-outline font-semibold">Training Epochs</label>
                                  <span className="text-[10px] text-outline">Duration: {Math.max(180, epochs * 60)} ticks</span>
                                </div>
                                <input
                                  className="w-full bg-[#0b0e15]/60 border border-white/10 rounded-lg p-2 text-xs text-on-surface text-center outline-none focus:border-primary transition-all font-mono"
                                  max="10"
                                  min="1"
                                  type="number"
                                  value={epochs}
                                  onChange={(e) => setEpochs(parseInt(e.target.value))}
                                />
                              </div>
                            </div>

                            {/* Dataset Selector */}
                            <div className="space-y-sm flex flex-col text-left">
                              <label className="text-outline font-mono text-[10px] uppercase font-bold tracking-wider">Select Training Corpus</label>
                              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[160px] custom-scrollbar">
                                {Object.entries(datasets).map(([key, dataset]) => {
                                  const isDatasetUnlocked = dataset.unlocked;
                                  return (
                                    <div
                                      key={key}
                                      onClick={() => isDatasetUnlocked && setDatasetType(key)}
                                      className={`p-2.5 rounded-lg border text-left transition-all flex justify-between items-start gap-sm ${
                                        !isDatasetUnlocked
                                          ? 'opacity-45 bg-[#0c0f16]/30 border-white/5 cursor-not-allowed'
                                          : datasetType === key
                                          ? 'bg-primary/5 border-primary shadow-[0_0_8px_rgba(59,130,246,0.15)] cursor-pointer'
                                          : 'bg-[#0b0e15]/50 border-white/5 hover:border-white/10 cursor-pointer'
                                      }`}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <h4 className="text-on-surface font-bold text-xs truncate">{dataset.name}</h4>
                                          {!isDatasetUnlocked && (
                                            <span className="material-symbols-outlined text-[11px] text-outline font-bold">lock</span>
                                          )}
                                        </div>
                                        <p className="text-[9.5px] text-outline leading-tight mt-0.5">
                                          {isDatasetUnlocked ? dataset.desc : `Requires research: ${
                                            key === 'textbooks' ? 'Textbook Acquisition' :
                                            key === 'synthetic' ? 'Synthetic Data Generation' : 'RLHF Alignment'
                                          }`}
                                        </p>
                                        <span className="text-[9px] text-primary font-semibold font-mono block mt-1">{dataset.gainText}</span>
                                      </div>
                                      <span className="font-mono text-xs font-bold text-on-surface shrink-0">
                                        ${(dataset.cost / 1000).toFixed(0)}k
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Estimate Cost and Button */}
                          <div className="flex justify-between items-center gap-md border-t border-white/10 pt-md mt-sm bg-[#0b0e15]/40 p-4 rounded-xl border border-white/5">
                            <div className="font-mono">
                              <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Estimated Run Budget</span>
                              <p className="text-lg font-bold text-on-surface mt-0.5">${calculateTrainingCost().toLocaleString()}</p>
                            </div>
                            
                            <button
                              onClick={() => handleLaunchTraining(selectedModel.id)}
                              disabled={resources.cash < calculateTrainingCost() || idleGpus < 8}
                              className="bg-secondary hover:bg-[#10b981] text-white font-mono text-[10.5px] uppercase font-bold tracking-wider py-3 px-lg rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-sm">rocket_launch</span>
                              Start Training (6 mo)
                            </button>
                          </div>

                          {/* Release settings panel for trained */}
                          {selectedModel.status === 'trained' && (
                            <div className="mt-lg border-t border-white/10 pt-lg space-y-md">
                              <h3 className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">
                                Release Commercialization Configuration
                              </h3>
                              
                              <div className="bg-[#0b0e15]/40 p-4 rounded-xl border border-white/5 space-y-md">
                                {/* Price tag */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-xs font-mono">
                                    <label className="text-outline font-semibold">Release Price Tag</label>
                                    <span className="font-bold text-primary">
                                      ${releasePrice.toLocaleString()}/mo subscription
                                    </span>
                                  </div>
                                  <input
                                    type="range"
                                    min={1}
                                    max={100}
                                    step={1}
                                    value={releasePrice}
                                    onChange={(e) => setReleasePrice(parseInt(e.target.value))}
                                    className="w-full accent-primary h-1 cursor-pointer"
                                  />
                                </div>
                              </div>

                              <button
                                onClick={() => releaseLLM(selectedModel.id, releasePrice)}
                                className="w-full bg-primary hover:bg-primary-container text-on-primary font-mono text-[10.5px] uppercase font-bold tracking-wider py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">publish</span>
                                Release Model & Open API Gateway
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full text-outline italic py-24 gap-sm">
                <span className="material-symbols-outlined text-outline text-5xl animate-pulse">psychology</span>
                Select a model from the repository registry or compile a new neural backbone.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
