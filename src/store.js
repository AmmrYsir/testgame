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
  US: { name: 'United States', demand: 25000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  CN: { name: 'China', demand: 30000, playerShare: 0, openaiShare: 65, googleShare: 35, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  JP: { name: 'Japan', demand: 12000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  DE: { name: 'Germany', demand: 10000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  GB: { name: 'United Kingdom', demand: 9000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  FR: { name: 'France', demand: 8000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  IN: { name: 'India', demand: 20000, playerShare: 0, openaiShare: 65, googleShare: 35, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  BR: { name: 'Brazil', demand: 7000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  CA: { name: 'Canada', demand: 6000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 },
  AU: { name: 'Australia', demand: 5000, playerShare: 0, openaiShare: 60, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100 }
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
    hype: 10,
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
  llms: [], // { id, name, version, architecture, status, stats: { agentic, coding, reasoning, knowledge, math, multilingual, multimodal }, training: null | { progress, totalTicks, allocatedGpus, startStats, targetStats, cost }, releaseType, contractId }

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
      body: 'Welcome! We have secured $1,000,000 in starting capital for your new company.\n\nYour goal is to build powerful AI models, upgrade your hardware, and research new techniques to win market share from Google, OpenAI, and Anthropic. Keep an eye on server temperatures to prevent overheating, and complete contracts to earn cash. Good luck.',
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
      hype: 10,
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
    marketContracts: [
      { id: 'c1', client: 'Alpha Corp', requirement: { stat: 'coding', value: 30 }, rewardPerTick: 4000, duration: 120, timeLeft: 120, activeModelId: null },
      { id: 'c2', client: 'EduLearn Inc', requirement: { stat: 'knowledge', value: 45 }, rewardPerTick: 7500, duration: 180, timeLeft: 180, activeModelId: null }
    ],
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
        body: 'Welcome! We have secured $1,000,000 in starting capital for your new company.\n\nYour goal is to build powerful AI models, upgrade your hardware, and research new techniques to win market share from Google, OpenAI, and Anthropic. Keep an eye on server temperatures to prevent overheating, and complete contracts to earn cash. Good luck.',
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

  toggleCloudGpus: (rentAmount) => set((state) => {
    const isRenting = state.infrastructure.cloudGpusRented > 0;
    const nextRented = isRenting ? 0 : rentAmount;
    const baseCompute = (state.infrastructure.gpus * 5) + (nextRented * 2.5);
    const leaseAdjustment = ((state.activeComputeLeases || []).filter(l => l.type === 'incoming').length - (state.activeComputeLeases || []).filter(l => l.type === 'outgoing').length) * 200;
    const newCompute = Math.max(0, baseCompute + leaseAdjustment);
    
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
      stats: { agentic: 10, coding: 10, reasoning: 10, knowledge: 15, math: 10, multilingual: 8, multimodal: 8 },
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

    const statSum = model.stats.agentic + model.stats.coding + model.stats.reasoning + model.stats.knowledge + model.stats.math + model.stats.multilingual + model.stats.multimodal;
    const rating = Math.max(10, Math.round(statSum / 7));
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

    if (modelVal < reqVal) return state;

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
    
    // 3. Train models progress
    let activeTrainingCount = 0;
    let totalTrainingGpus = 0;

    let nextLlms = state.llms.map(m => {
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
          // Training completed!
          const nextVer = m.version === 1.0 && m.status === 'draft' ? 1.0 : m.version + 1.0;
          
          const finalStats = { ...m.training.targetStats };

          nextEmails = [{
            id: 't_done_' + Date.now().toString(),
            sender: 'Facility Operations',
            subject: `Training Finished: ${m.name} v${nextVer.toFixed(1)}`,
            body: `Training is complete. Model '${m.name}' is now at version v${nextVer.toFixed(1)}.\n\nBenchmark Stats:\n- Agentic: ${finalStats.agentic}%\n- Coding: ${finalStats.coding}%\n- Reasoning: ${finalStats.reasoning}%\n- Knowledge: ${finalStats.knowledge}%\n- Math: ${finalStats.math}%\n- Multilingual: ${finalStats.multilingual}%\n- Multimodal: ${finalStats.multimodal}%\n\nThe model is ready to be released to the market or assigned to contracts.`,
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
            stats: finalStats,
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
      consumer: { basePrice: 15, weightStats: ['multilingual', 'knowledge'], userGrowthFactor: 1.5, computePerUser: 0.005, maxMarket: 50000 },
      dev: { basePrice: 5, weightStats: ['coding', 'reasoning'], userGrowthFactor: 0.8, computePerUser: 0.05, maxMarket: 5000 },
      business: { basePrice: 25, weightStats: ['agentic', 'coding'], userGrowthFactor: 0.2, computePerUser: 0.15, maxMarket: 1000 },
      enterprise: { basePrice: 5000, weightStats: ['math', 'reasoning'], userGrowthFactor: 0.005, computePerUser: 2.0, maxMarket: 50 }
    };

    let totalProductionGpus = 0;
    const updatedCountries = {};
    const modelAggregations = {};

    for (const [cid, country] of Object.entries(state.countries)) {
      let playerShare = country.playerShare || 0;
      let openaiShare = country.openaiShare || 0;
      let googleShare = country.googleShare || 0;
      let anthropicShare = country.anthropicShare || 0;

      if (anthropicJustActivated) {
        anthropicShare = 15;
        const totalRival = openaiShare + googleShare;
        if (totalRival > 0) {
          openaiShare = (openaiShare / totalRival) * (100 - playerShare - anthropicShare);
          googleShare = (googleShare / totalRival) * (100 - playerShare - anthropicShare);
        } else {
          openaiShare = (100 - playerShare - anthropicShare) * 0.6;
          googleShare = (100 - playerShare - anthropicShare) * 0.4;
        }
      }
      let latency = country.latency || 10;
      let satisfaction = country.satisfaction || 100;
      let playerUsers = 0;
      let gpusRequired = 0;

      const modelId = country.deployedModelId;
      const model = modelId ? nextLlms.find(m => m.id === modelId) : null;

      if (model && model.status === 'released' && model.targetSegment) {
        const cfg = segmentConfigs[model.targetSegment];
        const allocated = country.allocatedGpus || 0;
        
        // Quality score: mean of two weighted stats for segment
        const rating = (model.stats[cfg.weightStats[0]] + model.stats[cfg.weightStats[1]]) / 2;
        const qualityScore = Math.max(5, rating);

        // Competitor baseline quality score (best rival in that segment)
        let maxRivalScore = 30;
        state.rivals.forEach(r => {
          const rRating = (r.stats[cfg.weightStats[0]] + r.stats[cfg.weightStats[1]]) / 2;
          const rScore = Math.max(5, rRating);
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
        if (allocated === 0) {
          shareChange = -3.0; // Outage = severe decay
        } else if (competitiveness > 1.25) {
          shareChange = (competitiveness - 1) * hypeFactor * 1.5;
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
        
        // Normalize rival shares to fill the rest
        const totalRivalShare = openaiShare + googleShare + anthropicShare;
        if (totalRivalShare > 0) {
          openaiShare = (openaiShare / totalRivalShare) * (100 - playerShare);
          googleShare = (googleShare / totalRivalShare) * (100 - playerShare);
          anthropicShare = (anthropicShare / totalRivalShare) * (100 - playerShare);
        } else {
          openaiShare = (100 - playerShare) * 0.4;
          googleShare = (100 - playerShare) * 0.4;
          anthropicShare = (100 - playerShare) * 0.2;
        }

        playerUsers = Math.round(country.demand * (playerShare / 100));
        gpusRequired = Math.ceil(playerUsers * cfg.computePerUser);
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
        // Decay player share if no model deployed
        playerShare = Math.max(0, playerShare - 2);
        const totalRivalShare = openaiShare + googleShare + anthropicShare;
        if (totalRivalShare > 0) {
          openaiShare = (openaiShare / totalRivalShare) * (100 - playerShare);
          googleShare = (googleShare / totalRivalShare) * (100 - playerShare);
          anthropicShare = (anthropicShare / totalRivalShare) * (100 - playerShare);
        } else {
          openaiShare = (100 - playerShare) * 0.4;
          googleShare = (100 - playerShare) * 0.4;
          anthropicShare = (100 - playerShare) * 0.2;
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
          const statNames = ['agentic', 'coding', 'reasoning', 'knowledge', 'math', 'multilingual', 'multimodal'];
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
        data: (state.resources.data || 0) + 2,
        compute: nextCompute,
        hype: nextHype,
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
      marketContracts: nextContracts,
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
