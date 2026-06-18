import { useState } from 'react';
import { useGameStore } from '../store';

export default function ModelView() {
  const { llms, research, infrastructure, resources, createModel, startTraining, releaseLLM, setModelPrice, countries, deployModelToCountry, allocateGpusToCountry } = useGameStore();
  
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
  const [releaseSegment, setReleaseSegment] = useState('consumer');
  const [releasePrice, setReleasePrice] = useState(15);

  const handleSegmentChange = (seg) => {
    setReleaseSegment(seg);
    if (seg === 'consumer') setReleasePrice(15);
    else if (seg === 'dev') setReleasePrice(5);
    else if (seg === 'business') setReleasePrice(25);
    else if (seg === 'enterprise') setReleasePrice(5000);
  };

  // Selected Model Object
  const selectedModel = llms.find(m => m.id === selectedModelId) || llms[0];

  // Calculate available GPUs
  const totalGpus = infrastructure.gpus + infrastructure.cloudGpusRented;
  const activeTrainingGpus = llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
  const activeProductionGpus = llms.reduce((sum, m) => sum + (m.productionGpus || 0), 0);
  const idleGpus = Math.max(0, totalGpus - activeTrainingGpus - activeProductionGpus);

  const liveYield = selectedModel ? Math.round((selectedModel.marketMetrics?.users || 0) * (selectedModel.priceTag || 0) * ((selectedModel.marketMetrics?.satisfaction || 100) / 100)) : 0;
  const maxAllocatable = selectedModel ? (idleGpus + (selectedModel.productionGpus || 0)) : 0;

  const handleCreateModelSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createModel(newName, newArch);
    setIsCreating(false);
    setNewName('Aether');
  };

  const handleLaunchTraining = (modelId) => {
    if (allocatedGpus > idleGpus) return;
    startTraining(modelId, allocatedGpus, epochs, datasetType);
  };

  // Dataset descriptions and gains
  const datasets = {
    web_dump: { name: 'Common Crawl Scraping', cost: 15000, desc: 'Scrape raw public web data. Broad coverage but lower quality.', gainText: '+5% Knowledge, +5% Multilingual, +3% Multimodal' },
    textbooks: { name: 'Premium Textbook Corpus', cost: 80000, desc: 'Licensed educational text. Strong knowledge and reasoning foundations.', gainText: '+12% Knowledge, +8% Reasoning, +6% Math' },
    synthetic: { name: 'Synthetic Reasoning Data', cost: 200000, desc: 'AI-generated logic proofs and code. Heavy coding and math boost.', gainText: '+20% Coding & Math, +10% Reasoning' },
    rlhf_align: { name: 'RLHF Expert Alignment', cost: 350000, desc: 'Human feedback refinement. Boosts agentic capability and broad skills.', gainText: '+15% Agentic, +10% Coding, +8% Reasoning' }
  };

  // Helper to calculate total training cost
  const calculateTrainingCost = () => {
    const dataCost = datasets[datasetType]?.cost || 0;
    const computeCost = allocatedGpus * epochs * 10;
    return dataCost + computeCost;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-6 pb-24 overflow-y-auto h-full">
      
      {/* LEFT SECTION: Model List (5 Cols) */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-md h-full overflow-hidden">
        <div className="flex justify-between items-center bg-surface-container-low/40 p-3 rounded-xl border border-white/5">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface text-xl">Model Registry</h2>
            <span className="font-label-sm text-label-sm text-outline">Manage and train corporate assets</span>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedModelId(null);
            }}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Create Model
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-md">
          {llms.length === 0 ? (
            <div className="glass-panel p-lg rounded-xl text-center flex flex-col items-center justify-center py-12 gap-sm">
              <span className="material-symbols-outlined text-outline text-5xl">folder_open</span>
              <p className="font-body-md text-body-md text-outline">No models found in repository.</p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-xs text-primary font-label-md text-label-md hover:underline"
              >
                Create your first model design
              </button>
            </div>
          ) : (
            llms.map((model) => {
              const isActive = selectedModel?.id === model.id && !isCreating;
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
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 font-bold">
                        {model.name}
                        <span className="text-outline text-xs px-2 py-0.5 bg-surface-container-highest rounded border border-white/5">
                          v{model.version.toFixed(1)}
                        </span>
                      </h3>
                      <span className="font-label-sm text-label-sm text-outline capitalize">
                        {model.architecture === 'moe' ? 'Mixture of Experts' : model.architecture === 'ssm' ? 'State Space Model' : 'Transformer'}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`font-label-sm text-label-sm px-2.5 py-1 rounded font-semibold border ${
                        isTraining
                          ? 'bg-secondary/10 border-secondary text-secondary animate-pulse'
                          : isReleased
                          ? 'bg-primary/10 border-primary text-primary'
                          : model.status === 'trained'
                          ? 'bg-tertiary/10 border-tertiary text-tertiary'
                          : 'bg-surface-container-highest border-outline-variant text-outline'
                      }`}
                    >
                      {model.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Training Progress Bar */}
                  {isTraining && model.training && (
                    <div className="w-full mt-2">
                      <div className="flex justify-between text-[11px] text-outline mb-1">
                        <span>Aligning Weights...</span>
                        <span>{Math.min(100, Math.round((model.training.progress / model.training.totalTicks) * 100))}%</span>
                      </div>
                      <div className="w-full bg-surface-dim rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(78,222,163,0.5)]"
                          style={{ width: `${Math.min(100, (model.training.progress / model.training.totalTicks) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Miniature Stat Bars */}
                  {!isTraining && (
                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/5">
                      {Object.entries(model.stats).map(([stat, val]) => (
                        <div key={stat} className="flex flex-col">
                          <span className="text-[10px] text-outline uppercase font-semibold">{stat.slice(0,4).toUpperCase()}</span>
                          <span className="font-label-sm text-label-sm text-on-surface">{val}%</span>
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

      {/* RIGHT SECTION: Setup Form or Model Details (7 Cols) */}
      <div className="col-span-1 lg:col-span-7 flex flex-col h-full overflow-hidden">
        {isCreating ? (
          /* NEW MODEL FORM */
          <form
            onSubmit={handleCreateModelSubmit}
            className="glass-panel p-lg rounded-xl flex flex-col gap-lg h-full overflow-y-auto"
          >
            <div className="border-b border-white/10 pb-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">Create New Model</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Design and configure your next AI model.
              </p>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="m-name">Model Name</label>
              <input
                id="m-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-surface-dim border border-outline-variant rounded-lg p-sm font-body-md text-body-md text-on-surface focus:border-primary transition-all outline-none"
                placeholder="e.g. Aether"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-2">Neural Backbone (Architecture)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                {/* Transformer (unlocked) */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="newArch"
                    value="transformer"
                    checked={newArch === 'transformer'}
                    onChange={() => setNewArch('transformer')}
                    className="peer sr-only"
                  />
                  <div className="p-4 rounded-xl bg-surface-dim border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/10 transition-colors flex flex-col gap-2 items-center text-center">
                    <span className="material-symbols-outlined text-outline peer-checked:text-primary">schema</span>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-bold">Transformer</h4>
                      <p className="text-[11px] text-outline mt-0.5">Classic attention model.</p>
                    </div>
                  </div>
                </label>

                {/* MoE (needs research) */}
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
                    <div className="p-4 rounded-xl bg-surface-dim border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/10 transition-colors flex flex-col gap-2 items-center text-center">
                      <span className="material-symbols-outlined text-outline peer-checked:text-primary">account_tree</span>
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold">MoE</h4>
                        <p className="text-[11px] text-outline mt-0.5">Vibrant mix of specialists.</p>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="p-4 rounded-xl bg-surface-dim/30 border border-white/5 opacity-50 flex flex-col gap-2 items-center text-center select-none">
                    <span className="material-symbols-outlined text-outline">lock</span>
                    <div>
                      <h4 className="font-label-md text-label-md text-outline font-bold">MoE Locked</h4>
                      <p className="text-[11px] text-outline mt-0.5">Research in labs tab.</p>
                    </div>
                  </div>
                )}

                {/* SSM (needs research) */}
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
                    <div className="p-4 rounded-xl bg-surface-dim border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/10 transition-colors flex flex-col gap-2 items-center text-center">
                      <span className="material-symbols-outlined text-outline peer-checked:text-primary">database</span>
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface font-bold">SSM</h4>
                        <p className="text-[11px] text-outline mt-0.5">Efficient context processing.</p>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="p-4 rounded-xl bg-surface-dim/30 border border-white/5 opacity-50 flex flex-col gap-2 items-center text-center select-none">
                    <span className="material-symbols-outlined text-outline">lock</span>
                    <div>
                      <h4 className="font-label-md text-label-md text-outline font-bold">SSM Locked</h4>
                      <p className="text-[11px] text-outline mt-0.5">Research in labs tab.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto border-t border-white/10 pt-md flex justify-end gap-md">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="border border-outline hover:border-white/20 text-on-surface font-label-md text-label-md px-lg py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-lg py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(173,198,255,0.2)]"
              >
                Create Model
              </button>
            </div>
          </form>
        ) : selectedModel ? (
          /* MODEL DETAILS & TRAINING PANELS */
          <div className="glass-panel p-lg rounded-xl flex flex-col gap-lg h-full overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-md">
              <div>
                <div className="flex items-center gap-sm">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface text-2xl font-bold">{selectedModel.name}</h2>
                  <span className="text-sm px-2.5 py-0.5 bg-surface-container-highest rounded border border-white/10 text-primary font-semibold">
                    v{selectedModel.version.toFixed(1)}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 capitalize">
                  Architecture: {selectedModel.architecture} Backbone
                </p>
              </div>

              {selectedModel.status === 'released' && (
                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 rounded bg-secondary/15 border border-secondary/30 text-secondary font-label-sm text-[12px] uppercase">
                    API Active ({
                      selectedModel.targetSegment === 'consumer' ? 'Consumer' :
                      selectedModel.targetSegment === 'dev' ? 'Developer' :
                      selectedModel.targetSegment === 'business' ? 'Business' :
                      'Enterprise'
                    })
                  </span>
                  {liveYield > 0 && (
                    <span className="text-xs text-outline mt-1 font-semibold">+${liveYield.toLocaleString()}/tick yield</span>
                  )}
                </div>
              )}

              {selectedModel.status === 'training' && (
                <div className="flex flex-col items-end animate-pulse">
                  <span className="px-3 py-1 rounded bg-secondary/20 border border-secondary text-secondary font-label-sm text-[12px] uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] animate-spin">sync</span> Training Active
                  </span>
                </div>
              )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-sm">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Benchmarks</span>
                
                {[  
                  { key: 'agentic', label: 'Agentic Capability' },
                  { key: 'coding', label: 'Coding Proficiency (HumanEval)' },
                  { key: 'reasoning', label: 'Reasoning (ARC-AGI)' },
                  { key: 'knowledge', label: 'General Knowledge (MMLU)' },
                  { key: 'math', label: 'Math (GSM8K)' },
                  { key: 'multilingual', label: 'Multilingual' },
                  { key: 'multimodal', label: 'Multimodal Understanding' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex justify-between font-label-sm text-label-sm text-on-surface mb-1">
                      <span>{label}</span>
                      <span className="font-bold">{selectedModel.stats[key]}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${selectedModel.stats[key]}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>


            </div>

            {/* Context Action Section */}
            {selectedModel.status === 'training' && selectedModel.training ? (
              /* ACTIVE TRAINING VIEW */
              <div className="mt-md bg-secondary/5 border border-secondary/15 rounded-xl p-lg space-y-md flex flex-col">
                <h3 className="font-label-md text-label-md text-secondary uppercase font-bold tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span> Training Run In Progress
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center bg-surface-dim p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-outline uppercase">Allocated H100s</span>
                    <p className="font-headline-md text-headline-md text-on-surface text-lg font-bold">{selectedModel.training.allocatedGpus}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase">Duration</span>
                    <p className="font-headline-md text-headline-md text-on-surface text-lg font-bold">{selectedModel.training.totalTicks} days</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase">Total Cost</span>
                    <p className="font-headline-md text-headline-md text-on-surface text-lg font-bold">${selectedModel.training.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase">Next Target</span>
                    <p className="font-headline-md text-headline-md text-secondary text-lg font-bold">v{(selectedModel.version + (selectedModel.version === 1.0 && selectedModel.training.progress === 0 ? 0 : 1.0)).toFixed(1)}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-sm">
                  <div className="flex justify-between text-label-sm text-label-sm text-outline">
                    <span>Training Progress (Day {Math.min(selectedModel.training.totalTicks, Math.round(selectedModel.training.progress))}/{selectedModel.training.totalTicks})</span>
                    <span className="text-secondary font-bold">{Math.min(100, Math.round((selectedModel.training.progress / selectedModel.training.totalTicks) * 100))}%</span>
                  </div>
                  <div className="w-full bg-surface-dim rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(78,222,163,0.5)]"
                      style={{ width: `${Math.min(100, (selectedModel.training.progress / selectedModel.training.totalTicks) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : selectedModel.status === 'released' ? (
              /* SERVE & SCALE CONSOLE FOR RELEASED MODELS */
              <div className="mt-md space-y-md border-t border-white/10 pt-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-label-md text-label-md text-secondary uppercase font-bold tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">cloud_done</span> Deployment Console
                  </h3>
                  <span className="text-xs text-outline font-semibold capitalize">
                    Platform: {selectedModel.targetSegment === 'consumer' ? 'B2C App Store' :
                               selectedModel.targetSegment === 'dev' ? 'Dev API Gateway' :
                               selectedModel.targetSegment === 'business' ? 'Business SaaS Portal' :
                               'Dedicated Enterprise Cloud'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-dim/30 p-lg rounded-xl border border-white/5">
                  {/* Performance Indicators */}
                  <div className="space-y-md">
                    <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Performance Metrics</h4>
                    
                    {/* Latency Status */}
                    <div className="flex justify-between items-center bg-surface-dim p-3 rounded-lg border border-white/5">
                      <div>
                        <span className="text-[11px] text-outline block uppercase">Model Latency</span>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {selectedModel.marketMetrics?.latency || 10} ms
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                        (selectedModel.marketMetrics?.latency || 10) <= 15
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                          : (selectedModel.marketMetrics?.latency || 10) <= 50
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          : 'bg-error/10 border-error/30 text-error animate-pulse'
                      }`}>
                        {(selectedModel.marketMetrics?.latency || 10) <= 15 ? 'Optimal' : 
                         (selectedModel.marketMetrics?.latency || 10) <= 50 ? 'High Latency' : 'Severe Throttling'}
                      </span>
                    </div>

                    {/* Customer Satisfaction */}
                    <div className="bg-surface-dim p-3 rounded-lg border border-white/5 space-y-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-outline uppercase">Customer Satisfaction</span>
                        <span className={`font-bold ${
                          (selectedModel.marketMetrics?.satisfaction || 100) >= 80 ? 'text-emerald-500' :
                          (selectedModel.marketMetrics?.satisfaction || 100) >= 50 ? 'text-amber-500' : 'text-error'
                        }`}>
                          {selectedModel.marketMetrics?.satisfaction || 100}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            (selectedModel.marketMetrics?.satisfaction || 100) >= 80 ? 'bg-emerald-500' :
                            (selectedModel.marketMetrics?.satisfaction || 100) >= 50 ? 'bg-amber-500' : 'bg-error'
                          }`}
                          style={{ width: `${selectedModel.marketMetrics?.satisfaction || 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Live Yield */}
                    <div className="flex justify-between items-center bg-surface-dim p-3 rounded-lg border border-white/5">
                      <div>
                        <span className="text-[11px] text-outline block uppercase font-semibold">Current Revenue</span>
                        <p className="text-[10px] text-outline">Adjusted for Customer Satisfaction</p>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-emerald-500 font-bold">
                        +${liveYield.toLocaleString()}/tick
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Traffic Controls */}
                  <div className="space-y-md">
                    <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Demand & Pricing</h4>

                    {/* Traffic metrics */}
                    <div className="flex justify-between items-center bg-surface-dim p-3 rounded-lg border border-white/5">
                      <div>
                        <span className="text-[11px] text-outline block uppercase">
                          {selectedModel.targetSegment === 'consumer' ? 'Active App Users' :
                           selectedModel.targetSegment === 'dev' ? 'Inference Queries / tick' :
                           selectedModel.targetSegment === 'business' ? 'Subscribed Seats' :
                           'Active Dedicated Contracts'}
                        </span>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {(selectedModel.marketMetrics?.users || 0).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-outline">
                        Max Market: {
                          selectedModel.targetSegment === 'consumer' ? '50,000' :
                          selectedModel.targetSegment === 'dev' ? '5,000' :
                          selectedModel.targetSegment === 'business' ? '1,000' :
                          '50'
                        }
                      </span>
                    </div>

                    {/* Pricing Controller */}
                    <div className="bg-surface-dim p-3 rounded-lg border border-white/5 space-y-xs">
                      <div className="flex justify-between items-center mb-xs">
                        <span className="text-[11px] text-outline uppercase">Adjust Price</span>
                        <span className="font-label-md text-label-md text-primary font-bold">
                          ${(selectedModel.priceTag || 10).toLocaleString()} {
                            selectedModel.targetSegment === 'consumer' ? '/mo' :
                            selectedModel.targetSegment === 'dev' ? '/M tokens' :
                            selectedModel.targetSegment === 'business' ? '/seat/mo' :
                            '/mo contract'
                          }
                        </span>
                      </div>
                      <input
                        type="range"
                        min={selectedModel.targetSegment === 'enterprise' ? 1000 : 1}
                        max={selectedModel.targetSegment === 'enterprise' ? 20000 : selectedModel.targetSegment === 'business' ? 200 : selectedModel.targetSegment === 'consumer' ? 100 : 50}
                        step={selectedModel.targetSegment === 'enterprise' ? 500 : 1}
                        value={selectedModel.priceTag || 10}
                        onChange={(e) => setModelPrice(selectedModel.id, parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Regional Deployments List */}
                <div className="bg-surface-dim/30 p-lg rounded-xl border border-white/5 space-y-md">
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Regional Deployments</h4>
                    <p className="text-xs text-outline mt-0.5">Deploy {selectedModel.name} to countries and allocate GPU power.</p>
                  </div>

                  {(() => {
                    const deployedCountries = Object.entries(countries || {}).filter(
                      ([_, country]) => country.deployedModelId === selectedModel.id
                    );

                    if (deployedCountries.length === 0) {
                      return (
                        <div className="text-center py-md border border-dashed border-white/10 rounded-lg">
                          <span className="material-symbols-outlined text-outline text-3xl">public_off</span>
                          <p className="text-xs text-outline mt-sm">This model is not currently deployed to any regions.</p>
                          <p className="text-[10px] text-outline mt-0.5">Use the dropdown below to deploy to a country.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-md max-h-[300px] overflow-y-auto custom-scrollbar pr-xs">
                        {deployedCountries.map(([code, country]) => (
                          <div key={code} className="flex flex-col gap-2 bg-[#12151c]/60 p-3 rounded-lg border border-white/5">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-semibold text-sm text-on-surface">{country.name}</span>
                                <div className="flex gap-md text-[10px] text-outline mt-0.5">
                                  <span>Share: <strong className="text-primary">{country.playerShare}%</strong></span>
                                  <span>Users: <strong>{country.playerUsers?.toLocaleString() || 0}</strong></span>
                                  <span>Latency: <strong className={country.latency > 100 ? "text-error animate-pulse" : "text-emerald-500"}>{country.latency}ms</strong></span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => deployModelToCountry(code, null)}
                                className="text-[10px] text-error hover:underline shrink-0 font-semibold"
                              >
                                Undeploy
                              </button>
                            </div>

                            {/* GPU Allocation Slider */}
                            {(() => {
                              const totalGpus = infrastructure.gpus + infrastructure.cloudGpusRented;
                              const activeTrainingGpus = llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
                              const allocatedToOthers = Object.entries(countries || {}).reduce((sum, [cid, c]) => {
                                if (cid === code) return sum;
                                return sum + (c.allocatedGpus || 0);
                              }, 0);
                              const maxAllocatable = totalGpus - activeTrainingGpus - allocatedToOthers;
                              const currentAllocated = country.allocatedGpus || 0;

                              return (
                                <div className="space-y-1 bg-[#0b0e15]/40 p-2 rounded border border-white/5">
                                  <div className="flex justify-between text-[9px] text-outline uppercase font-semibold">
                                    <span>Allocate GPUs</span>
                                    <span>Idle Pool Max: {maxAllocatable} GPUs</span>
                                  </div>
                                  <div className="flex items-center gap-sm">
                                    <input
                                      type="range"
                                      min="0"
                                      max={maxAllocatable}
                                      value={currentAllocated}
                                      onChange={(e) => allocateGpusToCountry(code, parseInt(e.target.value))}
                                      className="flex-1 accent-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="font-mono text-xs font-bold text-primary shrink-0 w-8 text-right">
                                      {currentAllocated}
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

                  {/* Select Country to Deploy */}
                  <div className="flex gap-sm items-center border-t border-white/5 pt-md">
                    <select
                      id="deploy-select"
                      className="bg-surface-dim border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:border-primary transition-all outline-none flex-1"
                      defaultValue=""
                      onChange={(e) => {
                        const code = e.target.value;
                        if (code) {
                          deployModelToCountry(code, selectedModel.id);
                          e.target.value = ""; // reset select
                        }
                      }}
                    >
                      <option value="">-- Deploy to New Country --</option>
                      {Object.entries(countries || {}).map(([code, country]) => {
                        if (!country.deployedModelId && country.openMarkets?.player) {
                          return (
                            <option key={code} value={code}>
                              {country.name} ({code})
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
              <div className="mt-md space-y-md border-t border-white/10 pt-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-label-md text-label-md text-primary uppercase font-bold tracking-widest">
                    {selectedModel.status === 'draft' ? 'Configure Training' : 'Configure Fine-Tuning'}
                  </h3>
                  <span className="text-xs text-outline">
                    Targeting: v{(selectedModel.status === 'draft' ? 1.0 : selectedModel.version + 1.0).toFixed(1)} Upgrade
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-dim/30 p-lg rounded-xl border border-white/5">
                  <div className="space-y-lg">
                    {/* GPU Allocation Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-label-sm text-label-sm text-on-surface">GPU Compute Allocation</label>
                        <span className="font-bold text-primary">{allocatedGpus} H100s</span>
                      </div>
                      <input
                        className="w-full accent-primary"
                        max={Math.max(16, idleGpus)}
                        min="8"
                        step="8"
                        type="range"
                        disabled={idleGpus < 8}
                        value={allocatedGpus}
                        onChange={(e) => setAllocatedGpus(parseInt(e.target.value))}
                      />
                      <div className="flex justify-between text-[10px] text-outline">
                        <span>Min (8)</span>
                        <span>Idle Pool Max ({idleGpus} GPUs)</span>
                      </div>
                      {idleGpus < 8 && (
                        <p className="text-[10px] text-error mt-1">Not enough idle GPUs. Free compute or rent from Cloud.</p>
                      )}
                    </div>

                    {/* Epochs count */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-label-sm text-label-sm text-on-surface" htmlFor="epochs-cnt">Training Epochs</label>
                        <span className="text-xs text-outline">Duration: {epochs * 8} ticks</span>
                      </div>
                      <input
                        id="epochs-cnt"
                        className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-body-md text-body-md text-on-surface text-center outline-none focus:border-primary transition-all"
                        max="10"
                        min="1"
                        type="number"
                        value={epochs}
                        onChange={(e) => setEpochs(parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Dataset Selector */}
                  <div className="space-y-sm flex flex-col">
                    <label className="font-label-sm text-label-sm text-on-surface">Select Dataset</label>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[160px]">
                      {Object.entries(datasets).map(([key, dataset]) => (
                        <div
                          key={key}
                          onClick={() => setDatasetType(key)}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-start ${
                            datasetType === key
                              ? 'bg-primary/5 border-primary'
                              : 'bg-surface-dim border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex-1">
                            <h4 className="font-label-sm text-label-sm text-on-surface font-bold">{dataset.name}</h4>
                            <p className="text-[10px] text-outline leading-snug mt-0.5">{dataset.desc}</p>
                            <span className="text-[9px] text-primary font-semibold block mt-1">{dataset.gainText}</span>
                          </div>
                          <span className="font-label-sm text-label-sm text-on-surface font-bold text-xs shrink-0 pl-md">
                            ${(dataset.cost / 1000).toFixed(0)}k
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estimate & Button */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-md border-t border-white/10 pt-md bg-surface-container/20 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-xs text-outline uppercase font-semibold">Total Estimated Cost</span>
                    <p className="font-headline-md text-headline-md text-on-surface text-xl font-bold">${calculateTrainingCost().toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleLaunchTraining(selectedModel.id)}
                    disabled={resources.cash < calculateTrainingCost() || idleGpus < 8}
                    className="w-full md:w-auto bg-secondary hover:bg-secondary-container text-white font-label-md text-label-md px-lg py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(78,222,163,0.3)] flex items-center justify-center gap-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                    START TRAINING
                  </button>
                </div>

                {/* Release Deploy panel if trained */}
                {selectedModel.status === 'trained' && (
                  <div className="mt-lg border-t border-white/10 pt-lg space-y-md">
                    <h3 className="font-label-md text-label-md text-primary uppercase font-bold tracking-widest">
                      Release Settings
                    </h3>
                    
                    <div className="bg-surface-dim/30 p-4 rounded-xl border border-white/5 space-y-md">
                      {/* Segment Selector */}
                      <div>
                        <label className="font-label-sm text-label-sm text-outline block mb-xs">Target Commercial Segment</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                          {[
                            { id: 'consumer', label: 'B2C App', icon: 'person', desc: 'Subscription' },
                            { id: 'dev', label: 'Developer', icon: 'code', desc: 'Token usage' },
                            { id: 'business', label: 'SaaS Seat', icon: 'business', desc: 'Per seat' },
                            { id: 'enterprise', label: 'Enterprise', icon: 'cloud', desc: 'Flat lease' },
                          ].map((seg) => (
                            <button
                              key={seg.id}
                              type="button"
                              onClick={() => handleSegmentChange(seg.id)}
                              className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center gap-xs ${
                                releaseSegment === seg.id
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-surface-dim border-white/5 hover:border-white/10 text-on-surface'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">{seg.icon}</span>
                              <span className="font-label-sm text-label-sm font-bold block">{seg.label}</span>
                              <span className="text-[9px] text-outline block">{seg.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Tag Input */}
                      <div>
                        <div className="flex justify-between items-center mb-xs">
                          <label className="font-label-sm text-label-sm text-outline">Starting Price</label>
                          <span className="font-label-md text-label-md text-primary font-bold">
                            ${releasePrice.toLocaleString()} {
                              releaseSegment === 'consumer' ? '/mo subscription' :
                              releaseSegment === 'dev' ? '/M tokens' :
                              releaseSegment === 'business' ? '/seat/mo' :
                              '/mo contract'
                            }
                          </span>
                        </div>
                        <input
                          type="range"
                          min={releaseSegment === 'enterprise' ? 1000 : 1}
                          max={releaseSegment === 'enterprise' ? 20000 : releaseSegment === 'business' ? 200 : releaseSegment === 'consumer' ? 100 : 50}
                          step={releaseSegment === 'enterprise' ? 500 : 1}
                          value={releasePrice}
                          onChange={(e) => setReleasePrice(parseInt(e.target.value))}
                          className="w-full accent-primary"
                        />
                        <p className="text-[10px] text-outline mt-1">
                          {releaseSegment === 'consumer' && 'Consumer target base price is $15/mo. Multilingual & Knowledge benchmarks.'}
                          {releaseSegment === 'dev' && 'Developer target API base price is $5/M tokens. Coding & Reasoning benchmarks.'}
                          {releaseSegment === 'business' && 'Business SaaS target base price is $25/seat/mo. Agentic & Coding benchmarks.'}
                          {releaseSegment === 'enterprise' && 'Enterprise dedicated cluster base lease contract is $5,000/mo. Math & Reasoning benchmarks.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => releaseLLM(selectedModel.id, releaseSegment, releasePrice)}
                      className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(173,198,255,0.2)] flex items-center justify-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[20px]">publish</span>
                      RELEASE TO MARKET
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-lg rounded-xl flex items-center justify-center text-center h-full text-outline italic">
            Select a model from the registry or create a new design.
          </div>
        )}
      </div>
    </div>
  );
}