import { useState } from 'react';
import { useGameStore } from '../store';

export default function TrainingCompletionPopup({ model }) {
  const { finalizeModelTraining } = useGameStore();

  const [versionInput, setVersionInput] = useState(() => {
    if (model && model.trainingCompletion) {
      const verStr = model.version || '1.0';
      const num = parseFloat(verStr);
      const isDraftFirstRun = verStr === '1.0' && model.trainingCompletion.oldStats.knowledge === 15;
      if (isDraftFirstRun) return '1.0';
      const nextNum = isNaN(num) ? 2.0 : num + 1.0;
      return nextNum.toFixed(1);
    }
    return '';
  });

  if (!model || model.status !== 'trained_pending' || !model.trainingCompletion) return null;

  const { oldStats, newStats } = model.trainingCompletion;

  const statsList = [
    { key: 'agentic', label: 'Agentic Capability' },
    { key: 'coding', label: 'Coding Proficiency' },
    { key: 'reasoning', label: 'Reasoning (ARC-AGI)' },
    { key: 'knowledge', label: 'General Knowledge' },
    { key: 'math', label: 'Mathematics' },
    { key: 'multilingual', label: 'Multilingual' },
    { key: 'multimodal', label: 'Multimodal Understanding' }
  ];

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!versionInput.trim()) return;
    finalizeModelTraining(model.id, versionInput.trim());
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-[200] p-6 animate-fade-in">
      <div
        className="glass-panel w-full max-w-[550px] rounded-xl flex flex-col overflow-hidden shadow-2xl relative border border-white/10 p-lg gap-lg bg-[#0a0d14]/95 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/10 pb-md text-center">
          <span className="text-[10px] px-2.5 py-1 bg-secondary/20 border border-secondary/40 rounded-full font-mono text-secondary font-bold uppercase tracking-widest animate-pulse inline-flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-[10px]">rocket_launch</span>
            Training Weights Aligned
          </span>
          <h3 className="font-display-lg text-xl font-bold text-on-surface">
            Training Run Complete: <span className="text-secondary">{model.name}</span>
          </h3>
          <p className="text-outline text-xs mt-1 leading-relaxed">
            Your datacenter cluster has successfully finished aligning weights. Review the benchmark gains and assign a version label.
          </p>
        </div>

        {/* Stats Progression List */}
        <div className="bg-[#0b0e15]/60 border border-white/5 rounded-xl p-md space-y-sm max-h-[280px] overflow-y-auto custom-scrollbar">
          <span className="text-[10px] text-outline font-mono uppercase tracking-wider block font-bold border-b border-white/5 pb-1">
            Stat Progression Results
          </span>

          <div className="space-y-md pt-xs">
            {statsList.map((stat) => {
              const oldVal = oldStats[stat.key] || 0;
              const newVal = newStats[stat.key] || 0;
              const diff = newVal - oldVal;

              return (
                <div key={stat.key} className="flex justify-between items-center text-xs">
                  <span className="text-outline font-semibold">{stat.label}</span>
                  <div className="flex items-center gap-md font-mono">
                    <span className="text-outline-variant">{oldVal}%</span>
                    <span className="text-outline">&rarr;</span>
                    <span className="text-on-surface font-bold">{newVal}%</span>
                    {diff > 0 ? (
                      <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                        +{diff}%
                      </span>
                    ) : (
                      <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-white/5 text-outline">
                        +0%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Action */}
        <form onSubmit={handleConfirm} className="space-y-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-outline font-semibold" htmlFor="version-input">
              Enter Version Label
            </label>
            <input
              id="version-input"
              type="text"
              required
              value={versionInput}
              onChange={(e) => setVersionInput(e.target.value)}
              className="bg-[#0b0e15]/60 border border-white/10 rounded-lg p-sm font-body-md text-body-md text-on-surface text-center focus:border-secondary transition-all outline-none font-bold"
              placeholder="e.g. 1.5 Pro, 1.5 Flash, 2.0 Preview"
            />
            <span className="text-[10px] text-outline text-center mt-1 leading-snug">
              Examples: <strong className="text-outline-variant">1.5 Pro</strong>, <strong className="text-outline-variant">1.5 Flash</strong>, <strong className="text-outline-variant">2.0 Preview</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={!versionInput.trim()}
            className="w-full bg-secondary hover:bg-[#10b981] text-white font-mono text-[10.5px] uppercase font-bold tracking-wider py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Finalize Version & Resume Ticking
          </button>
        </form>
      </div>
    </div>
  );
}
