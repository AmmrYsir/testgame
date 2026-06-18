import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const formatDateFromTick = (tick) => {
  const startDate = new Date(2020, 0, 1); // January 1, 2020
  const currentDate = new Date(startDate.getTime() + tick * 24 * 60 * 60 * 1000);
  return currentDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const INITIAL_COUNTRIES = {
  US: { name: 'United States', demand: 25000, playerShare: 10, openaiShare: 60, anthropicShare: 30, allocatedGpus: 10, deployedModelId: null, latency: 10, satisfaction: 100 },
  CN: { name: 'China', demand: 30000, playerShare: 0, openaiShare: 70, anthropicShare: 30, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  JP: { name: 'Japan', demand: 12000, playerShare: 5, openaiShare: 65, anthropicShare: 30, allocatedGpus: 2, deployedModelId: null, latency: 10, satisfaction: 100 },
  DE: { name: 'Germany', demand: 10000, playerShare: 8, openaiShare: 62, anthropicShare: 30, allocatedGpus: 2, deployedModelId: null, latency: 10, satisfaction: 100 },
  GB: { name: 'United Kingdom', demand: 9000, playerShare: 7, openaiShare: 63, anthropicShare: 30, allocatedGpus: 2, deployedModelId: null, latency: 10, satisfaction: 100 },
  FR: { name: 'France', demand: 8000, playerShare: 6, openaiShare: 64, anthropicShare: 30, allocatedGpus: 2, deployedModelId: null, latency: 10, satisfaction: 100 },
  IN: { name: 'India', demand: 20000, playerShare: 2, openaiShare: 68, anthropicShare: 30, allocatedGpus: 1, deployedModelId: null, latency: 10, satisfaction: 100 },
  BR: { name: 'Brazil', demand: 7000, playerShare: 4, openaiShare: 66, anthropicShare: 30, allocatedGpus: 1, deployedModelId: null, latency: 10, satisfaction: 100 },
  CA: { name: 'Canada', demand: 6000, playerShare: 12, openaiShare: 58, anthropicShare: 30, allocatedGpus: 2, deployedModelId: null, latency: 10, satisfaction: 100 },
  AU: { name: 'Australia', demand: 5000, playerShare: 11, openaiShare: 59, anthropicShare: 30, allocatedGpus: 1, deployedModelId: null, latency: 10, satisfaction: 100 }
};

export const useGameStore = create(
  persist(
    (set, get) => ({
  // Game Flow State
  gameStage: 'menu', // 'menu', 'newGameSetup', 'playing'
  simulationSpeed: 1, // 0 = paused, 1 = normal, 2 = fast, etc.
  lastActiveSpeed: 1,
  isPaused: false,

  // Player Info
  company: {
    name: '',
    founder: '',
    color: '#3b82f6', // Default sapphire
    logo: 'memory',
  },

  // Core Resources
  resources: {
    cash: 1000000, // $1M starting capital
    compute: 50, // Base compute power (PFLOPS)
    hype: 10,
    currentTick: 0,
  },

  // Infrastructure
  infrastructure: {
    gpus: 64, // Physical GPUs starting count
    cloudGpusRented: 0, // Cloud GPUs rented (toggled)
    coolingLevel: 1, // Start with Level 1 HVAC
    serverHeat: 20, // 20% to 100%
  },

  // Models Registry
  llms: [], // { id, name, version, architecture, status, stats: { knowledge, coding, math, creativity, hallucination }, training: null | { progress, totalTicks, allocatedGpus, startStats, targetStats, cost }, releaseType, contractId }

  // Global Map Countries State
  countries: INITIAL_COUNTRIES,

  // Research (Progressive)
  research: {
    unlockedTech: ['transformer'], // default architecture
    activeResearch: null, // null or { techId, progress, totalTicks, fundingPerTick }
  },

  // Contracts Board
  marketContracts: [
    { id: 'c1', client: 'Alpha Corp', requirement: { stat: 'coding', value: 30 }, rewardPerTick: 4000, duration: 120, timeLeft: 120, activeModelId: null },
    { id: 'c2', client: 'EduLearn Inc', requirement: { stat: 'knowledge', value: 45 }, rewardPerTick: 7500, duration: 180, timeLeft: 180, activeModelId: null }
  ],

  // Rivals
  rivals: [
    { name: 'OpenAI', bestModel: 'GPT 3.0', share: 60, stats: { knowledge: 35, coding: 20, math: 15, creativity: 40, hallucination: 40 } },
    { name: 'Anthropic', bestModel: 'Claude 1.0', share: 30, stats: { knowledge: 40, coding: 25, math: 20, creativity: 45, hallucination: 35 } }
  ],

  // Mailbox System
  emails: [
    {
      id: 'welcome_email',
      sender: 'Corporate Board',
      subject: 'Founders Memo: Welcome to the AI Race',
      body: 'Welcome! We have secured $1,000,000 in starting capital for your new company.\n\nYour goal is to build powerful AI models, upgrade your hardware, and research new techniques to win market share from OpenAI and Anthropic. Keep an eye on server temperatures to prevent overheating, and complete contracts to earn cash. Good luck.',
      tick: 0,
      read: false,
      reward: null,
      claimed: false
    }
  ],

  // Milestone Emails Flags
  milestones: {
    gpu128: false,
    cash2m: false
  },

  // Operational Logs (Diagnostics Logs Console Drawer)
  newsFeed: [
    { tick: 0, type: 'trending_up', text: 'Silicon Valley AI race heats up. Rivals prepare next-gen LLMs.', iconColor: 'text-primary' }
  ],

  // Actions
  resetGame: () => set((state) => ({
    company: {
      name: '',
      founder: '',
      color: '#3b82f6',
      logo: 'memory',
    },
    resources: {
      cash: 1000000,
      compute: 50,
      hype: 10,
      currentTick: 0,
    },
    infrastructure: {
      gpus: 64,
      cloudGpusRented: 0,
      coolingLevel: 1,
      serverHeat: 20,
    },
    llms: [],
    countries: INITIAL_COUNTRIES,
    research: {
      unlockedTech: ['transformer'],
      activeResearch: null,
    },
    marketContracts: [
      { id: 'c1', client: 'Alpha Corp', requirement: { stat: 'coding', value: 30 }, rewardPerTick: 4000, duration: 120, timeLeft: 120, activeModelId: null },
      { id: 'c2', client: 'EduLearn Inc', requirement: { stat: 'knowledge', value: 45 }, rewardPerTick: 7500, duration: 180, timeLeft: 180, activeModelId: null }
    ],
    rivals: [
      { name: 'OpenAI', bestModel: 'GPT 3.0', share: 60, stats: { knowledge: 35, coding: 20, math: 15, creativity: 40, hallucination: 40 } },
      { name: 'Anthropic', bestModel: 'Claude 1.0', share: 30, stats: { knowledge: 40, coding: 25, math: 20, creativity: 45, hallucination: 35 } }
    ],
    emails: [
      {
        id: 'welcome_email',
        sender: 'Corporate Board',
        subject: 'Founders Memo: Welcome to the AI Race',
        body: 'Welcome! We have secured $1,000,000 in starting capital for your new company.\n\nYour goal is to build powerful AI models, upgrade your hardware, and research new techniques to win market share from OpenAI and Anthropic. Keep an eye on server temperatures to prevent overheating, and complete contracts to earn cash. Good luck.',
        tick: 0,
        read: false,
        reward: null,
        claimed: false
      }
    ],
    milestones: {
      gpu128: false,
      cash2m: false
    },
    newsFeed: [
      { tick: 0, type: 'trending_up', text: 'Silicon Valley AI race heats up. Rivals prepare next-gen LLMs.', iconColor: 'text-primary' }
    ],
    gameStage: 'newGameSetup',
    simulationSpeed: 1,
    lastActiveSpeed: 1,
    isPaused: false
  })),

  setGameStage: (stage) => set({ gameStage: stage }),
  
  setCompanyDetails: (details) => set((state) => ({
    company: { ...state.company, ...details }
  })),

  setSimulationSpeed: (speed) => set((state) => {
    const isZero = speed === 0;
    return { 
      simulationSpeed: speed,
      isPaused: isZero,
      lastActiveSpeed: isZero ? state.lastActiveSpeed : speed
    };
  }),

  togglePause: () => set((state) => {
    if (state.simulationSpeed > 0) {
      return { isPaused: true, simulationSpeed: 0 };
    } else {
      return { isPaused: false, simulationSpeed: state.lastActiveSpeed || 1 };
    }
  }),

  startGame: () => set({ gameStage: 'playing' }),

  // Mailbox Actions
  markEmailAsRead: (emailId) => set((state) => ({
    emails: state.emails.map(e => e.id === emailId ? { ...e, read: true } : e)
  })),

  claimEmailReward: (emailId) => set((state) => {
    const email = state.emails.find(e => e.id === emailId);
    if (!email || !email.reward || email.claimed) return {};

    const reward = email.reward;
    return {
      resources: {
        ...state.resources,
        cash: state.resources.cash + (reward.cash || 0),
        hype: Math.min(100, state.resources.hype + (reward.hype || 0))
      },
      emails: state.emails.map(e => e.id === emailId ? { ...e, claimed: true, read: true } : e),
      newsFeed: [
        { 
          tick: state.resources.currentTick, 
          type: 'monetization_on', 
          text: `Claimed reward from VC message: $${(reward.cash || 0).toLocaleString()}`, 
          iconColor: 'text-secondary' 
        }, 
        ...state.newsFeed
      ]
    };
  }),

  // Hardware Actions
  buyGPUs: (amount, cost) => set((state) => {
    if (state.resources.cash >= cost) {
      const newGpus = state.infrastructure.gpus + amount;
      const newCompute = (newGpus * 5) + (state.infrastructure.cloudGpusRented * 2.5);
      return {
        resources: { ...state.resources, cash: state.resources.cash - cost, compute: newCompute },
        infrastructure: { ...state.infrastructure, gpus: newGpus },
        newsFeed: [{ tick: state.resources.currentTick, type: 'memory', text: `Acquired ${amount}x physical H100 GPUs. Compute capacity boosted.`, iconColor: 'text-secondary-container' }, ...state.newsFeed]
      };
    }
    return state;
  }),

  toggleCloudGpus: (rentAmount) => set((state) => {
    const isRenting = state.infrastructure.cloudGpusRented > 0;
    const nextRented = isRenting ? 0 : rentAmount;
    const newCompute = (state.infrastructure.gpus * 5) + (nextRented * 2.5);
    
    return {
      infrastructure: { ...state.infrastructure, cloudGpusRented: nextRented },
      resources: { ...state.resources, compute: newCompute },
      newsFeed: [{ 
        tick: state.resources.currentTick, 
        type: 'cloud', 
        text: isRenting ? `Terminated cloud cluster lease.` : `Leased ${rentAmount}x cloud GPUs ($2,000/tick flat fee).`, 
        iconColor: isRenting ? 'text-outline' : 'text-primary' 
      }, ...state.newsFeed]
    };
  }),

  buyCooling: () => set((state) => {
    const nextLevel = state.infrastructure.coolingLevel + 1;
    const cost = nextLevel * 100000;
    if (state.resources.cash >= cost) {
      return {
        resources: { ...state.resources, cash: state.resources.cash - cost },
        infrastructure: { ...state.infrastructure, coolingLevel: nextLevel },
        newsFeed: [{ tick: state.resources.currentTick, type: 'ac_unit', text: `Facility HVAC upgraded to Level ${nextLevel}. Cooling efficiency improved.`, iconColor: 'text-primary' }, ...state.newsFeed]
      };
    }
    return state;
  }),

  createModel: (name, architecture) => set((state) => {
    // Clean name to avoid having any version numbers or version strings in it
    const cleanedName = name
      .replace(/\s*[vV](?:er(?:sion)?)?\.?\s*\d+(?:\.\d+)*\b/g, '')
      .replace(/\s+\d+(?:\.\d+)*\b/g, '')
      .replace(/\s+/g, ' ')
      .trim() || 'Aether';

    const newModel = {
      id: Date.now().toString(),
      name: cleanedName,
      version: 1.0,
      architecture: architecture,
      status: 'draft',
      stats: { knowledge: 15, coding: 10, math: 10, creativity: 15, hallucination: 35 },
      training: null,
      releaseType: null,
      contractId: null,
      revenuePerTick: 0,
      productionGpus: 0,
      priceTag: 0,
      targetSegment: null,
      marketMetrics: {
        users: 0,
        gpusRequired: 0,
        latency: 0,
        satisfaction: 100
      }
    };
    return {
      llms: [...state.llms, newModel],
      newsFeed: [{ tick: state.resources.currentTick, type: 'schema', text: `Model '${name}' created. Ready for training.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

  startTraining: (modelId, allocatedGpus, epochs, datasetType) => set((state) => {
    // Check if model exists
    const model = state.llms.find(m => m.id === modelId);
    if (!model || model.status === 'training') return state;

    // Check available GPUs (excluding training and production allocated gpus)
    const activeTrainingGpus = state.llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
    const activeProductionGpus = state.llms.reduce((sum, m) => sum + (m.productionGpus || 0), 0);
    const totalAvailableGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
    const idleGpus = totalAvailableGpus - activeTrainingGpus - activeProductionGpus;

    if (allocatedGpus > idleGpus) return state; // Not enough GPUs

    // Calculate Cost and Target Stats
    let datasetCost = 0;
    let statBonus = { knowledge: 0, coding: 0, math: 0, creativity: 0, hallucinationReduction: 0 };

    switch (datasetType) {
      case 'web_dump':
        datasetCost = 15000;
        statBonus = { knowledge: 5, coding: 2, math: 1, creativity: 5, hallucinationReduction: -5 }; // increases hallucination
        break;
      case 'textbooks':
        datasetCost = 80000;
        statBonus = { knowledge: 12, coding: 8, math: 8, creativity: 5, hallucinationReduction: 6 };
        break;
      case 'synthetic':
        datasetCost = 200000;
        statBonus = { knowledge: 10, coding: 20, math: 20, creativity: 5, hallucinationReduction: 5 };
        break;
      case 'rlhf_align':
        datasetCost = 350000;
        statBonus = { knowledge: 15, coding: 15, math: 10, creativity: 10, hallucinationReduction: 12 };
        break;
      default:
        break;
    }

    const totalCost = datasetCost + (allocatedGpus * epochs * 10);
    if (state.resources.cash < totalCost) return state; // Cannot afford run

    // Apply architecture multipliers
    let archMultiplier = 1.0;
    if (model.architecture === 'moe') archMultiplier = 1.25;
    if (model.architecture === 'ssm') archMultiplier = 1.4;

    const baseGains = epochs * 3 * archMultiplier;

    const targetStats = {
      knowledge: Math.min(100, model.stats.knowledge + Math.round(baseGains + statBonus.knowledge)),
      coding: Math.min(100, model.stats.coding + Math.round(baseGains + statBonus.coding)),
      math: Math.min(100, model.stats.math + Math.round(baseGains + statBonus.math)),
      creativity: Math.min(100, model.stats.creativity + Math.round(baseGains + statBonus.creativity)),
      hallucination: Math.max(1, model.stats.hallucination - Math.round(baseGains/2 + statBonus.hallucinationReduction))
    };

    const durationTicks = epochs * 8;

    return {
      resources: { ...state.resources, cash: state.resources.cash - totalCost },
      llms: state.llms.map(m => m.id === modelId ? {
        ...m,
        status: 'training',
        training: {
          progress: 0,
          totalTicks: durationTicks,
          allocatedGpus,
          startStats: { ...m.stats },
          targetStats,
          cost: totalCost
        }
      } : m),
      newsFeed: [{ tick: state.resources.currentTick, type: 'model_training', text: `Launched training run for '${model.name}' using ${allocatedGpus} GPUs. Est. Duration: ${durationTicks} days.`, iconColor: 'text-secondary' }, ...state.newsFeed]
    };
  }),

  releaseLLM: (modelId, targetSegment, initialPrice) => set((state) => {
    const model = state.llms.find(m => m.id === modelId);
    if (!model || model.status === 'training' || model.status === 'draft') return state;

    const statSum = model.stats.knowledge + model.stats.coding + model.stats.math + model.stats.creativity;
    const penalty = model.stats.hallucination * 2.5;
    const rating = Math.max(10, statSum - penalty);
    const hypeGained = Math.min(30, Math.round(rating * 0.15));

    let initialUsers = 0;
    let segmentLabel = '';
    
    switch (targetSegment) {
      case 'consumer':
        initialUsers = 500;
        segmentLabel = 'B2C App Store';
        break;
      case 'dev':
        initialUsers = 50;
        segmentLabel = 'Developer API Gateway';
        break;
      case 'business':
        initialUsers = 10;
        segmentLabel = 'Business SaaS Portal';
        break;
      case 'enterprise':
        initialUsers = 1;
        segmentLabel = 'Enterprise Cloud';
        break;
      default:
        break;
    }

    const emailSubject = `Model Released: ${model.name} v${model.version.toFixed(1)} on ${segmentLabel}`;
    const emailBody = `We have successfully released your model '${model.name}' v${model.version.toFixed(1)} to the ${segmentLabel}.\n\nModel stats:\n- Score: ${rating.toFixed(0)}\n- Hype gained: +${hypeGained}\n- Price: $${initialPrice.toLocaleString()}${targetSegment === 'dev' ? '/M tokens' : targetSegment === 'enterprise' ? '/month flat' : targetSegment === 'business' ? '/seat/month' : '/month subscription'}.\n\nRemember to allocate GPUs to this model from the Hardware tab to serve active user traffic and keep latency low.`;

    const newEmail = {
      id: 'rel_' + Date.now().toString(),
      sender: 'Facility Operations',
      subject: emailSubject,
      body: emailBody,
      tick: state.resources.currentTick,
      read: false,
      reward: null,
      claimed: false
    };

    return {
      llms: state.llms.map(m => m.id === modelId ? { 
        ...m, 
        status: 'released', 
        targetSegment, 
        priceTag: initialPrice,
        productionGpus: 0,
        marketMetrics: {
          users: initialUsers,
          gpusRequired: 0,
          latency: 10,
          satisfaction: 100
        }
      } : m),
      resources: { ...state.resources, hype: Math.min(100, state.resources.hype + hypeGained) },
      emails: [newEmail, ...state.emails],
      newsFeed: [{ tick: state.resources.currentTick, type: 'public', text: `Released ${model.name} v${model.version.toFixed(1)} to ${segmentLabel} at price $${initialPrice}.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

  allocateProductionGpus: (modelId, amount) => set((state) => {
    const totalGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
    const allocatedToOthers = state.llms.reduce((sum, m) => {
      if (m.id === modelId) return sum;
      const trainingGpus = m.training?.allocatedGpus || 0;
      const productionGpus = m.productionGpus || 0;
      return sum + trainingGpus + productionGpus;
    }, 0);
    const trainingForCurrentModel = state.llms.find(m => m.id === modelId)?.training?.allocatedGpus || 0;
    const maxAvailableForProduction = totalGpus - allocatedToOthers - trainingForCurrentModel;

    const finalAmount = Math.max(0, Math.min(amount, maxAvailableForProduction));

    return {
      llms: state.llms.map(m => m.id === modelId ? { ...m, productionGpus: finalAmount } : m),
      newsFeed: [{ 
        tick: state.resources.currentTick, 
        type: 'memory', 
        text: `Adjusted GPU allocation for '${state.llms.find(m => m.id === modelId)?.name}' to ${finalAmount} GPUs.`, 
        iconColor: 'text-outline-variant' 
      }, ...state.newsFeed]
    };
  }),

  setModelPrice: (modelId, priceVal) => set((state) => ({
    llms: state.llms.map(m => m.id === modelId ? { ...m, priceTag: priceVal } : m)
  })),

  // Progressive Research Actions
  startResearch: (techId, costCash, durationTicks) => set((state) => {
    if (state.research.activeResearch) return state; // Already researching something
    if (state.research.unlockedTech.includes(techId)) return state;

    return {
      research: {
        ...state.research,
        activeResearch: {
          techId,
          progress: 0,
          totalTicks: durationTicks,
          fundingPerTick: Math.round(costCash / durationTicks)
        }
      },
      newsFeed: [{ tick: state.resources.currentTick, type: 'science', text: `Allocated labs to study '${techId}'. Budgeting funding per tick.`, iconColor: 'text-secondary' }, ...state.newsFeed]
    };
  }),

  // B2B Contracts Actions
  bindModelToContract: (modelId, contractId) => set((state) => {
    const model = state.llms.find(m => m.id === modelId);
    const contract = state.marketContracts.find(c => c.id === contractId);

    if (!model || !contract || contract.activeModelId || model.status === 'draft' || model.status === 'training') return state;

    // Verify stats
    const reqStat = contract.requirement.stat;
    const reqVal = contract.requirement.value;
    const modelVal = model.stats[reqStat];

    if (reqStat === 'hallucination') {
      if (modelVal > reqVal) return state;
    } else {
      if (modelVal < reqVal) return state;
    }

    return {
      llms: state.llms.map(m => m.id === modelId ? { ...m, contractId: contractId } : m),
      marketContracts: state.marketContracts.map(c => c.id === contractId ? { ...c, activeModelId: modelId } : c),
      newsFeed: [{ tick: state.resources.currentTick, type: 'handshake', text: `Leased ${model.name} v${model.version.toFixed(1)} to client for B2B contract (${contract.client}). Revenue: $${contract.rewardPerTick.toLocaleString()}/day.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

  cancelContract: (contractId) => set((state) => {
    const contract = state.marketContracts.find(c => c.id === contractId);
    if (!contract || !contract.activeModelId) return state;

    const modelId = contract.activeModelId;

    return {
      llms: state.llms.map(m => m.id === modelId ? { ...m, contractId: null } : m),
      marketContracts: state.marketContracts.map(c => c.id === contractId ? { ...c, activeModelId: null, timeLeft: c.duration } : c),
      newsFeed: [{ tick: state.resources.currentTick, type: 'close', text: `Contract with ${contract.client} terminated or completed.`, iconColor: 'text-outline' }, ...state.newsFeed]
    };
  }),

  initCountry: (id, name) => set((state) => {
    if (state.countries[id]) return {};
    const demand = Math.floor(Math.random() * 8000) + 2000;
    const openaiShare = Math.floor(Math.random() * 20) + 50; // 50-70
    const anthropicShare = 100 - openaiShare;
    return {
      countries: {
        ...state.countries,
        [id]: {
          name: name || id,
          demand,
          playerShare: 0,
          openaiShare,
          anthropicShare,
          allocatedGpus: 0,
          deployedModelId: null,
          latency: 10,
          satisfaction: 100
        }
      }
    };
  }),

  deployModelToCountry: (countryId, modelId) => set((state) => {
    const country = state.countries[countryId];
    if (!country) return {};
    return {
      countries: {
        ...state.countries,
        [countryId]: {
          ...country,
          deployedModelId: modelId
        }
      }
    };
  }),

  allocateGpusToCountry: (countryId, amount) => set((state) => {
    const country = state.countries[countryId];
    if (!country) return {};
    const totalGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
    const trainingGpus = state.llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
    const allocatedToOthers = Object.entries(state.countries).reduce((sum, [cid, c]) => {
      if (cid === countryId) return sum;
      return sum + (c.allocatedGpus || 0);
    }, 0);
    const maxAvailable = totalGpus - trainingGpus - allocatedToOthers;
    const finalAmount = Math.max(0, Math.min(amount, maxAvailable));

    return {
      countries: {
        ...state.countries,
        [countryId]: {
          ...country,
          allocatedGpus: finalAmount
        }
      }
    };
  }),

  // Game Loop Tick
  tick: () => set((state) => {
    if (state.simulationSpeed === 0) return state; // Paused

    const currentTick = state.resources.currentTick + 1;
    let cashChange = 0;
    
    // 1. Cloud computing cost
    const cloudFee = state.infrastructure.cloudGpusRented * 15; // $15 per cloud GPU per tick
    cashChange -= cloudFee;

    // 2. Progressive Research Progress
    let nextActiveResearch = state.research.activeResearch;
    let nextUnlockedTech = [...state.research.unlockedTech];
    let nextNewsFeed = [...state.newsFeed];
    let nextEmails = [...state.emails];

    if (nextActiveResearch) {
      cashChange -= nextActiveResearch.fundingPerTick;
      const newProgress = nextActiveResearch.progress + 1;

      if (newProgress >= nextActiveResearch.totalTicks) {
        // Research Completed!
        nextUnlockedTech.push(nextActiveResearch.techId);
        
        // Send email
        const techName = nextActiveResearch.techId.toUpperCase();
        nextEmails = [{
          id: 'r_done_' + Date.now().toString(),
          sender: 'Labs Director',
          subject: `Research Finished: ${techName} unlocked`,
          body: `Good news! Our research team has finished studying ${techName}.\n\nThis technology is now available. You can now select it when creating or training models.`,
          tick: currentTick,
          read: false,
          reward: null,
          claimed: false
        }, ...nextEmails];

        nextNewsFeed = [{ 
          tick: currentTick, 
          type: 'science', 
          text: `Research Complete: Unlocked ${nextActiveResearch.techId.toUpperCase()}!`, 
          iconColor: 'text-primary' 
        }, ...nextNewsFeed];
        nextActiveResearch = null;
      } else {
        nextActiveResearch = { ...nextActiveResearch, progress: newProgress };
      }
    }

    // 3. Train models progress
    let activeTrainingCount = 0;
    let totalTrainingGpus = 0;

    let nextLlms = state.llms.map(m => {
      if (m.status === 'training' && m.training) {
        activeTrainingCount++;
        totalTrainingGpus += m.training.allocatedGpus;
        
        const newProgress = m.training.progress + 1;
        const total = m.training.totalTicks;
        
        // Interpolate stats dynamically
        const progressRatio = newProgress / total;
        const currentStats = {};
        for (const [stat, startVal] of Object.entries(m.training.startStats)) {
          const targetVal = m.training.targetStats[stat];
          currentStats[stat] = Math.round(startVal + (targetVal - startVal) * progressRatio);
        }

        if (newProgress >= total) {
          // Training completed!
          const nextVer = m.version === 1.0 && m.status === 'draft' ? 1.0 : m.version + 1.0;
          
          nextEmails = [{
            id: 't_done_' + Date.now().toString(),
            sender: 'Facility Operations',
            subject: `Training Finished: ${m.name} v${nextVer.toFixed(1)}`,
            body: `Training is complete. Model '${m.name}' is now at version v${nextVer.toFixed(1)}.\n\nBenchmark Stats:\n- Knowledge: ${m.training.targetStats.knowledge}%\n- Coding: ${m.training.targetStats.coding}%\n- Math: ${m.training.targetStats.math}%\n- Creativity: ${m.training.targetStats.creativity}%\n- Hallucinations: ${m.training.targetStats.hallucination}%\n\nThe model is ready to be released to the market or assigned to contracts.`,
            tick: currentTick,
            read: false,
            reward: null,
            claimed: false
          }, ...nextEmails];

          nextNewsFeed = [{ 
            tick: currentTick, 
            type: 'check_circle', 
            text: `Training Complete: '${m.name}' successfully aligned to version v${nextVer.toFixed(1)}!`, 
            iconColor: 'text-secondary' 
          }, ...nextNewsFeed];
          
          return {
            ...m,
            version: nextVer,
            status: 'trained',
            stats: m.training.targetStats,
            training: null
          };
        } else {
          return {
            ...m,
            stats: currentStats,
            training: {
              ...m.training,
              progress: newProgress
            }
          };
        }
      }
      return m;
    });

    // 4. Released models economics, user adoption, required compute, and billing revenue
    const segmentConfigs = {
      consumer: { basePrice: 15, weightStats: ['creativity', 'knowledge'], userGrowthFactor: 1.5, computePerUser: 0.005, maxMarket: 50000 },
      dev: { basePrice: 5, weightStats: ['coding', 'math'], userGrowthFactor: 0.8, computePerUser: 0.05, maxMarket: 5000 },
      business: { basePrice: 25, weightStats: ['coding', 'knowledge'], userGrowthFactor: 0.2, computePerUser: 0.15, maxMarket: 1000 },
      enterprise: { basePrice: 5000, weightStats: ['math', 'knowledge'], userGrowthFactor: 0.005, computePerUser: 2.0, maxMarket: 50 }
    };

    let totalProductionGpus = 0;
    const updatedCountries = {};
    const modelAggregations = {};

    for (const [cid, country] of Object.entries(state.countries)) {
      let playerShare = country.playerShare || 0;
      let openaiShare = country.openaiShare || 0;
      let anthropicShare = country.anthropicShare || 0;
      let latency = country.latency || 10;
      let satisfaction = country.satisfaction || 100;
      let playerUsers = 0;
      let gpusRequired = 0;

      const modelId = country.deployedModelId;
      const model = modelId ? nextLlms.find(m => m.id === modelId) : null;

      if (model && model.status === 'released' && model.targetSegment) {
        const cfg = segmentConfigs[model.targetSegment];
        
        // Quality score: mean of key stats, penalized by hallucination
        const rating = (model.stats[cfg.weightStats[0]] + model.stats[cfg.weightStats[1]]) / 2;
        const penalty = model.stats.hallucination * 1.5;
        const qualityScore = Math.max(5, rating - penalty);

        // Competitor baseline quality score (best rival in that segment)
        let maxRivalScore = 30;
        state.rivals.forEach(r => {
          const rRating = (r.stats[cfg.weightStats[0]] + r.stats[cfg.weightStats[1]]) / 2;
          const rPenalty = r.stats.hallucination * 1.5;
          const rScore = Math.max(5, rRating - rPenalty);
          if (rScore > maxRivalScore) maxRivalScore = rScore;
        });

        // Price comparison
        const finalPrice = model.priceTag || cfg.basePrice;
        const valueScore = qualityScore / Math.max(0.1, finalPrice);
        const rivalValueScore = maxRivalScore / cfg.basePrice;
        const competitiveness = valueScore / Math.max(0.01, rivalValueScore);

        // Hype scaling
        const hypeFactor = 0.5 + (state.resources.hype / 50);

        // Growth or decay rate of market share in percentage points
        let shareChange = 0;
        if (competitiveness > 1.25) {
          shareChange = (competitiveness - 1) * hypeFactor * 1.5;
        } else if (competitiveness < 0.75) {
          shareChange = (competitiveness - 1) * 1.5;
        } else {
          shareChange = (competitiveness - 1) * 0.5;
        }

        // Apply satisfaction penalty to growth
        if (satisfaction < 75) {
          shareChange -= (100 - satisfaction) * 0.05;
        }

        playerShare = Math.max(0, Math.min(100, playerShare + shareChange));
        
        // Normalize rival shares to fill the rest
        const totalRivalShare = openaiShare + anthropicShare;
        if (totalRivalShare > 0) {
          openaiShare = (openaiShare / totalRivalShare) * (100 - playerShare);
          anthropicShare = (anthropicShare / totalRivalShare) * (100 - playerShare);
        } else {
          openaiShare = (100 - playerShare) * 0.67;
          anthropicShare = (100 - playerShare) * 0.33;
        }

        playerUsers = Math.round(country.demand * (playerShare / 100));
        gpusRequired = Math.ceil(playerUsers * cfg.computePerUser);
        const allocated = country.allocatedGpus || 0;
        totalProductionGpus += allocated;

        if (allocated === 0) {
          latency = 999;
          satisfaction = Math.max(0, satisfaction - 6);
        } else if (allocated < gpusRequired) {
          latency = Math.round(10 * (gpusRequired / allocated));
          satisfaction = Math.max(0, satisfaction - 3);
        } else {
          latency = 10;
          satisfaction = Math.min(100, satisfaction + 2);
        }

        // Calculate revenue
        let countryRev = playerUsers * finalPrice;
        countryRev = countryRev * (satisfaction / 100);
        cashChange += Math.round(countryRev);

        // Track metrics for model aggregation
        if (!modelAggregations[modelId]) {
          modelAggregations[modelId] = { users: 0, gpusRequired: 0, latencies: [], satisfactions: [] };
        }
        modelAggregations[modelId].users += playerUsers;
        modelAggregations[modelId].gpusRequired += gpusRequired;
        modelAggregations[modelId].latencies.push(latency);
        modelAggregations[modelId].satisfactions.push(satisfaction);
      } else {
        // Decay player share if no model deployed
        playerShare = Math.max(0, playerShare - 2);
        const totalRivalShare = openaiShare + anthropicShare;
        if (totalRivalShare > 0) {
          openaiShare = (openaiShare / totalRivalShare) * (100 - playerShare);
          anthropicShare = (anthropicShare / totalRivalShare) * (100 - playerShare);
        } else {
          openaiShare = (100 - playerShare) * 0.67;
          anthropicShare = (100 - playerShare) * 0.33;
        }
        playerUsers = 0;
        gpusRequired = 0;
        latency = 10;
        satisfaction = Math.min(100, satisfaction + 2);
      }

      updatedCountries[cid] = {
        ...country,
        playerShare: parseFloat(playerShare.toFixed(2)),
        openaiShare: parseFloat(openaiShare.toFixed(2)),
        anthropicShare: parseFloat(anthropicShare.toFixed(2)),
        playerUsers,
        gpusRequired,
        latency,
        satisfaction
      };
    }

    nextLlms = nextLlms.map(m => {
      if (m.status === 'released' && m.targetSegment) {
        const agg = modelAggregations[m.id] || { users: 0, gpusRequired: 0, latencies: [], satisfactions: [] };
        const avgLatency = agg.latencies.length > 0 ? Math.round(agg.latencies.reduce((a, b) => a + b, 0) / agg.latencies.length) : 10;
        const avgSatisfaction = agg.satisfactions.length > 0 ? Math.round(agg.satisfactions.reduce((a, b) => a + b, 0) / agg.satisfactions.length) : 100;
        
        // Count total GPUs allocated to this model across all countries
        const allocatedGpus = Object.values(updatedCountries).reduce((sum, c) => {
          if (c.deployedModelId === m.id) {
            return sum + (c.allocatedGpus || 0);
          }
          return sum;
        }, 0);

        return {
          ...m,
          productionGpus: allocatedGpus,
          marketMetrics: {
            users: agg.users,
            gpusRequired: agg.gpusRequired,
            latency: avgLatency,
            satisfaction: avgSatisfaction
          }
        };
      }
      return m;
    });

    // 5. Calculate Server Cluster Temperature
    let targetHeat = 20; // nominal base heat
    const activeGpuLoad = totalTrainingGpus + (totalProductionGpus * 0.3);
    if (activeGpuLoad > 0) {
      targetHeat = Math.min(100, 20 + Math.round((activeGpuLoad / 12) / state.infrastructure.coolingLevel));
    }
    
    // Smooth heat movement
    let currentHeat = state.infrastructure.serverHeat;
    if (currentHeat < targetHeat) {
      currentHeat = Math.min(100, currentHeat + 3);
    } else if (currentHeat > targetHeat) {
      currentHeat = Math.max(20, currentHeat - 2);
    }

    // Heat Throttling check
    if (currentHeat > 85 && Math.random() < 0.05) {
      const trainingModel = nextLlms.find(m => m.status === 'training');
      if (trainingModel) {
        nextEmails = [{
          id: 't_abort_' + Date.now().toString(),
          sender: 'Facility Operations',
          subject: 'Overheating: Training Stopped',
          body: `Our servers overheated and reached ${currentHeat}%, exceeding the safe limit of 85%. To prevent physical damage, we had to stop training ${trainingModel.name}.\n\nAll progress on this training run has been lost. To avoid this in the future, please upgrade your cooling system or allocate fewer GPUs.`,
          tick: currentTick,
          read: false,
          reward: null,
          claimed: false
        }, ...nextEmails];

        nextNewsFeed = [{
          tick: currentTick,
          type: 'warning',
          text: `CRITICAL: Thermal shutdown triggered on cluster. Training of ${trainingModel.name} was aborted due to overheating!`,
          iconColor: 'text-error'
        }, ...nextNewsFeed];
        trainingModel.status = 'draft';
        trainingModel.training = null;
      }
    }

    // 6. Contract payouts and time elapsed (Enterprise Leases)
    let activeContractPayouts = 0;
    const nextContracts = state.marketContracts.map(c => {
      if (c.activeModelId) {
        activeContractPayouts += c.rewardPerTick;
        const nextTime = c.timeLeft - 1;

        if (nextTime <= 0) {
          // Contract completed!
          nextEmails = [{
            id: 'c_done_' + Date.now().toString(),
            sender: 'Finance Dept',
            subject: `Contract Completed: ${c.client}`,
            body: `Our contract with ${c.client} has ended.\n\nThe client has sent the completion bonus of $50,000. Claim the funds below.`,
            tick: currentTick,
            read: false,
            reward: { cash: 50000 },
            claimed: false
          }, ...nextEmails];

          nextNewsFeed = [{ 
            tick: currentTick, 
            type: 'handshake', 
            text: `Contract completed with ${c.client}. Wired completion bonus!`, 
            iconColor: 'text-secondary' 
          }, ...nextNewsFeed];

          // Free model
          const modelToFree = nextLlms.find(m => m.id === c.activeModelId);
          if (modelToFree) modelToFree.contractId = null;

          // Replace contract with new one
          const statNames = ['knowledge', 'coding', 'math', 'creativity'];
          const randomStat = statNames[Math.floor(Math.random() * statNames.length)];
          const randomVal = 40 + Math.floor(Math.random() * 40);
          const reward = 5000 + Math.floor(Math.random() * 12000);
          const dur = 100 + Math.floor(Math.random() * 150);

          return {
            id: 'c_' + Date.now().toString(),
            client: ['GigaSystems', 'BetaGlobal', 'CyberSec', 'MetaDyne', 'ApexData'][Math.floor(Math.random() * 5)],
            requirement: { stat: randomStat, value: randomVal },
            rewardPerTick: reward,
            duration: dur,
            timeLeft: dur,
            activeModelId: null
          };
        } else {
          return { ...c, timeLeft: nextTime };
        }
      }
      return c;
    });
    cashChange += activeContractPayouts;

    // Hype decay
    let nextHype = state.resources.hype;
    if (currentTick % 10 === 0) {
      nextHype = Math.max(5, nextHype - 1);
    }

    // 7. Rivals releases & Dynamic Price Adjustments
    let nextRivals = state.rivals;
    if (currentTick > 0 && currentTick % 120 === 0) {
      // Rival upgrades their model!
      const randomRivalIdx = Math.floor(Math.random() * nextRivals.length);
      const rival = nextRivals[randomRivalIdx];
      const statsToUpgrade = ['knowledge', 'coding', 'math', 'creativity'];
      const statName = statsToUpgrade[Math.floor(Math.random() * statsToUpgrade.length)];
      
      const upgradedRivals = nextRivals.map((r, i) => {
        if (i === randomRivalIdx) {
          const nextVal = Math.min(99, r.stats[statName] + 5);
          const nextModelVer = parseFloat(r.bestModel.split(' ')[1] || '4.0') + 0.5;
          return {
            ...r,
            bestModel: `${r.name === 'OpenAI' ? 'GPT' : 'Claude'} ${nextModelVer.toFixed(1)}`,
            stats: { ...r.stats, [statName]: nextVal },
            share: Math.min(70, r.share + 2)
          };
        } else {
          return { ...r, share: Math.max(10, r.share - 1) };
        }
      });
      nextRivals = upgradedRivals;

      const updatedRival = nextRivals[randomRivalIdx];
      nextEmails = [{
        id: 'rival_' + Date.now().toString(),
        sender: 'Market Watch',
        subject: `Competitor Update: ${rival.name} releases ${updatedRival.bestModel}`,
        body: `We noticed that ${rival.name} has released a major update, launching '${updatedRival.bestModel}'.\n\nThey have gained market share and now hold ${updatedRival.share}%. Their new model performs very well, especially in ${statName} (${updatedRival.stats[statName]}%).\n\nWe need to train and release updated models to stay competitive.`,
        tick: currentTick,
        read: false,
        reward: null,
        claimed: false
      }, ...nextEmails];

      nextNewsFeed = [{
        tick: currentTick,
        type: 'warning',
        text: `MARKET UPDATE: ${rival.name} released a new model upgrade! Benchmarks raised.`,
        iconColor: 'text-error'
      }, ...nextNewsFeed];
    }

    // Dynamic Competitor Pricing Actions
    nextLlms.forEach(m => {
      if (m.status === 'released' && m.targetSegment) {
        const cfg = segmentConfigs[m.targetSegment];
        const playerShare = (m.marketMetrics.users / cfg.maxMarket) * 100;
        
        // If player market share grows over 30%, and a random trigger is hit, rivals cut prices!
        if (playerShare > 30 && Math.random() < 0.03) {
          // Find rival which holds that segment
          const randomRival = nextRivals[Math.floor(Math.random() * nextRivals.length)];
          
          nextEmails = [{
            id: 'rival_cut_' + Date.now().toString(),
            sender: 'Market Watch',
            subject: `Competitor Action: ${randomRival.name} cuts prices`,
            body: `We've received word that ${randomRival.name} has cut their prices in the ${m.targetSegment} segment by 15% to protect their market share.\n\nThis price cut makes their services more attractive. You might need to lower your prices or upgrade your model's stats to keep your customers.`,
            tick: currentTick,
            read: false,
            reward: null,
            claimed: false
          }, ...nextEmails];

          nextNewsFeed = [{
            tick: currentTick,
            type: 'warning',
            text: `MARKET ALERTS: ${randomRival.name} cut pricing in ${m.targetSegment.toUpperCase()} to fight your market share!`,
            iconColor: 'text-error'
          }, ...nextNewsFeed];
        }
      }
    });

    // 8. Milestone Detections & VC Grant Emails
    const nextMilestones = { ...state.milestones };
    
    // GPU Milestone: 128 physical + cloud leased
    const currentTotalGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
    if (currentTotalGpus >= 128 && !nextMilestones.gpu128) {
      nextMilestones.gpu128 = true;
      nextEmails = [{
        id: 'm_gpu_' + Date.now().toString(),
        sender: 'VC Lead Investor',
        subject: 'Hardware Milestone: Compute Expansion Grant',
        body: `Great job expanding your hardware cluster to over 128 GPUs. To support your growth, the board has approved a $200,000 grant to help you fund more advanced training datasets.\n\nClaim the funds below.`,
        tick: currentTick,
        read: false,
        reward: { cash: 200000 },
        claimed: false
      }, ...nextEmails];
    }

    // Cash Milestone: $2M cash
    const currentCash = state.resources.cash + cashChange;
    if (currentCash >= 2000000 && !nextMilestones.cash2m) {
      nextMilestones.cash2m = true;
      nextEmails = [{
        id: 'm_cash_' + Date.now().toString(),
        sender: 'Silicon Venture Capital',
        subject: 'Financial Milestone: PR Campaign Launched',
        body: `Congratulations on reaching $2,000,000 in cash reserves. This milestone has generated a lot of positive press for the company.\n\nWe've put together a PR announcement that will boost our hype by +25 points.\n\nClaim the reward below to publish the news.`,
        tick: currentTick,
        read: false,
        reward: { hype: 25 },
        claimed: false
      }, ...nextEmails];
    }

    return {
      resources: {
        ...state.resources,
        cash: state.resources.cash + cashChange,
        hype: nextHype,
        currentTick
      },
      infrastructure: {
        ...state.infrastructure,
        serverHeat: currentHeat
      },
      llms: nextLlms,
      countries: updatedCountries,
      research: {
        ...state.research,
        activeResearch: nextActiveResearch,
        unlockedTech: nextUnlockedTech
      },
      marketContracts: nextContracts,
      rivals: nextRivals,
      emails: nextEmails,
      milestones: nextMilestones,
      newsFeed: nextNewsFeed
    };
  }),
  }),
  {
    name: 'ai-tycoon-save-state',
    partialize: (state) => {
      // Exclude UI flow state like gameStage, simulationSpeed, isPaused, lastActiveSpeed from persistence
      const { gameStage, simulationSpeed, lastActiveSpeed, isPaused, ...rest } = state;
      return rest;
    }
  }
));
