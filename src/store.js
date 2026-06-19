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
  US: { name: 'United States', demand: 25000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  CN: { name: 'China', demand: 30000, playerShare: 0, openaiShare: 65, googleShare: 35, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  JP: { name: 'Japan', demand: 12000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  DE: { name: 'Germany', demand: 10000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  GB: { name: 'United Kingdom', demand: 9000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  FR: { name: 'France', demand: 8000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  IN: { name: 'India', demand: 20000, playerShare: 0, openaiShare: 65, googleShare: 35, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  BR: { name: 'Brazil', demand: 7000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  CA: { name: 'Canada', demand: 6000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
  AU: { name: 'Australia', demand: 5000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } }
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
    hqCountryId: '',
  },

  // Core Resources
  resources: {
    cash: 1000000, // $1M starting capital
    compute: 50, // Base compute power (PFLOPS)
    data: 100, // Proprietary training data in Terabytes (TB)
    fans: 10,
    currentTick: 0,
  },

  // Active deals & training bonuses
  activeApiLeases: [], // Array of { company, type, ticksLeft }
  activeComputeLeases: [], // Array of { company, type, ticksLeft }

  // Infrastructure
  infrastructure: {
    gpus: 64, // Physical GPUs starting count
    cloudGpusRented: 0, // Cloud GPUs rented (toggled)
    coolingLevel: 1, // Start with Level 1 HVAC
    serverHeat: 20, // 20% to 100%
  },

  // Models Registry
  llms: [], // { id, name, version, architecture, status, stats: { agentic, coding, reasoning, knowledge, math, multilingual, multimodal }, training: null | { progress, totalTicks, allocatedGpus, startStats, targetStats, cost }, creationProgress, creationTotalTicks, releaseType }

  // Global Map Countries State
  countries: INITIAL_COUNTRIES,

  // Research (Progressive)
  research: {
    unlockedTech: ['transformer'], // default architecture
    activeResearch: null, // null or { techId, progress, totalTicks, fundingPerTick }
  },

  // Contracts Board
  marketContracts: [],

  // Rivals
  rivals: [
    { 
      name: 'Google', 
      bestModel: 'PaLM 1.0', 
      share: 30, 
      color: '#4285F4', 
      logo: 'search', 
      yearEst: 1998, 
      active: true, 
      cash: 30000000, 
      compute: 8500, 
      data: 1200, 
      stats: { agentic: 20, coding: 30, reasoning: 25, knowledge: 45, math: 25, multilingual: 35, multimodal: 30 },
      models: [
        { name: 'BERT-Large', stats: { agentic: 5, coding: 5, reasoning: 8, knowledge: 15, math: 5, multilingual: 10, multimodal: 5 } },
        { name: 'T5-XXL', stats: { agentic: 10, coding: 10, reasoning: 15, knowledge: 25, math: 15, multilingual: 20, multimodal: 15 } },
        { name: 'PaLM 1.0', stats: { agentic: 20, coding: 30, reasoning: 25, knowledge: 45, math: 25, multilingual: 35, multimodal: 30 } }
      ]
    },
    { 
      name: 'OpenAI', 
      bestModel: 'GPT 3.0', 
      share: 60, 
      color: '#ea580c', 
      logo: 'smart_toy', 
      yearEst: 2015, 
      active: true, 
      cash: 15000000, 
      compute: 6000, 
      data: 500, 
      stats: { agentic: 25, coding: 20, reasoning: 30, knowledge: 35, math: 15, multilingual: 20, multimodal: 15 },
      models: [
        { name: 'GPT 2.0', stats: { agentic: 10, coding: 10, reasoning: 12, knowledge: 20, math: 5, multilingual: 10, multimodal: 8 } },
        { name: 'GPT 3.0', stats: { agentic: 25, coding: 20, reasoning: 30, knowledge: 35, math: 15, multilingual: 20, multimodal: 15 } }
      ]
    },
    { 
      name: 'Anthropic', 
      bestModel: 'Claude 1.0', 
      share: 0, 
      color: '#a78bfa', 
      logo: 'radar', 
      yearEst: 2021, 
      active: false, 
      cash: 8000000, 
      compute: 3500, 
      data: 300, 
      stats: { agentic: 30, coding: 25, reasoning: 35, knowledge: 40, math: 20, multilingual: 25, multimodal: 20 },
      models: [
        { name: 'Claude Instant', stats: { agentic: 20, coding: 20, reasoning: 25, knowledge: 30, math: 15, multilingual: 18, multimodal: 12 } },
        { name: 'Claude 1.0', stats: { agentic: 30, coding: 25, reasoning: 35, knowledge: 40, math: 20, multilingual: 25, multimodal: 20 } }
      ]
    }
  ],

  // Mailbox System
  emails: [
    {
      id: 'welcome_email',
      sender: 'Corporate Board',
      subject: 'Founders Memo: Welcome to the AI Race',
      body: 'Welcome! We have secured $1,000,000 in starting capital for your new company.\n\nYour goal is to build powerful AI models, upgrade your hardware, and research new techniques to win market share from Google, OpenAI, and Anthropic. Keep an eye on server temperatures to prevent overheating. Good luck.',
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
      hqCountryId: '',
    },
    resources: {
      cash: 1000000,
      compute: 50,
      data: 100,
      fans: 10,
      currentTick: 0,
    },
    activeApiLeases: [],
    activeComputeLeases: [],
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
    marketContracts: [],
    rivals: [
      { 
        name: 'Google', 
        bestModel: 'PaLM 1.0', 
        share: 30, 
        color: '#4285F4', 
        logo: 'search', 
        yearEst: 1998, 
        active: true, 
        cash: 30000000, 
        compute: 8500, 
        data: 1200, 
        stats: { agentic: 20, coding: 30, reasoning: 25, knowledge: 45, math: 25, multilingual: 35, multimodal: 30 },
        models: [
          { name: 'BERT-Large', stats: { agentic: 5, coding: 5, reasoning: 8, knowledge: 15, math: 5, multilingual: 10, multimodal: 5 } },
          { name: 'T5-XXL', stats: { agentic: 10, coding: 10, reasoning: 15, knowledge: 25, math: 15, multilingual: 20, multimodal: 15 } },
          { name: 'PaLM 1.0', stats: { agentic: 20, coding: 30, reasoning: 25, knowledge: 45, math: 25, multilingual: 35, multimodal: 30 } }
        ]
      },
      { 
        name: 'OpenAI', 
        bestModel: 'GPT 3.0', 
        share: 60, 
        color: '#ea580c', 
        logo: 'smart_toy', 
        yearEst: 2015, 
        active: true, 
        cash: 15000000, 
        compute: 6000, 
        data: 500, 
        stats: { agentic: 25, coding: 20, reasoning: 30, knowledge: 35, math: 15, multilingual: 20, multimodal: 15 },
        models: [
          { name: 'GPT 2.0', stats: { agentic: 10, coding: 10, reasoning: 12, knowledge: 20, math: 5, multilingual: 10, multimodal: 8 } },
          { name: 'GPT 3.0', stats: { agentic: 25, coding: 20, reasoning: 30, knowledge: 35, math: 15, multilingual: 20, multimodal: 15 } }
        ]
      },
      { 
        name: 'Anthropic', 
        bestModel: 'Claude 1.0', 
        share: 0, 
        color: '#a78bfa', 
        logo: 'radar', 
        yearEst: 2021, 
        active: false, 
        cash: 8000000, 
        compute: 3500, 
        data: 300, 
        stats: { agentic: 30, coding: 25, reasoning: 35, knowledge: 40, math: 20, multilingual: 25, multimodal: 20 },
        models: [
          { name: 'Claude Instant', stats: { agentic: 20, coding: 20, reasoning: 25, knowledge: 30, math: 15, multilingual: 18, multimodal: 12 } },
          { name: 'Claude 1.0', stats: { agentic: 30, coding: 25, reasoning: 35, knowledge: 40, math: 20, multilingual: 25, multimodal: 20 } }
        ]
      }
    ],
    emails: [
      {
        id: 'welcome_email',
        sender: 'Corporate Board',
        subject: 'Founders Memo: Welcome to the AI Race',
        body: 'Welcome! We have secured $1,000,000 in starting capital for your new company.\n\nYour goal is to build powerful AI models, upgrade your hardware, and research new techniques to win market share from Google, OpenAI, and Anthropic. Keep an eye on server temperatures to prevent overheating. Good luck.',
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

  setStartingCash: (amount) => set((state) => ({
    resources: {
      ...state.resources,
      cash: amount
    }
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

  establishHq: (countryId) => set((state) => {
    const country = state.countries[countryId];
    if (!country) return {};
    
    // Clear initial playerShare & allocatedGpus from all countries
    const clearedCountries = {};
    Object.entries(state.countries).forEach(([code, c]) => {
      clearedCountries[code] = {
        ...c,
        playerShare: 0,
        allocatedGpus: 0,
        deployedModelId: null,
        openMarkets: {
          player: false,
          openai: true,
          google: true,
          anthropic: (c.anthropicShare || 0) > 0
        }
      };
    });

    // Compute scaled down rival shares in HQ country (remaining 90%)
    const targetOpenai = country.openaiShare || 0;
    const targetGoogle = country.googleShare || 0;
    const targetAnthropic = country.anthropicShare || 0;
    const totalRival = targetOpenai + targetGoogle + targetAnthropic;

    let newOpenai = 0;
    let newGoogle = 0;
    let newAnthropic = 0;

    if (totalRival > 0) {
      newOpenai = parseFloat(((targetOpenai / totalRival) * 90).toFixed(2));
      newGoogle = parseFloat(((targetGoogle / totalRival) * 90).toFixed(2));
      newAnthropic = parseFloat(((targetAnthropic / totalRival) * 90).toFixed(2));
    } else {
      newOpenai = 54;
      newGoogle = 36;
      newAnthropic = 0;
    }

    // Set the chosen country as HQ with starting stats
    clearedCountries[countryId] = {
      ...clearedCountries[countryId],
      playerShare: 10,
      openaiShare: newOpenai,
      googleShare: newGoogle,
      anthropicShare: newAnthropic,
      allocatedGpus: 10,
      deployedModelId: null,
      openMarkets: {
        player: true,
        openai: true,
        google: true,
        anthropic: newAnthropic > 0
      }
    };

    const countryName = country.name;

    return {
      company: { ...state.company, hqCountryId: countryId },
      countries: clearedCountries,
      newsFeed: [
        { 
          tick: state.resources.currentTick, 
          type: 'science', 
          text: `Establish Headquarters: Corporate headquarters set up in ${countryName}. Global operations online!`, 
          iconColor: 'text-primary' 
        },
        ...state.newsFeed
      ],
      simulationSpeed: 1,
      isPaused: false
    };
  }),

  executeDeal: (rivalName, playerOffer, playerRequest) => {
    let returnVal = {};
    set((state) => {
      const baseValues = {
        cash: 1,
        data: 1500,
        apiLease: 150000,
        computeLease: 200000
      };

      const modifiers = {
        Google: { cash: 1.0, data: 0.8, apiLease: 1.2, computeLease: 1.3, greed: 0.10 },
        OpenAI: { cash: 0.8, data: 1.5, apiLease: 1.1, computeLease: 1.2, greed: 0.15 },
        Anthropic: { cash: 1.0, data: 1.0, apiLease: 1.0, computeLease: 1.5, greed: 0.05 }
      };

      const rival = state.rivals.find(r => r.name === rivalName);
      if (!rival) {
        returnVal = { dealStatus: 'error', dealMessage: 'Rival not found.' };
        return {};
      }

      const mods = modifiers[rivalName] || { cash: 1.0, data: 1.0, apiLease: 1.0, computeLease: 1.0, greed: 0.1 };

      let offeredValue = 0;
      offeredValue += playerOffer.cash * mods.cash;
      offeredValue += playerOffer.data * baseValues.data * mods.data;
      if (playerOffer.apiLease > 0) offeredValue += baseValues.apiLease * playerOffer.apiLease * mods.apiLease;
      if (playerOffer.computeLease > 0) offeredValue += baseValues.computeLease * playerOffer.computeLease * mods.computeLease;

      let requestedValue = 0;
      requestedValue += playerRequest.cash * mods.cash;
      requestedValue += playerRequest.data * baseValues.data * mods.data;
      if (playerRequest.apiLease > 0) requestedValue += baseValues.apiLease * playerRequest.apiLease * mods.apiLease;
      if (playerRequest.computeLease > 0) requestedValue += baseValues.computeLease * playerRequest.computeLease * mods.computeLease;

      if (state.resources.cash < playerOffer.cash) {
        returnVal = { dealStatus: 'error', dealMessage: 'Insufficient cash to cover your offer.' };
        return {};
      }
      if ((state.resources.data || 0) < playerOffer.data) {
        returnVal = { dealStatus: 'error', dealMessage: 'Insufficient proprietary data to cover your offer.' };
        return {};
      }
      if (playerOffer.computeLease > 0 && state.resources.compute < 200) {
        returnVal = { dealStatus: 'error', dealMessage: 'Leasing compute power requires at least 200 PFLOPS of compute capacity.' };
        return {};
      }
      const hasReleasedModel = state.llms.some(m => m.status === 'released');
      if (playerOffer.apiLease > 0 && !hasReleasedModel) {
        returnVal = { dealStatus: 'error', dealMessage: 'Leasing API access requires you to have at least one released model.' };
        return {};
      }

      if ((rival.cash || 0) < playerRequest.cash) {
        returnVal = { dealStatus: 'error', dealMessage: `${rivalName} does not have enough cash reserves.` };
        return {};
      }
      if ((rival.data || 0) < playerRequest.data) {
        returnVal = { dealStatus: 'error', dealMessage: `${rivalName} does not have enough proprietary data.` };
        return {};
      }
      if (playerRequest.computeLease > 0 && (rival.compute || 0) < 200) {
        returnVal = { dealStatus: 'error', dealMessage: `${rivalName} does not have enough compute capacity to lease.` };
        return {};
      }

      const requiredValue = requestedValue * (1 + mods.greed);

      if (offeredValue >= requiredValue) {
        const nextCash = state.resources.cash - playerOffer.cash + playerRequest.cash;
        const nextData = (state.resources.data || 0) - playerOffer.data + playerRequest.data;

        const nextRivals = state.rivals.map(r => {
          if (r.name === rivalName) {
            return {
              ...r,
              cash: (r.cash || 0) + playerOffer.cash - playerRequest.cash,
              data: (r.data || 0) + playerOffer.data - playerRequest.data
            };
          }
          return r;
        });

        let nextApiLeases = [...(state.activeApiLeases || [])];
        if (playerRequest.apiLease > 0) {
          nextApiLeases.push({ company: rivalName, type: 'incoming', ticksLeft: playerRequest.apiLease * 365 });
        }
        if (playerOffer.apiLease > 0) {
          nextApiLeases.push({ company: rivalName, type: 'outgoing', ticksLeft: playerOffer.apiLease * 365 });
        }

        let nextComputeLeases = [...(state.activeComputeLeases || [])];
        if (playerRequest.computeLease > 0) {
          nextComputeLeases.push({ company: rivalName, type: 'incoming', ticksLeft: playerRequest.computeLease * 365 });
        }
        if (playerOffer.computeLease > 0) {
          nextComputeLeases.push({ company: rivalName, type: 'outgoing', ticksLeft: playerOffer.computeLease * 365 });
        }

        const baseCompute = (state.infrastructure.gpus * 5) + (state.infrastructure.cloudGpusRented * 2.5);
        const computeAdjustment = (nextComputeLeases.filter(l => l.type === 'incoming').length - nextComputeLeases.filter(l => l.type === 'outgoing').length) * 200;
        const nextCompute = Math.max(0, baseCompute + computeAdjustment);

        const currentTick = state.resources.currentTick;
        const dealText = `Deal Completed with ${rivalName}! Offered: ${playerOffer.cash > 0 ? `$${playerOffer.cash.toLocaleString()} cash ` : ''}${playerOffer.data > 0 ? `${playerOffer.data} TB data ` : ''}${playerOffer.apiLease > 0 ? `API Lease (${playerOffer.apiLease} yr) ` : ''}${playerOffer.computeLease > 0 ? `Compute Lease (${playerOffer.computeLease} yr) ` : ''}. Requested: ${playerRequest.cash > 0 ? `$${playerRequest.cash.toLocaleString()} cash ` : ''}${playerRequest.data > 0 ? `${playerRequest.data} TB data ` : ''}${playerRequest.apiLease > 0 ? `API Lease (${playerRequest.apiLease} yr) ` : ''}${playerRequest.computeLease > 0 ? `Compute Lease (${playerRequest.computeLease} yr) ` : ''}.`;

        returnVal = { dealStatus: 'accepted', dealMessage: `Deal accepted! ${rivalName} agreed to your proposal.` };

        return {
          resources: {
            ...state.resources,
            cash: nextCash,
            data: nextData,
            compute: nextCompute
          },
          rivals: nextRivals,
          activeApiLeases: nextApiLeases,
          activeComputeLeases: nextComputeLeases,
          newsFeed: [{ tick: currentTick, type: 'handshake', text: dealText, iconColor: 'text-[#10b981]' }, ...state.newsFeed]
        };
      } else {
        const deficitValue = requiredValue - offeredValue;
        const cashDeficit = Math.ceil(deficitValue / mods.cash);
        const dataDeficit = Math.ceil(deficitValue / (baseValues.data * mods.data));

        returnVal = {
          dealStatus: 'declined',
          dealMessage: `Deal declined by ${rivalName}. "Our board requires at least $${cashDeficit.toLocaleString()} more cash or ${dataDeficit} TB more data to agree to this exchange."`
        };
        return {};
      }
    });
    return returnVal;
  },

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
        fans: Math.min(100, state.resources.fans + (reward.fans || 0))
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
      const baseCompute = (newGpus * 5) + (state.infrastructure.cloudGpusRented * 2.5);
      const leaseAdjustment = ((state.activeComputeLeases || []).filter(l => l.type === 'incoming').length - (state.activeComputeLeases || []).filter(l => l.type === 'outgoing').length) * 200;
      const newCompute = Math.max(0, baseCompute + leaseAdjustment);
      return {
        resources: { ...state.resources, cash: state.resources.cash - cost, compute: newCompute },
        infrastructure: { ...state.infrastructure, gpus: newGpus },
        newsFeed: [{ tick: state.resources.currentTick, type: 'memory', text: `Acquired ${amount}x physical H100 GPUs. Compute capacity boosted.`, iconColor: 'text-secondary-container' }, ...state.newsFeed]
      };
    }
    return state;
  }),

  setCloudGpus: (rentAmount) => set((state) => {
    const finalAmount = Math.max(0, rentAmount);
    const baseCompute = (state.infrastructure.gpus * 5) + (finalAmount * 2.5);
    const leaseAdjustment = ((state.activeComputeLeases || []).filter(l => l.type === 'incoming').length - (state.activeComputeLeases || []).filter(l => l.type === 'outgoing').length) * 200;
    const newCompute = Math.max(0, baseCompute + leaseAdjustment);
    
    let newsText = '';
    if (finalAmount > state.infrastructure.cloudGpusRented) {
      newsText = `Upgraded cloud compute lease to ${finalAmount} GPUs.`;
    } else if (finalAmount < state.infrastructure.cloudGpusRented) {
      if (finalAmount === 0) {
        newsText = `Terminated cloud cluster lease.`;
      } else {
        newsText = `Reduced cloud compute lease to ${finalAmount} GPUs.`;
      }
    }

    const nextNewsFeed = newsText 
      ? [{ tick: state.resources.currentTick, type: 'cloud', text: newsText, iconColor: 'text-primary' }, ...state.newsFeed]
      : state.newsFeed;

    return {
      infrastructure: { ...state.infrastructure, cloudGpusRented: finalAmount },
      resources: { ...state.resources, compute: newCompute },
      newsFeed: nextNewsFeed
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
      version: '1.0',
      architecture: architecture,
      status: 'developing',
      creationProgress: 0,
      creationTotalTicks: 180, // 6 months
      stats: { agentic: 10, coding: 10, reasoning: 10, knowledge: 15, math: 10, multilingual: 8, multimodal: 8 },
      training: null,
      releaseType: null,
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
      newsFeed: [{ tick: state.resources.currentTick, type: 'schema', text: `Started development on model '${cleanedName}'. Backbone design will take 6 months.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

  startTraining: (modelId, allocatedGpus, epochs, datasetType) => set((state) => {
    // Check if model exists
    const model = state.llms.find(m => m.id === modelId);
    if (!model || (model.status !== 'draft' && model.status !== 'trained')) return state;

    // Check available GPUs (excluding training and production allocated gpus)
    const activeTrainingGpus = state.llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
    const activeProductionGpus = state.llms.reduce((sum, m) => sum + (m.productionGpus || 0), 0);
    const totalAvailableGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
    const idleGpus = totalAvailableGpus - activeTrainingGpus - activeProductionGpus;

    if (allocatedGpus > idleGpus) return state; // Not enough GPUs

    // Calculate Cost and Target Stats
    let datasetCost = 0;
    let statBonus = { agentic: 0, coding: 0, reasoning: 0, knowledge: 0, math: 0, multilingual: 0, multimodal: 0 };

    switch (datasetType) {
      case 'web_dump':
        datasetCost = 15000;
        statBonus = { agentic: 2, coding: 2, reasoning: 1, knowledge: 5, math: 1, multilingual: 5, multimodal: 3 };
        break;
      case 'textbooks':
        datasetCost = 80000;
        statBonus = { agentic: 3, coding: 8, reasoning: 8, knowledge: 12, math: 8, multilingual: 6, multimodal: 4 };
        break;
      case 'synthetic':
        datasetCost = 200000;
        statBonus = { agentic: 8, coding: 20, reasoning: 15, knowledge: 10, math: 20, multilingual: 3, multimodal: 5 };
        break;
      case 'rlhf_align':
        datasetCost = 350000;
        statBonus = { agentic: 15, coding: 10, reasoning: 12, knowledge: 15, math: 10, multilingual: 8, multimodal: 10 };
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
      agentic: Math.min(100, model.stats.agentic + Math.round(baseGains + statBonus.agentic)),
      coding: Math.min(100, model.stats.coding + Math.round(baseGains + statBonus.coding)),
      reasoning: Math.min(100, model.stats.reasoning + Math.round(baseGains + statBonus.reasoning)),
      knowledge: Math.min(100, model.stats.knowledge + Math.round(baseGains + statBonus.knowledge)),
      math: Math.min(100, model.stats.math + Math.round(baseGains + statBonus.math)),
      multilingual: Math.min(100, model.stats.multilingual + Math.round(baseGains + statBonus.multilingual)),
      multimodal: Math.min(100, model.stats.multimodal + Math.round(baseGains + statBonus.multimodal))
    };

    const durationTicks = Math.max(180, epochs * 60); // Minimum 6 months

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

  releaseLLM: (modelId, initialPrice) => set((state) => {
    const model = state.llms.find(m => m.id === modelId);
    if (!model || model.status === 'training' || model.status === 'draft') return state;

    const statSum = model.stats.agentic + model.stats.coding + model.stats.reasoning + model.stats.knowledge + model.stats.math + model.stats.multilingual + model.stats.multimodal;
    const rating = Math.max(10, Math.round(statSum / 7));
    const fansGained = Math.min(30, Math.round(rating * 0.15));

    let initialUsers = 100;

    const emailSubject = `Model Released: ${model.name} v${model.version}`;
    const emailBody = `We have successfully released your model '${model.name}' v${model.version} for global commercial use.\n\nModel stats:\n- Score: ${rating.toFixed(0)}\n- Fans gained: +${fansGained}\n- Price: $${initialPrice.toLocaleString()}/month subscription.\n\nRemember to allocate GPUs to this model from the Hardware tab to serve active user traffic and keep latency low.`;

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
        targetSegment: 'global', 
        priceTag: initialPrice,
        productionGpus: 0,
        marketMetrics: {
          users: initialUsers,
          gpusRequired: 0,
          latency: 10,
          satisfaction: 100
        }
      } : m),
      resources: { ...state.resources, fans: Math.min(100, state.resources.fans + fansGained) },
      emails: [newEmail, ...state.emails],
      newsFeed: [{ tick: state.resources.currentTick, type: 'public', text: `Released ${model.name} v${model.version} at price $${initialPrice}/mo.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

  finalizeModelTraining: (modelId, versionLabel) => set((state) => {
    const model = state.llms.find(m => m.id === modelId);
    if (!model || model.status !== 'trained_pending' || !model.trainingCompletion) return {};

    const finalStats = model.trainingCompletion.newStats;
    const finalVer = versionLabel.trim() || model.version;

    const statSum = finalStats.agentic + finalStats.coding + finalStats.reasoning + finalStats.knowledge + finalStats.math + finalStats.multilingual + finalStats.multimodal;
    const rating = Math.max(10, Math.round(statSum / 7));

    const emailSubject = `Training Finished: ${model.name} v${finalVer}`;
    const emailBody = `Training is complete. Model '${model.name}' is now at version v${finalVer}.\n\nBenchmark Stats:\n- Agentic: ${finalStats.agentic}%\n- Coding: ${finalStats.coding}%\n- Reasoning: ${finalStats.reasoning}%\n- Knowledge: ${finalStats.knowledge}%\n- Math: ${finalStats.math}%\n- Multilingual: ${finalStats.multilingual}%\n- Multimodal: ${finalStats.multimodal}%\n\nThe model is ready to be released to the market.`;

    const newEmail = {
      id: 't_done_' + Date.now().toString(),
      sender: 'Facility Operations',
      subject: emailSubject,
      body: emailBody,
      tick: state.resources.currentTick,
      read: false,
      reward: null,
      claimed: false
    };

    const nextNewsFeed = [{
      tick: state.resources.currentTick,
      type: 'check_circle',
      text: `Training Complete: '${model.name}' successfully aligned to version v${finalVer}!`,
      iconColor: 'text-[#10b981]'
    }, ...state.newsFeed];

    return {
      llms: state.llms.map(m => m.id === modelId ? {
        ...m,
        status: 'trained',
        version: finalVer,
        stats: finalStats,
        training: null,
        trainingCompletion: null
      } : m),
      emails: [newEmail, ...state.emails],
      newsFeed: nextNewsFeed,
      simulationSpeed: state.lastActiveSpeed || 1,
      isPaused: false
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

  initCountry: (id, name) => set((state) => {
    if (state.countries[id]) return {};
    const demand = Math.floor(Math.random() * 8000) + 2000;
    
    const anthropicRival = state.rivals.find(r => r.name === 'Anthropic');
    const isAnthropicActive = anthropicRival ? anthropicRival.active : false;

    let openaiShare = Math.floor(Math.random() * 15) + 45; // 45-60
    let googleShare = 100 - openaiShare;
    let anthropicShare = 0;

    if (isAnthropicActive) {
      anthropicShare = Math.floor(Math.random() * 15) + 15; // 15-30
      const totalRival = openaiShare + googleShare;
      openaiShare = (openaiShare / totalRival) * (100 - anthropicShare);
      googleShare = (googleShare / totalRival) * (100 - anthropicShare);
    }

    return {
      countries: {
        ...state.countries,
        [id]: {
          name: name || id,
          demand,
          playerShare: 0,
          openaiShare: parseFloat(openaiShare.toFixed(2)),
          googleShare: parseFloat(googleShare.toFixed(2)),
          anthropicShare: parseFloat(anthropicShare.toFixed(2)),
          allocatedGpus: 0,
          deployedModelId: null,
          latency: 10,
          satisfaction: 100,
          openMarkets: {
            player: false,
            openai: true,
            google: true,
            anthropic: isAnthropicActive
          }
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

  openMarket: (countryId) => set((state) => {
    const country = state.countries[countryId];
    if (!country) return {};
    const cost = 50000;
    if (state.resources.cash < cost) return {};
    return {
      resources: {
        ...state.resources,
        cash: state.resources.cash - cost
      },
      countries: {
        ...state.countries,
        [countryId]: {
          ...country,
          openMarkets: {
            ...country.openMarkets,
            player: true
          }
        }
      },
      newsFeed: [
        { 
          tick: state.resources.currentTick, 
          type: 'science', 
          text: `Market Expansion: Opened operations in ${country.name} for $${cost.toLocaleString()}.`, 
          iconColor: 'text-emerald-500' 
        },
        ...state.newsFeed
      ]
    };
  }),

  // Game Loop Tick
  tick: () => set((state) => {
    if (state.simulationSpeed === 0 || !state.company.hqCountryId) return state; // Paused or no HQ

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
    let nextRivals = [...state.rivals];

    const startDate = new Date(2020, 0, 1);
    const currentDate = new Date(startDate.getTime() + currentTick * 24 * 60 * 60 * 1000);
    const currentYear = currentDate.getFullYear();

    const anthropicIndex = nextRivals.findIndex(r => r.name === 'Anthropic');
    let anthropicJustActivated = false;
    if (anthropicIndex !== -1 && !nextRivals[anthropicIndex].active && currentYear >= 2021) {
      anthropicJustActivated = true;
      nextRivals[anthropicIndex] = {
        ...nextRivals[anthropicIndex],
        active: true
      };

      nextNewsFeed = [{
        tick: currentTick,
        type: 'public',
        text: "INDUSTRY ALERT: Anthropic has been established by former researchers. They enter the market with Claude 1.0!",
        iconColor: 'text-purple-400'
      }, ...nextNewsFeed];

      nextEmails = [{
        id: 'rival_anthropic_' + Date.now().toString(),
        sender: 'AI Market Intelligence',
        subject: 'New Competitor Detected: Anthropic',
        body: `Industry Alert:\n\nAnthropic has been officially founded. Led by former senior researchers, they are entering the market with a strong focus on alignment and safety.\n\nThey have deployed their Claude 1.0 model, which is highly competitive in reasoning, coding, and safety benchmarks. We must step up our own research to maintain competitiveness.`,
        tick: currentTick,
        read: false,
        reward: null,
        claimed: false
      }, ...nextEmails];
    }

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

    // 2.5 API Leases countdown and training speed multiplier
    const nextApiLeases = (state.activeApiLeases || [])
      .map(lease => ({ ...lease, ticksLeft: lease.ticksLeft - 1 }))
      .filter(lease => lease.ticksLeft > 0);

    const hasIncomingLease = nextApiLeases.some(lease => lease.type === 'incoming' || !lease.type);
    const speedMultiplier = hasIncomingLease ? 1.2 : 1.0;

    // 2.6 Compute Leases countdown and compute recalculation
    const nextComputeLeases = (state.activeComputeLeases || [])
      .map(lease => ({ ...lease, ticksLeft: lease.ticksLeft - 1 }))
      .filter(lease => lease.ticksLeft > 0);

    const baseCompute = (state.infrastructure.gpus * 5) + (state.infrastructure.cloudGpusRented * 2.5);
    const computeAdjustment = (nextComputeLeases.filter(l => l.type === 'incoming').length - nextComputeLeases.filter(l => l.type === 'outgoing').length) * 200;
    const nextCompute = Math.max(0, baseCompute + computeAdjustment);
    
    // 3. Model creation and training progress
    let activeTrainingCount = 0;
    let totalTrainingGpus = 0;
    let isPausedTriggered = false;

    let nextLlms = state.llms.map(m => {
      if (m.status === 'developing') {
        const nextProgress = m.creationProgress + 1;
        if (nextProgress >= m.creationTotalTicks) {
          nextEmails = [{
            id: 'c_created_' + Date.now().toString(),
            sender: 'Labs Director',
            subject: `Neural Backbone Created: ${m.name}`,
            body: `We have completed designing the base neural architecture and backbone layout for '${m.name}' (${m.architecture === 'moe' ? 'Mixture of Experts' : m.architecture === 'ssm' ? 'State Space Model' : 'Transformer'}).\n\nThe model is now in 'DRAFT' status. It cannot be released or deployed yet as it contains randomized weights. Deploy GPUs to launch an initial training run on a dataset to align its parameters.`,
            tick: currentTick,
            read: false,
            reward: null,
            claimed: false
          }, ...nextEmails];

          nextNewsFeed = [{
            tick: currentTick,
            type: 'schema',
            text: `Development complete: Neural backbone for '${m.name}' finalized. Ready for training!`,
            iconColor: 'text-[#10b981]'
          }, ...nextNewsFeed];

          return {
            ...m,
            status: 'draft',
            creationProgress: undefined,
            creationTotalTicks: undefined
          };
        } else {
          return {
            ...m,
            creationProgress: nextProgress
          };
        }
      }

      if (m.status === 'training' && m.training) {
        activeTrainingCount++;
        totalTrainingGpus += m.training.allocatedGpus;
        
        const newProgress = m.training.progress + speedMultiplier;
        const total = m.training.totalTicks;
        
        // Interpolate stats dynamically
        const progressRatio = Math.min(1.0, newProgress / total);
        const currentStats = {};
        for (const [stat, startVal] of Object.entries(m.training.startStats)) {
          const targetVal = m.training.targetStats[stat];
          currentStats[stat] = Math.round(startVal + (targetVal - startVal) * progressRatio);
        }

        if (newProgress >= total) {
          // Training completed! Pause game and transition to trained_pending.
          const finalStats = { ...m.training.targetStats };
          isPausedTriggered = true;

          return {
            ...m,
            status: 'trained_pending',
            stats: finalStats,
            trainingCompletion: {
              oldStats: { ...m.training.startStats },
              newStats: finalStats
            }
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
    let totalProductionGpus = 0;
    const updatedCountries = {};
    const modelAggregations = {};

    for (const [cid, country] of Object.entries(state.countries)) {
      const isOpenPlayer = country.openMarkets?.player;
      const isOpenOpenai = country.openMarkets?.openai;
      const isOpenGoogle = country.openMarkets?.google;
      let isOpenAnthropic = country.openMarkets?.anthropic;

      if (anthropicJustActivated) {
        isOpenAnthropic = true;
      }

      let playerShare = isOpenPlayer ? (country.playerShare || 0) : 0;
      let openaiShare = isOpenOpenai ? (country.openaiShare || 0) : 0;
      let googleShare = isOpenGoogle ? (country.googleShare || 0) : 0;
      let anthropicShare = isOpenAnthropic ? (anthropicJustActivated ? 15 : (country.anthropicShare || 0)) : 0;

      if (anthropicJustActivated) {
        const totalRival = openaiShare + googleShare;
        if (totalRival > 0) {
          openaiShare = (openaiShare / totalRival) * (100 - playerShare - anthropicShare);
          googleShare = (googleShare / totalRival) * (100 - playerShare - anthropicShare);
        } else {
          openaiShare = isOpenOpenai ? (100 - playerShare - anthropicShare) * 0.6 : 0;
          googleShare = isOpenGoogle ? (100 - playerShare - anthropicShare) * 0.4 : 0;
        }
      }
      let latency = country.latency || 10;
      let satisfaction = country.satisfaction || 100;
      let playerUsers = 0;
      let gpusRequired = 0;

      const modelId = country.deployedModelId;
      const model = modelId ? nextLlms.find(m => m.id === modelId) : null;

      if (model && model.status === 'released' && isOpenPlayer) {
        const allocated = country.allocatedGpus || 0;
        
        // Quality score: mean of all 7 stats
        const rating = (model.stats.agentic + model.stats.coding + model.stats.reasoning + model.stats.knowledge + model.stats.math + model.stats.multilingual + model.stats.multimodal) / 7;
        const qualityScore = Math.max(5, rating);

        // Competitor baseline quality score (best rival)
        let maxRivalScore = 30;
        state.rivals.forEach(r => {
          const rRating = (r.stats.agentic + r.stats.coding + r.stats.reasoning + r.stats.knowledge + r.stats.math + r.stats.multilingual + r.stats.multimodal) / 7;
          const rScore = Math.max(5, rRating);
          if (rScore > maxRivalScore) maxRivalScore = rScore;
        });

        // Price comparison
        const finalPrice = model.priceTag || 15;
        const valueScore = qualityScore / Math.max(0.1, finalPrice);
        const rivalValueScore = maxRivalScore / 15; // default base price is $15/mo
        const competitiveness = valueScore / Math.max(0.01, rivalValueScore);

        // Fans scaling
        const fansFactor = 0.5 + (state.resources.fans / 50);

        // Growth or decay rate of market share in percentage points
        let shareChange = 0;
        if (allocated === 0) {
          shareChange = -3.0; // Outage = severe decay
        } else if (competitiveness > 1.25) {
          shareChange = (competitiveness - 1) * fansFactor * 1.5;
        } else if (competitiveness < 0.75) {
          shareChange = (competitiveness - 1) * 1.5;
        } else {
          shareChange = (competitiveness - 1) * 0.5;
        }

        // Apply satisfaction penalty to growth
        if (allocated > 0 && satisfaction < 75) {
          shareChange -= (100 - satisfaction) * 0.05;
        }

        playerShare = Math.max(0, Math.min(100, playerShare + shareChange));
        
        // Normalize open rival shares to fill the rest
        const openRivals = [];
        if (isOpenOpenai) openRivals.push({ name: 'openai', share: openaiShare });
        if (isOpenGoogle) openRivals.push({ name: 'google', share: googleShare });
        if (isOpenAnthropic) openRivals.push({ name: 'anthropic', share: anthropicShare });

        const totalRivalShare = openRivals.reduce((sum, r) => sum + r.share, 0);
        const remainingShare = 100 - playerShare;

        if (openRivals.length > 0) {
          if (totalRivalShare > 0) {
            openaiShare = isOpenOpenai ? (openaiShare / totalRivalShare) * remainingShare : 0;
            googleShare = isOpenGoogle ? (googleShare / totalRivalShare) * remainingShare : 0;
            anthropicShare = isOpenAnthropic ? (anthropicShare / totalRivalShare) * remainingShare : 0;
          } else {
            let totalWeight = 0;
            if (isOpenOpenai) totalWeight += 0.4;
            if (isOpenGoogle) totalWeight += 0.4;
            if (isOpenAnthropic) totalWeight += 0.2;

            openaiShare = isOpenOpenai ? (0.4 / totalWeight) * remainingShare : 0;
            googleShare = isOpenGoogle ? (0.4 / totalWeight) * remainingShare : 0;
            anthropicShare = isOpenAnthropic ? (0.2 / totalWeight) * remainingShare : 0;
          }
        } else {
          if (isOpenPlayer) playerShare = 100;
          openaiShare = 0;
          googleShare = 0;
          anthropicShare = 0;
        }

        playerUsers = Math.round(country.demand * (playerShare / 100));
        gpusRequired = Math.ceil(playerUsers * 0.01);
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
        if (allocated === 0) {
          countryRev = 0; // Outage = no revenue
        }
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
        // Decay player share if no model deployed (or player market not open)
        if (isOpenPlayer) {
          playerShare = Math.max(0, playerShare - 2);
        } else {
          playerShare = 0;
        }
        
        const openRivals = [];
        if (isOpenOpenai) openRivals.push({ name: 'openai', share: openaiShare });
        if (isOpenGoogle) openRivals.push({ name: 'google', share: googleShare });
        if (isOpenAnthropic) openRivals.push({ name: 'anthropic', share: anthropicShare });

        const totalRivalShare = openRivals.reduce((sum, r) => sum + r.share, 0);
        const remainingShare = 100 - playerShare;

        if (openRivals.length > 0) {
          if (totalRivalShare > 0) {
            openaiShare = isOpenOpenai ? (openaiShare / totalRivalShare) * remainingShare : 0;
            googleShare = isOpenGoogle ? (googleShare / totalRivalShare) * remainingShare : 0;
            anthropicShare = isOpenAnthropic ? (anthropicShare / totalRivalShare) * remainingShare : 0;
          } else {
            let totalWeight = 0;
            if (isOpenOpenai) totalWeight += 0.4;
            if (isOpenGoogle) totalWeight += 0.4;
            if (isOpenAnthropic) totalWeight += 0.2;

            openaiShare = isOpenOpenai ? (0.4 / totalWeight) * remainingShare : 0;
            googleShare = isOpenGoogle ? (0.4 / totalWeight) * remainingShare : 0;
            anthropicShare = isOpenAnthropic ? (0.2 / totalWeight) * remainingShare : 0;
          }
        } else {
          if (isOpenPlayer) playerShare = 100;
          openaiShare = 0;
          googleShare = 0;
          anthropicShare = 0;
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
        googleShare: parseFloat(googleShare.toFixed(2)),
        anthropicShare: parseFloat(anthropicShare.toFixed(2)),
        playerUsers,
        gpusRequired,
        latency,
        satisfaction,
        openMarkets: {
          player: !!isOpenPlayer,
          openai: !!isOpenOpenai,
          google: !!isOpenGoogle,
          anthropic: !!isOpenAnthropic
        }
      };
    }

    nextLlms = nextLlms.map(m => {
      if (m.status === 'released') {
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

    // 6. Contracts removed - no payouts

    // Fans decay
    let nextFans = state.resources.fans;
    if (currentTick % 10 === 0) {
      nextFans = Math.max(5, nextFans - 1);
    }

    // 7. Rivals releases & Dynamic Price Adjustments
    if (currentTick > 0 && currentTick % 120 === 0) {
      // Rival upgrades their model!
      const randomRivalIdx = Math.floor(Math.random() * nextRivals.length);
      const rival = nextRivals[randomRivalIdx];
      const statsToUpgrade = ['agentic', 'coding', 'reasoning', 'knowledge', 'math', 'multilingual', 'multimodal'];
      const statName = statsToUpgrade[Math.floor(Math.random() * statsToUpgrade.length)];
      
      const upgradedRivals = nextRivals.map((r, i) => {
        if (i === randomRivalIdx) {
          const nextVal = Math.min(99, r.stats[statName] + 5);
          const nextModelVer = parseFloat(r.bestModel.split(' ')[1] || '4.0') + 0.5;
          const nextModelName = `${r.name === 'OpenAI' ? 'GPT' : r.name === 'Google' ? 'Gemini' : 'Claude'} ${nextModelVer.toFixed(1)}`;
          const nextStats = {
            ...r.stats,
            [statName]: nextVal
          };
          const nextModels = [
            ...(r.models || []),
            { name: nextModelName, stats: nextStats }
          ];

          return {
            ...r,
            bestModel: nextModelName,
            stats: nextStats,
            models: nextModels,
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

    // 7.5 Passive growth of competitor Cash & Data reserves (keeping inventory alive)
    nextRivals = nextRivals.map(r => {
      if (!r.active) return r;
      let cashGain = 15000;
      let dataGain = 1;
      if (r.name === 'Google') {
        cashGain = 30000;
        dataGain = 3;
      } else if (r.name === 'OpenAI') {
        cashGain = 20000;
        dataGain = 2;
      } else if (r.name === 'Anthropic') {
        cashGain = 15000;
        dataGain = 2;
      }
      return {
        ...r,
        cash: (r.cash || 0) + cashGain,
        data: (r.data || 0) + dataGain
      };
    });

    // Dynamic Competitor Pricing Actions
    const totalOpenedDemand = Object.values(state.countries)
      .filter(c => c.openMarkets?.player)
      .reduce((sum, c) => sum + c.demand, 0);

    const activeGlobalDemand = Math.max(1, totalOpenedDemand);

    nextLlms.forEach(m => {
      if (m.status === 'released') {
        const playerShare = (m.marketMetrics.users / activeGlobalDemand) * 100;
        
        // If player market share grows over 30%, and a random trigger is hit, rivals cut prices!
        if (playerShare > 30 && Math.random() < 0.03) {
          const randomRival = nextRivals[Math.floor(Math.random() * nextRivals.length)];
          
          nextEmails = [{
            id: 'rival_cut_' + Date.now().toString(),
            sender: 'Market Watch',
            subject: `Competitor Action: ${randomRival.name} cuts prices`,
            body: `We've received word that ${randomRival.name} has cut their subscription prices by 15% globally to protect their market share.\n\nThis price cut makes their services more attractive. You might need to lower your prices or upgrade your model's stats to keep your customers.`,
            tick: currentTick,
            read: false,
            reward: null,
            claimed: false
          }, ...nextEmails];

          nextNewsFeed = [{
            tick: currentTick,
            type: 'warning',
            text: `MARKET ALERTS: ${randomRival.name} cut pricing globally to fight your market share!`,
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
        body: `Congratulations on reaching $2,000,000 in cash reserves. This milestone has generated a lot of positive press for the company.\n\nWe've put together a PR announcement that will attract +25 Fans.\n\nClaim the reward below to publish the news.`,
        tick: currentTick,
        read: false,
        reward: { fans: 25 },
        claimed: false
      }, ...nextEmails];
    }

    return {
      resources: {
        ...state.resources,
        cash: state.resources.cash + cashChange,
        data: state.resources.data || 0,
        compute: nextCompute,
        fans: nextFans,
        currentTick
      },
      rivals: nextRivals,
      activeApiLeases: nextApiLeases,
      activeComputeLeases: nextComputeLeases,
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
      emails: nextEmails,
      milestones: nextMilestones,
      newsFeed: nextNewsFeed,
      simulationSpeed: isPausedTriggered ? 0 : state.simulationSpeed,
      isPaused: isPausedTriggered ? true : state.isPaused
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
