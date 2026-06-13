import { useState } from 'react';
import { useGameStore } from '../store';

export default function LLMManagerView() {
  const { llms, activeTraining, startTraining, resources } = useGameStore();
  const [name, setName] = useState('Aether-1');
  const [gpus, setGpus] = useState(512);
  const [epochs, setEpochs] = useState(3);

  const handleTrain = () => {
    startTraining(name, 'v1.0', epochs * 10, {
      knowledge: 40 + Math.floor(epochs * 2),
      coding: 20 + Math.floor(gpus / 100),
      math: 10 + epochs,
      creativity: 50,
      hallucination: Math.max(5, 15 - epochs)
    });
  };

  if (activeTraining) {
    return (
      <div className="flex flex-col gap-6 h-full max-w-container-max mx-auto w-full pt-12 pb-24">
        <div className="mb-sm flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Training Run Active</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Generating neural weights for {activeTraining.name}</p>
          </div>
        </div>
        <div className="glass-panel w-full rounded-xl flex items-center p-6 gap-8 shadow-xl">
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary animate-pulse text-sm">model_training</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Model: {activeTraining.name} {activeTraining.version}</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">{(activeTraining.progress / activeTraining.totalTicks * 100).toFixed(0)}% Complete</span>
            </div>
            <div className="w-full bg-surface-dim rounded-full h-2 overflow-hidden shadow-inner border border-white/5">
              <div className="bg-gradient-to-r from-secondary-container to-secondary h-full rounded-full shadow-[0_0_10px_rgba(78,222,163,0.5)] transition-all" style={{ width: `${(activeTraining.progress / activeTraining.totalTicks) * 100}%` }}></div>
            </div>
            <div className="flex justify-between font-label-sm text-label-sm text-outline-variant">
              <span>Tick {activeTraining.progress}/{activeTraining.totalTicks}</span>
              <span>Training...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-12 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Model Configuration</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Define parameters and allocate resources for new intelligence generation.</p>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">Entity Definition</h3>
          <div className="space-y-lg">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="model-name">Designation (Model Name)</label>
              <input 
                id="model-name" 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface outline-none focus:border-primary transition-all" 
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-sm">Neural Architecture</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                <label className="cursor-pointer relative">
                  <input defaultChecked className="peer sr-only" name="architecture" type="radio" value="transformer"/>
                  <div className="p-md rounded-lg border border-outline-variant bg-surface-container peer-checked:border-primary peer-checked:bg-primary/10 transition-all text-center">
                    <span className="material-symbols-outlined block mb-xs text-on-surface-variant peer-checked:text-primary">schema</span>
                    <span className="font-label-md text-label-md block text-on-surface">Transformer</span>
                  </div>
                </label>
                <label className="cursor-pointer relative">
                  <input className="peer sr-only" name="architecture" type="radio" value="moe"/>
                  <div className="p-md rounded-lg border border-outline-variant bg-surface-container peer-checked:border-primary peer-checked:bg-primary/10 transition-all text-center">
                    <span className="material-symbols-outlined block mb-xs text-on-surface-variant peer-checked:text-primary">account_tree</span>
                    <span className="font-label-md text-label-md block text-on-surface">Mixture of Experts</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel p-lg rounded-xl flex-1">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">Resource Allocation</h3>
          <div className="space-y-xl mt-md">
            <div>
              <div className="flex justify-between items-end mb-sm">
                <label className="font-label-md text-label-md text-on-surface">Compute Cluster Allocation</label>
                <span className="font-headline-lg text-headline-lg text-primary leading-none">{gpus}<span className="text-label-sm text-outline ml-xs">H100s</span></span>
              </div>
              <input 
                className="w-full" 
                max="2048" min="64" step="64" type="range" 
                value={gpus} 
                onChange={e => setGpus(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-label-sm text-outline mt-xs">
                <span>Low Priority (64)</span>
                <span>Max Capacity (2048)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-md">
              <label className="font-label-md text-label-md text-on-surface w-32" htmlFor="epochs">Training Epochs</label>
              <input 
                id="epochs" 
                className="w-24 bg-surface-container-highest border border-outline-variant rounded px-sm py-xs font-body-md text-body-md text-center text-on-surface" 
                max="10" min="1" type="number" 
                value={epochs}
                onChange={e => setEpochs(parseInt(e.target.value))}
              />
              <span className="font-body-md text-body-md text-on-surface-variant text-sm">Est. Duration: {epochs * 10} ticks</span>
            </div>
          </div>
        </section>
      </div>

      <div className="col-span-1 lg:col-span-5 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent pointer-events-none"></div>
          <h3 className="relative z-10 font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">Projected Performance Matrix</h3>
          <div className="relative z-10 space-y-md mt-md">
            <div>
              <div className="flex justify-between mb-xs">
                <span className="font-label-md text-label-md text-on-surface">General Knowledge</span>
                <span className="font-label-md text-label-md text-primary">{40 + Math.floor(epochs * 2)}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{width: `${40 + Math.floor(epochs * 2)}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-xs">
                <span className="font-label-md text-label-md text-on-surface">Coding Proficiency</span>
                <span className="font-label-md text-label-md text-primary">{20 + Math.floor(gpus / 100)}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{width: `${20 + Math.floor(gpus / 100)}%`}}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel p-lg rounded-xl mt-auto">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">Run Estimates</h3>
          <div className="flex justify-between items-end mb-md">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Compute Cost</p>
              <p className="font-headline-md text-headline-md text-on-surface">${(gpus * epochs * 100).toLocaleString()}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="col-span-1 lg:col-span-12 mt-md">
        <button 
          onClick={handleTrain}
          disabled={activeTraining !== null}
          className="w-full bg-inverse-primary hover:bg-primary-container text-white hover:text-on-primary-container font-headline-md text-headline-md py-md rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,90,194,0.3)] hover:shadow-[0_0_30px_rgba(77,142,255,0.5)] flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
          INITIALIZE TRAINING RUN
        </button>
      </div>
    </div>
  );
}
