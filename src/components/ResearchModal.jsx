import { useState } from 'react';
import { useGameStore, TECH_PREREQS } from '../store';

export default function ResearchModal({ isOpen, onClose }) {
  const { research, startResearch, resources } = useGameStore();
  const [selectedTechId, setSelectedTechId] = useState('moe');

  if (!isOpen) return null;

  const technologies = [
    // Architectures
    { 
      id: 'transformer', 
      category: 'Architecture',
      name: 'Transformer Architecture', 
      desc: 'The attention-based seq-to-seq transducer that replaces sequential recurrent networks.', 
      realWorld: 'Introduced by Google researchers in 2017 ("Attention Is All You Need"). By processing whole sequences in parallel, it became the foundation for BERT, GPT, and all modern generative AI models.',
      effect: 'Base architecture. Compiles model backbones.',
      cost: 0, 
      ticks: 1,
      icon: 'schema'
    },
    { 
      id: 'moe', 
      category: 'Architecture',
      name: 'Mixture of Experts (MoE)', 
      desc: 'Sparsely activates a dynamic subset of expert neural routes per incoming token.', 
      realWorld: 'Made famous by GPT-4 and Mixtral. Allows models to grow parameter capacity without scaling compute cost per token linearly, making training and inference highly cost-effective.',
      effect: 'Enables Mixture of Experts architecture. Boosts training speed by +25%.',
      cost: 500000, 
      ticks: 100,
      icon: 'account_tree'
    },
    { 
      id: 'ssm', 
      category: 'Architecture',
      name: 'State Space Models (SSM)', 
      desc: 'Linear-time sequence model offering alternative scaling dynamics to attention layers.', 
      realWorld: 'Based on Mamba architecture. Solves the quadratic memory bottlenecks of standard transformer attention mechanisms, enabling extremely long-context sequence modeling.',
      effect: 'Enables SSM architecture. Boosts training speed by +40%.',
      cost: 1500000, 
      ticks: 180,
      icon: 'linear_scale'
    },
    { 
      id: 'liquid_nn', 
      category: 'Architecture',
      name: 'Liquid Neural Networks', 
      desc: 'Differential equation networks adapting parameters dynamically during execution.', 
      realWorld: 'Pioneered by MIT CSAIL researchers. Mimics biological brain synapses, adapting parameters at inference time. Offers unprecedented adaptability and compute efficiency.',
      effect: 'Enables Liquid NN architecture. Boosts training speed by +60%.',
      cost: 3000000, 
      ticks: 240,
      icon: 'waves'
    },

    // Data Engineering
    { 
      id: 'web_crawling', 
      category: 'Data Engineering',
      name: 'Web Scraping Pipelines', 
      desc: 'Massive web scrapers capturing public web documents and filtering noise.', 
      realWorld: 'Web scraping datasets like Common Crawl form the foundation of model pre-training, giving models broad facts and common language structure.',
      effect: 'Enables the Common Crawl baseline pre-training dataset.',
      cost: 0, 
      ticks: 1,
      icon: 'cloud_download'
    },
    { 
      id: 'textbook_acquisition', 
      category: 'Data Engineering',
      name: 'Textbook Acquisition', 
      desc: 'Licensing educational curricula, math proofs, textbooks, and scientific papers.', 
      realWorld: 'Pioneered by Microsoft\'s "Phi" series. Acquiring high-density textbook data provides clean educational text, drastically improving logical reasoning and baseline knowledge.',
      effect: 'Unlocks the "Premium Textbook Corpus" training dataset.',
      cost: 300000, 
      ticks: 60,
      icon: 'menu_book'
    },
    { 
      id: 'synthetic_data', 
      category: 'Data Engineering',
      name: 'Synthetic Data Generation', 
      desc: 'Using frontier teacher models to generate code, reasoning paths, and math step-by-steps.', 
      realWorld: 'Enables companies to continue scaling when public text is exhausted. Filters out hallucinations to feed models with structured, high-quality logic proofs.',
      effect: 'Unlocks the "Synthetic Reasoning Data" training dataset.',
      cost: 800000, 
      ticks: 100,
      icon: 'smart_toy'
    },
    { 
      id: 'multimodal_tokenizers', 
      category: 'Data Engineering',
      name: 'Multimodal Tokenizers', 
      desc: 'Spatially slicing image patches and video frames into sequence tokens.', 
      realWorld: 'Enables native multimodal understanding. Rather than using external image captions, models ingest image pixels directly alongside text token streams.',
      effect: 'Boosts the multimodal training score gains by +5%.',
      cost: 1200000, 
      ticks: 140,
      icon: 'image'
    },

    // Alignment
    { 
      id: 'instruction_sft', 
      category: 'Alignment',
      name: 'Instruction SFT', 
      desc: 'Supervised fine-tuning on high-quality human prompt-response instruction datasets.', 
      realWorld: 'Converts base next-token predictors into helpful conversational assistants (e.g. base LLaMA to LLaMA-Chat).',
      effect: 'Base SFT dataset alignment.',
      cost: 0, 
      ticks: 1,
      icon: 'chat'
    },
    { 
      id: 'rlhf', 
      category: 'Alignment',
      name: 'RLHF Preference Alignment', 
      desc: 'Training a reward model on human preferences to guide policy optimizations.', 
      realWorld: 'Reinforcement Learning from Human Feedback. Popularized by OpenAI\'s InstructGPT. Ensures models are helpful, honest, and harmless.',
      effect: 'Unlocks the "RLHF Expert Alignment" training dataset.',
      cost: 600000, 
      ticks: 100,
      icon: 'thumbs_up_down'
    },
    { 
      id: 'dpo', 
      category: 'Alignment',
      name: 'Direct Preference Optimization (DPO)', 
      desc: 'Direct optimization on preference datasets, bypassing the separate reward model.', 
      realWorld: 'Discovered by Stanford. Mathematically eliminates PPO reinforcement loops. Directly fits policy parameters to preference pairs, reducing training time.',
      effect: 'Speeds up SFT and RLHF alignment runs, boosting all training gains by +15%.',
      cost: 1000000, 
      ticks: 120,
      icon: 'tune'
    },
    { 
      id: 'constitutional_ai', 
      category: 'Alignment',
      name: 'Constitutional AI (RLAIF)', 
      desc: 'AI-guided alignment critiques based on a set of constitutional rules.', 
      realWorld: 'Pioneered by Anthropic. Models refine themselves by reviewing draft responses against a list of principles, replacing massive human evaluation teams.',
      effect: 'Provides +5% Reasoning and +5% Agentic scores on all training runs.',
      cost: 1800000, 
      ticks: 150,
      icon: 'gavel'
    },

    // Inference & Efficiency
    { 
      id: 'fp8_quantization', 
      category: 'Inference & Efficiency',
      name: 'FP8 Model Quantization', 
      desc: 'Downscaling network weights to 8-bit precision floating point format.', 
      realWorld: 'Standardizes models to run on cheaper GPUs by dramatically lowering memory bandwidth footprints. Retains 99% of original FP16 accuracy.',
      effect: 'Reduces physical GPU requirements for country model routing by 20%.',
      cost: 400000, 
      ticks: 80,
      icon: 'compress'
    },
    { 
      id: 'speculative_decoding', 
      category: 'Inference & Efficiency',
      name: 'Speculative Decoding', 
      desc: 'Draft model pre-evaluates sequence options to verify in parallel.', 
      realWorld: 'Enables faster generation under concurrent loads. A small draft model drafts tokens fast, which are evaluated by the large model in a single forward pass.',
      effect: 'Optimizes model latency response times under high regional query volumes.',
      cost: 800000, 
      ticks: 110,
      icon: 'speed'
    },
    { 
      id: 'flash_attention', 
      category: 'Inference & Efficiency',
      name: 'FlashAttention Kernels', 
      desc: 'Optimized attention memory access patterns reading direct GPU SRAM.', 
      realWorld: 'Created by Tri Dao. Restructures self-attention computations to avoid reading/writing intermediate matrices to slow HBM memory, removing hardware bottlenecks.',
      effect: 'Reduces physical GPU requirements for country model routing by a cumulative 40%.',
      cost: 1200000, 
      ticks: 140,
      icon: 'bolt'
    }
  ];

  const handleFundResearch = (tech) => {
    if (research.activeResearch) return;
    if (resources.cash < tech.cost) return;
    startResearch(tech.id, tech.cost, tech.ticks);
  };

  const activeTech = research.activeResearch;
  const selectedTech = technologies.find(t => t.id === selectedTechId);

  // Group technologies into tracks
  const tracks = [
    { name: 'Model Architectures', items: technologies.filter(t => t.category === 'Architecture') },
    { name: 'Data Engineering', items: technologies.filter(t => t.category === 'Data Engineering') },
    { name: 'Alignment', items: technologies.filter(t => t.category === 'Alignment') },
    { name: 'Inference & Efficiency', items: technologies.filter(t => t.category === 'Inference & Efficiency') }
  ];

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
              <span className="material-symbols-outlined text-primary text-xl">science</span>
              Research & Development Center
            </h3>
            <span className="font-mono text-[9.5px] text-outline uppercase tracking-wider mt-0.5">
              Unlock architectural paradigms, training data pipelines, and hardware efficiency kernels
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Tech Tree (65% width) */}
          <div className="w-[65%] border-r border-white/10 flex flex-col h-full bg-surface-dim/20 p-md overflow-hidden">
            {/* Active Research Banner */}
            {activeTech && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-md flex justify-between items-center gap-md">
                <div>
                  <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Active Research Stream</span>
                  <h4 className="text-xs font-bold text-on-surface mt-0.5">
                    Analyzing: {technologies.find(t => t.id === activeTech.techId)?.name}
                  </h4>
                </div>
                <div className="flex-1 max-w-[200px]">
                  <div className="flex justify-between text-[9px] text-outline font-semibold mb-0.5">
                    <span>-${activeTech.fundingPerTick.toLocaleString()}/tick</span>
                    <span>{Math.round((activeTech.progress / activeTech.totalTicks) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#0b0e15] rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${(activeTech.progress / activeTech.totalTicks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tree Tracks columns */}
            <div className="flex-1 grid grid-cols-4 gap-sm overflow-y-auto pr-xs custom-scrollbar">
              {tracks.map((track) => (
                <div key={track.name} className="flex flex-col gap-sm">
                  <h4 className="text-[9px] text-outline font-mono uppercase font-bold tracking-widest border-b border-white/5 pb-1 text-center truncate" title={track.name}>
                    {track.name}
                  </h4>

                  <div className="flex flex-col gap-sm items-center">
                    {track.items.map((tech, idx) => {
                      const isUnlocked = research.unlockedTech.includes(tech.id);
                      const isActive = activeTech?.techId === tech.id;
                      const prereqId = TECH_PREREQS[tech.id];
                      const isLocked = prereqId && !research.unlockedTech.includes(prereqId);
                      const isSelected = selectedTechId === tech.id;

                      return (
                        <div key={tech.id} className="w-full flex flex-col items-center">
                          {idx > 0 && (
                            <span className="material-symbols-outlined text-[15px] text-white/15 my-0.5">
                              arrow_downward
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedTechId(tech.id)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                              isUnlocked 
                                ? 'bg-primary/10 border-primary/30 hover:border-primary/50' 
                                : isActive
                                ? 'bg-secondary/15 border-secondary animate-pulse'
                                : isLocked
                                ? 'bg-[#0c0f16]/30 border-white/5 opacity-40 hover:opacity-60'
                                : isSelected
                                ? 'bg-primary/5 border-primary/60 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                                : 'bg-[#0b0e15]/40 border-white/5 hover:border-white/15 hover:bg-[#0b0e15]/60'
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className={`material-symbols-outlined text-sm ${isUnlocked ? 'text-primary' : isActive ? 'text-secondary' : 'text-outline'}`}>
                                {tech.icon}
                              </span>
                              {isUnlocked ? (
                                <span className="material-symbols-outlined text-xs text-primary font-bold">check_circle</span>
                              ) : isActive ? (
                                <span className="text-[8px] text-secondary font-mono font-bold animate-pulse">ACTIVE</span>
                              ) : isLocked ? (
                                <span className="material-symbols-outlined text-[10px] text-outline">lock</span>
                              ) : (
                                <span className="text-[8.5px] text-outline font-mono font-bold">
                                  {tech.cost === 0 ? 'FREE' : `$${(tech.cost / 1000).toFixed(0)}k`}
                                </span>
                              )}
                            </div>

                            <h5 className="font-bold text-[10.5px] text-on-surface truncate mt-0.5">
                              {tech.name}
                            </h5>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Selected Details (35% width) */}
          <div className="w-[35%] flex flex-col h-full bg-[#0b0e15]/40 p-lg justify-between text-left">
            {selectedTech ? (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-xs custom-scrollbar">
                <div className="space-y-md">
                  {/* Category and Title */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-primary uppercase font-mono font-bold tracking-widest block">
                      {selectedTech.category} Path
                    </span>
                    <h3 className="text-md font-bold text-on-surface font-headline-sm">
                      {selectedTech.name}
                    </h3>
                  </div>

                  {/* Summary */}
                  <div className="bg-[#0b0e15] p-3 rounded-lg border border-white/5 text-xs text-outline leading-normal">
                    {selectedTech.desc}
                  </div>

                  {/* Real World Context */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-outline uppercase font-mono font-bold tracking-widest block">
                      Real-world Background
                    </span>
                    <p className="text-[11px] text-outline/80 leading-relaxed italic">
                      "{selectedTech.realWorld}"
                    </p>
                  </div>

                  {/* Game Effect */}
                  <div className="space-y-1 bg-primary/5 border border-primary/15 p-3 rounded-lg">
                    <span className="text-[9px] text-primary uppercase font-mono font-bold tracking-widest block">
                      Gameplay Impact
                    </span>
                    <p className="text-[11px] text-on-surface font-medium leading-normal mt-0.5">
                      {selectedTech.effect}
                    </p>
                  </div>

                  {/* Prerequisite requirements if locked */}
                  {(() => {
                    const reqId = TECH_PREREQS[selectedTech.id];
                    if (reqId) {
                      const reqTech = technologies.find(t => t.id === reqId);
                      const hasReq = research.unlockedTech.includes(reqId);
                      return (
                        <div className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 font-mono ${hasReq ? 'bg-primary/5 border-primary/10 text-primary/75' : 'bg-error/5 border-error/10 text-error/75'}`}>
                          <span className="material-symbols-outlined text-sm">{hasReq ? 'check' : 'lock'}</span>
                          <span>Prereq: {reqTech?.name} ({hasReq ? 'Unlocked' : 'Locked'})</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Bottom Funding Buttons */}
                <div className="border-t border-white/10 pt-md mt-lg">
                  {research.unlockedTech.includes(selectedTech.id) ? (
                    <div className="w-full py-3 bg-primary/10 border border-primary/20 rounded-xl text-center font-mono text-xs text-primary font-bold">
                      Technology Fully Unlocked
                    </div>
                  ) : activeTech?.techId === selectedTech.id ? (
                    <div className="w-full py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-center font-mono text-xs text-secondary font-bold animate-pulse">
                      Labs Actively Researching ({activeTech.progress}/{activeTech.totalTicks} days)
                    </div>
                  ) : (() => {
                    const reqId = TECH_PREREQS[selectedTech.id];
                    const hasPrereq = !reqId || research.unlockedTech.includes(reqId);
                    const canAfford = resources.cash >= selectedTech.cost;

                    let disableReason = '';
                    if (!hasPrereq) disableReason = 'Prerequisites locked';
                    else if (!canAfford) disableReason = 'Insufficient capital reserves';
                    else if (activeTech) disableReason = 'Labs occupied with active research';

                    return (
                      <div className="space-y-sm">
                        {disableReason && (
                          <p className="text-[10px] text-outline text-center font-mono italic">
                            Cannot Fund: {disableReason}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFundResearch(selectedTech)}
                          disabled={!hasPrereq || !canAfford || activeTech !== null}
                          className="w-full bg-primary hover:bg-primary-container text-on-primary font-mono text-xs uppercase font-bold py-3 px-md rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                          <span className="material-symbols-outlined text-sm">science</span>
                          Fund Research (${selectedTech.cost.toLocaleString()})
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full text-outline italic gap-sm">
                <span className="material-symbols-outlined text-4xl animate-pulse">science</span>
                Select a technology node to inspect details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
