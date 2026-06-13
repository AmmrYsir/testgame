import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Game Flow State
  gameStage: 'menu', // 'menu', 'newGameSetup', 'playing'
  simulationSpeed: 1, // 0 = paused, 1 = normal, 2 = fast, 3 = very fast
  isPaused: false, // For hotkeys

  // Player Info
  company: {
    name: '',
    founder: '',
    color: '#3b82f6', // Default sapphire
    logo: 'hexagon',
  },

  // Core Resources
  resources: {
    cash: 1000000, // $1M starting capital
    compute: 50, // Base compute power (TFLOPS or similar)
    hype: 0,
    currentTick: 0,
  },

  // Infrastructure
  infrastructure: {
    gpus: 10, // Count
    serverHeat: 20, // 0-100%
  },

  // LLM Manager
  llms: [], // { id, name, version, stats: { knowledge, coding, math, creativity, hallucination }, isReleased: false }
  
  // Training State
  activeTraining: null, // { llmName, version, targetStats, progress, totalTicks }

  // Research & Tech
  research: {
    points: 0,
    unlockedTech: ['transformer'],
  },

  // News Feed
  newsFeed: [
    { tick: 1, type: 'trending_up', text: 'New startup founded.', iconColor: 'text-primary' }
  ],

  // Actions
  setGameStage: (stage) => set({ gameStage: stage }),
  
  setCompanyDetails: (details) => set((state) => ({
    company: { ...state.company, ...details }
  })),

  setSimulationSpeed: (speed) => set((state) => ({ 
    simulationSpeed: speed,
    isPaused: speed === 0 
  })),

  togglePause: () => set((state) => {
    if (state.simulationSpeed > 0) {
      return { isPaused: true, simulationSpeed: 0 };
    } else {
      return { isPaused: false, simulationSpeed: 1 };
    }
  }),

  startGame: () => set({ gameStage: 'playing' }),

  buyGPUs: (amount, cost) => set((state) => {
    if (state.resources.cash >= cost) {
      return {
        resources: { ...state.resources, cash: state.resources.cash - cost, compute: state.resources.compute + (amount * 5) },
        infrastructure: { ...state.infrastructure, gpus: state.infrastructure.gpus + amount },
        newsFeed: [{ tick: state.resources.currentTick, type: 'memory', text: `Acquired ${amount}x new GPUs. Compute capacity increased.`, iconColor: 'text-secondary-container' }, ...state.newsFeed]
      };
    }
    return state;
  }),

  startTraining: (llmName, version, durationTicks, targetStats) => set((state) => {
    if (state.activeTraining) return state; // Already training
    return {
      activeTraining: {
        id: Date.now().toString(),
        name: llmName,
        version: version,
        progress: 0,
        totalTicks: durationTicks,
        targetStats
      },
      newsFeed: [{ tick: state.resources.currentTick, type: 'model_training', text: `Began training ${llmName} ${version}.`, iconColor: 'text-tertiary-container' }, ...state.newsFeed]
    };
  }),

  releaseLLM: (llmId, releaseType) => set((state) => {
    const llm = state.llms.find(l => l.id === llmId);
    if (!llm || llm.isReleased) return state;

    // Calculate revenue and hype based on stats
    const statSum = llm.stats.knowledge + llm.stats.coding + llm.stats.math + llm.stats.creativity;
    const penalty = llm.stats.hallucination * 2;
    const score = Math.max(10, statSum - penalty);
    
    let cashGain = 0;
    let hypeGain = 0;
    
    if (releaseType === 'b2b') {
      cashGain = score * 5000;
      hypeGain = Math.floor(score * 0.1);
    } else {
      cashGain = score * 1000;
      hypeGain = Math.floor(score * 0.5);
    }

    return {
      llms: state.llms.map(l => l.id === llmId ? { ...l, isReleased: true } : l),
      resources: { ...state.resources, cash: state.resources.cash + cashGain, hype: state.resources.hype + hypeGain },
      newsFeed: [{ tick: state.resources.currentTick, type: 'public', text: `Released ${llm.name} to ${releaseType === 'b2b' ? 'Enterprise' : 'Consumer'} market. Earned $${cashGain.toLocaleString()}.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

  unlockTech: (techId, cost) => set((state) => {
    if (state.resources.cash >= cost && !state.research.unlockedTech.includes(techId)) {
      return {
        resources: { ...state.resources, cash: state.resources.cash - cost },
        research: { ...state.research, unlockedTech: [...state.research.unlockedTech, techId] },
        newsFeed: [{ tick: state.resources.currentTick, type: 'science', text: `Unlocked new architecture research.`, iconColor: 'text-secondary' }, ...state.newsFeed]
      };
    }
    return state;
  }),

  // Tick function to be called by a game loop
  tick: () => set((state) => {
    if (state.simulationSpeed === 0) return state; // Paused

    const updates = {
      resources: { ...state.resources, currentTick: state.resources.currentTick + 1 }
    };

    // Handle Training Progress
    if (state.activeTraining) {
      const newProgress = state.activeTraining.progress + 1;
      if (newProgress >= state.activeTraining.totalTicks) {
        // Training Finished
        const newLLM = {
          id: state.activeTraining.id,
          name: state.activeTraining.name,
          version: state.activeTraining.version,
          stats: state.activeTraining.targetStats,
          isReleased: false
        };
        updates.llms = [...state.llms, newLLM];
        updates.activeTraining = null;
        updates.newsFeed = [{ tick: state.resources.currentTick, type: 'check_circle', text: `Training complete: ${state.activeTraining.name} ${state.activeTraining.version}.`, iconColor: 'text-secondary-container' }, ...state.newsFeed];
      } else {
        updates.activeTraining = { ...state.activeTraining, progress: newProgress };
      }
    }

    return updates;
  }),
}));
