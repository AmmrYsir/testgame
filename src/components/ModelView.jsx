import { useState } from 'react';
import { useGameStore } from '../store';

export default function ModelView() {
  const { llms, research, infrastructure, resources, createModel, startTraining, releaseLLM } = useGameStore();
  
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Model Form State
  const [newName, setNewName] = useState('Aether');
  const [newArch, setNewArch] = useState('transformer');

  // Training Config State
  const [allocatedGpus, setAllocatedGpus] = useState(64);
  const [epochs, setEpochs] = useState(3);
  const [datasetType, setDatasetType] = useState('web_dump');

  // Selected Model Object
  const selectedModel = llms.find(m => m.id === selectedModelId) || llms[0];

  // Calculate available GPUs
  const totalGpus = infrastructure.gpus + infrastructure.cloudGpusRented;
  const activeTrainingGpus = llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
  const idleGpus = totalGpus - activeTrainingGpus;

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
    web_dump: { name: 'Common Crawl Scraping', cost: 15000, desc: 'Scrape raw public web data. Low cost, but increases hallucination rate.', gainText: '+5% Knowledge, +5% Creativity, +5% Hallucination' },
    textbooks: { name: 'Premium Textbook Corpus', cost: 80000, desc: 'Licenced educational text. Good balance, reduces hallucination.', gainText: '+12% Knowledge, +8% Coding/Math, -6% Hallucination' },
    synthetic: { name: 'Synthetic Reasoning Data', cost: 200000, desc: 'AI-generated math/logic proofs. Heavy math and coding boost.', gainText: '+20% Coding & Math, +10% Knowledge, -5% Hallucination' },
    rlhf_align: { name: 'RLHF Expert Alignment', cost: 350000, desc: 'Human feedback refinement. Massive overall quality and safety lift.', gainText: '+15% Knowledge & Coding, -12% Hallucination' }
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
                        <span>{Math.round((model.training.progress / model.training.totalTicks) * 100)}%</span>
                      </div>
                      <div className="w-full bg-surface-dim rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(78,222,163,0.5)]"
                          style={{ width: `${(model.training.progress / model.training.totalTicks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Miniature Stat Bars */}
                  {!isTraining && (
                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-outline uppercase font-semibold">KNOW</span>
                        <span className="font-label-sm text-label-sm text-on-surface">{model.stats.knowledge}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-outline uppercase font-semibold">CODE</span>
                        <span className="font-label-sm text-label-sm text-on-surface">{model.stats.coding}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-outline uppercase font-semibold">MATH</span>
                        <span className="font-label-sm text-label-sm text-on-surface">{model.stats.math}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-error/80 uppercase font-semibold">HAL</span>
                        <span className="font-label-sm text-label-sm text-error">{model.stats.hallucination}%</span>
                      </div>
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
              <h2 className="font-headline-md text-headline-md text-on-surface">Initialize Model Architecture</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Design the baseline network configuration for your next neural project.
              </p>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="m-name">Model Designation Name</label>
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
                Create Model Profile
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
                    API Active ({selectedModel.releaseType === 'b2b' ? 'B2B Enterprise' : 'B2C App'})
                  </span>
                  {selectedModel.revenuePerTick > 0 && (
                    <span className="text-xs text-outline mt-1 font-semibold">+${selectedModel.revenuePerTick}/tick yield</span>
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
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Evaluation Benchmarks</span>
                
                {/* Knowledge */}
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface mb-1">
                    <span>General Knowledge (MMLU)</span>
                    <span className="font-bold">{selectedModel.stats.knowledge}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${selectedModel.stats.knowledge}%` }}></div>
                  </div>
                </div>

                {/* Coding */}
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface mb-1">
                    <span>Coding Proficiency (HumanEval)</span>
                    <span className="font-bold">{selectedModel.stats.coding}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${selectedModel.stats.coding}%` }}></div>
                  </div>
                </div>

                {/* Math */}
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface mb-1">
                    <span>Math & Reasoning (GSM8K)</span>
                    <span className="font-bold">{selectedModel.stats.math}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${selectedModel.stats.math}%` }}></div>
                  </div>
                </div>

                {/* Creativity */}
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface mb-1">
                    <span>Creativity & Roleplay</span>
                    <span className="font-bold">{selectedModel.stats.creativity}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${selectedModel.stats.creativity}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Safety metrics */}
              <div className="bg-surface-dim/40 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center text-center gap-sm">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Alignment Safety Report</span>
                <div className="w-24 h-24 rounded-full border-4 border-error/25 flex flex-col justify-center items-center relative mt-2">
                  {/* Circle background indicator */}
                  <div className="absolute inset-0 rounded-full border-4 border-error" style={{ clipPath: `polygon(50% 50%, -50% -50%, ${selectedModel.stats.hallucination}% -50%)`, transform: 'rotate(-90deg)' }}></div>
                  <span className="font-headline-lg text-headline-lg text-error text-2xl font-bold">{selectedModel.stats.hallucination}%</span>
                  <span className="text-[9px] text-outline uppercase mt-0.5">Hallucinations</span>
                </div>
                <p className="font-body-md text-body-md text-outline text-xs mt-2 max-w-[200px]">
                  {selectedModel.stats.hallucination > 20
                    ? 'Caution: Model exhibits high hallucination rates. Safety training advised.'
                    : 'Stable: Model outputs align within safe corporate compliance bounds.'}
                </p>
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
                    <span>Weight Optimization (Day {selectedModel.training.progress}/{selectedModel.training.totalTicks})</span>
                    <span className="text-secondary font-bold">{Math.round((selectedModel.training.progress / selectedModel.training.totalTicks) * 100)}%</span>
                  </div>
                  <div className="w-full bg-surface-dim rounded-full h-3 overflow-hidden border border-white/10 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-secondary-container to-secondary h-full rounded-full transition-all duration-300"
                      style={{ width: `${(selectedModel.training.progress / selectedModel.training.totalTicks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              /* TRAINING CONFIGURATOR (FOR DRAFT, TRAINED, OR RELEASED MODELS) */
              <div className="mt-md space-y-md border-t border-white/10 pt-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-label-md text-label-md text-primary uppercase font-bold tracking-widest">
                    {selectedModel.status === 'draft' ? 'Schedule Core Training Run' : 'Schedule Training Upgrade (Fine-Tune)'}
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
                    <label className="font-label-sm text-label-sm text-on-surface">Data Feeding Profile</label>
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
                    <span className="text-xs text-outline uppercase font-semibold">Total Estimated Capital Cost</span>
                    <p className="font-headline-md text-headline-md text-on-surface text-xl font-bold">${calculateTrainingCost().toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleLaunchTraining(selectedModel.id)}
                    disabled={resources.cash < calculateTrainingCost() || idleGpus < 8}
                    className="w-full md:w-auto bg-secondary hover:bg-secondary-container text-white font-label-md text-label-md px-lg py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(78,222,163,0.3)] flex items-center justify-center gap-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                    INITIALIZE NEURAL RUN
                  </button>
                </div>

                {/* Release Deploy block if trained */}
                {selectedModel.status === 'trained' && (
                  <div className="mt-md bg-primary/5 border border-primary/20 rounded-xl p-md flex flex-col md:flex-row justify-between items-center gap-md">
                    <div>
                      <h4 className="font-label-md text-label-md text-primary uppercase font-bold">Release to Commercial Market</h4>
                      <p className="text-xs text-outline mt-0.5">Publish weights to the market to trigger global revenues.</p>
                    </div>
                    <div className="flex gap-sm w-full md:w-auto">
                      <button
                        onClick={() => releaseLLM(selectedModel.id, 'b2b')}
                        className="flex-1 bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-sm text-label-sm px-md py-sm rounded-lg transition-all"
                      >
                        B2B Enterprise API
                      </button>
                      <button
                        onClick={() => releaseLLM(selectedModel.id, 'b2c')}
                        className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm px-md py-sm rounded-lg transition-all shadow-md"
                      >
                        B2C Chatapp
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-lg rounded-xl flex items-center justify-center text-center h-full text-outline italic">
            Select a model profile from the registry or create a new design backbone.
          </div>
        )}
      </div>
    </div>
  );
}