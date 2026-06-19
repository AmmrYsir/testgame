import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TECH_PREREQS = {
  moe: 'transformer',
  ssm: 'transformer',
  liquid_nn: 'ssm',
  synthetic_data: 'textbook_acquisition',
  multimodal_tokenizers: 'synthetic_data',
  dpo: 'rlhf',
  constitutional_ai: 'dpo',
  speculative_decoding: 'fp8_quantization',
  flash_attention: 'speculative_decoding'
};

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
  US: { name: 'United States', demand: 25000, playerShare: 0, openaiShare: 40, googleShare: 40, anthropicShare: 0, allocatedGpus: 0, deployedModelId: null, latency: 10, satisfaction: 100, openMarkets: { player: false, openai: true, google: true, anthropic: false } },
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
        unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
        activeResearch: null, // null or { techId, progress, totalTicks, fundingPerTick }
      },

      // Contracts Board
      marketContracts: [],

      // Rivals
      rivals: [
        {
          name: 'Google',
          bestModel: 'None',
          share: 30,
          color: '#4285F4',
          logo: 'search',
          yearEst: 1998,
          active: true,
          cash: 30000000,
          compute: 8500,
          data: 1200,
          stats: { agentic: 20, coding: 30, reasoning: 25, knowledge: 45, math: 25, multilingual: 35, multimodal: 30 },
          models: [],
          unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
          activeResearch: null,
          activeTraining: {
            modelName: 'Gemini 1.0',
            progress: 90,
            totalTicks: 180,
            datasetType: 'web_dump',
            targetStats: { agentic: 22, coding: 32, reasoning: 26, knowledge: 50, math: 26, multilingual: 40, multimodal: 33 },
            cost: 15640
          },
          price: 15
        },
        {
          name: 'OpenAI',
          bestModel: 'None',
          share: 60,
          color: '#4b5563',
          logo: 'smart_toy',
          yearEst: 2015,
          active: true,
          cash: 15000000,
          compute: 6000,
          data: 500,
          stats: { agentic: 25, coding: 20, reasoning: 30, knowledge: 35, math: 15, multilingual: 20, multimodal: 15 },
          models: [],
          unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
          activeResearch: null,
          activeTraining: {
            modelName: 'GPT 1.0',
            progress: 60,
            totalTicks: 180,
            datasetType: 'web_dump',
            targetStats: { agentic: 27, coding: 22, reasoning: 31, knowledge: 40, math: 16, multilingual: 25, multimodal: 18 },
            cost: 15640
          },
          price: 15
        },
        {
          name: 'Anthropic',
          bestModel: 'None',
          share: 0,
          color: '#ea580c',
          logo: 'radar',
          yearEst: 2021,
          active: false,
          cash: 8000000,
          compute: 3500,
          data: 300,
          stats: { agentic: 30, coding: 25, reasoning: 35, knowledge: 40, math: 20, multilingual: 25, multimodal: 20 },
          models: [],
          unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
          activeResearch: null,
          activeTraining: null,
          price: 15
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
          unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
          activeResearch: null,
        },
        marketContracts: [],
        rivals: [
          {
            name: 'Google',
            bestModel: 'None',
            share: 30,
            color: '#4285F4',
            logo: 'search',
            yearEst: 1998,
            active: true,
            cash: 30000000,
            compute: 8500,
            data: 1200,
            stats: { agentic: 20, coding: 30, reasoning: 25, knowledge: 45, math: 25, multilingual: 35, multimodal: 30 },
            models: [],
            unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
            activeResearch: null,
            activeTraining: {
              modelName: 'Gemini 1.0',
              progress: 90,
              totalTicks: 180,
              datasetType: 'web_dump',
              targetStats: { agentic: 22, coding: 32, reasoning: 26, knowledge: 50, math: 26, multilingual: 40, multimodal: 33 },
              cost: 15640
            },
            price: 15
          },
          {
            name: 'OpenAI',
            bestModel: 'None',
            share: 60,
            color: '#4b5563',
            logo: 'smart_toy',
            yearEst: 2015,
            active: true,
            cash: 15000000,
            compute: 6000,
            data: 500,
            stats: { agentic: 25, coding: 20, reasoning: 30, knowledge: 35, math: 15, multilingual: 20, multimodal: 15 },
            models: [],
            unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
            activeResearch: null,
            activeTraining: {
              modelName: 'GPT 1.0',
              progress: 60,
              totalTicks: 180,
              datasetType: 'web_dump',
              targetStats: { agentic: 27, coding: 22, reasoning: 31, knowledge: 40, math: 16, multilingual: 25, multimodal: 18 },
              cost: 15640
            },
            price: 15
          },
          {
            name: 'Anthropic',
            bestModel: 'None',
            share: 0,
            color: '#ea580c',
            logo: 'radar',
            yearEst: 2021,
            active: false,
            cash: 8000000,
            compute: 3500,
            data: 300,
            stats: { agentic: 30, coding: 25, reasoning: 35, knowledge: 40, math: 20, multilingual: 25, multimodal: 20 },
            models: [],
            unlockedTech: ['transformer', 'web_crawling', 'instruction_sft'],
            activeResearch: null,
            activeTraining: null,
            price: 15
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
          .trim() || 'Grox';

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

        // Safety check: is dataset unlocked?
        if (datasetType === 'textbooks' && !state.research.unlockedTech.includes('textbook_acquisition')) return state;
        if (datasetType === 'synthetic' && !state.research.unlockedTech.includes('synthetic_data')) return state;
        if (datasetType === 'rlhf_align' && !state.research.unlockedTech.includes('rlhf')) return state;

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
        if (model.architecture === 'liquid_nn') archMultiplier = 1.6;

        // Apply alignment multipliers
        let alignmentMultiplier = state.research.unlockedTech.includes('dpo') ? 1.15 : 1.0;

        const baseGains = epochs * 3 * archMultiplier * alignmentMultiplier;

        let extraReasoning = state.research.unlockedTech.includes('constitutional_ai') ? 5 : 0;
        let extraAgentic = state.research.unlockedTech.includes('constitutional_ai') ? 5 : 0;
        let extraMultimodal = state.research.unlockedTech.includes('multimodal_tokenizers') ? 5 : 0;

        const targetStats = {
          agentic: Math.min(100, model.stats.agentic + Math.round(baseGains + statBonus.agentic) + extraAgentic),
          coding: Math.min(100, model.stats.coding + Math.round(baseGains + statBonus.coding)),
          reasoning: Math.min(100, model.stats.reasoning + Math.round(baseGains + statBonus.reasoning) + extraReasoning),
          knowledge: Math.min(100, model.stats.knowledge + Math.round(baseGains + statBonus.knowledge)),
          math: Math.min(100, model.stats.math + Math.round(baseGains + statBonus.math)),
          multilingual: Math.min(100, model.stats.multilingual + Math.round(baseGains + statBonus.multilingual)),
          multimodal: Math.min(100, model.stats.multimodal + Math.round(baseGains + statBonus.multimodal) + extraMultimodal)
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

      finalizeModelTraining: (modelId, versionLabel) => set((state) => {
        const model = state.llms.find(m => m.id === modelId);
        if (!model || model.status !== 'trained_pending' || !model.trainingCompletion) return {};

        const finalStats = model.trainingCompletion.newStats;
        const finalVer = versionLabel.trim() || model.version;

        const statSum = finalStats.agentic + finalStats.coding + finalStats.reasoning + finalStats.knowledge + finalStats.math + finalStats.multilingual + finalStats.multimodal;
        const rating = Math.max(10, Math.round(statSum / 7));
        const fansGained = Math.min(30, Math.round(rating * 0.15));

        const emailSubject = `Model Released: ${model.name} v${finalVer}`;
        const emailBody = `We have successfully trained and released your model '${model.name}' v${finalVer} for global commercial use.\n\nModel stats:\n- Score: ${rating.toFixed(0)}\n- Fans gained: +${fansGained}\n- Price: $15/month subscription (automated standard pricing).\n\nYour compute capacity has been dynamically allocated to serve incoming regional user traffic.`;

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
          text: `Training Complete: '${model.name}' v${finalVer} successfully released globally!`,
          iconColor: 'text-[#10b981]'
        }, ...state.newsFeed];

        return {
          llms: state.llms.map(m => m.id === modelId ? {
            ...m,
            status: 'released',
            version: finalVer,
            stats: finalStats,
            training: null,
            trainingCompletion: null,
            priceTag: 15,
            targetSegment: 'global',
            productionGpus: 0,
            marketMetrics: {
              users: 100,
              gpusRequired: 0,
              latency: 10,
              satisfaction: 100
            }
          } : m),
          resources: { ...state.resources, fans: Math.min(100, state.resources.fans + fansGained) },
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

        // Prerequisite check
        const prereq = TECH_PREREQS[techId];
        if (prereq && !state.research.unlockedTech.includes(prereq)) {
          return state; // Prerequisite not unlocked yet
        }

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

      initializeAllCountries: (countryList) => set((state) => {
        const nextCountries = { ...state.countries };
        let changed = false;

        const anthropicRival = state.rivals.find(r => r.name === 'Anthropic');
        const isAnthropicActive = anthropicRival ? anthropicRival.active : false;

        countryList.forEach(({ id, name }) => {
          if (!nextCountries[id]) {
            changed = true;
            const demand = Math.floor(Math.random() * 8000) + 2000;

            let openaiShare = Math.floor(Math.random() * 15) + 45; // 45-60
            let googleShare = 100 - openaiShare;
            let anthropicShare = 0;

            if (isAnthropicActive) {
              anthropicShare = Math.floor(Math.random() * 15) + 15; // 15-30
              const totalRival = openaiShare + googleShare;
              openaiShare = (openaiShare / totalRival) * (100 - anthropicShare);
              googleShare = (googleShare / totalRival) * (100 - anthropicShare);
            }

            nextCountries[id] = {
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
            };
          }
        });

        if (!changed) return {};
        return { countries: nextCountries };
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
            active: true,
            bestModel: 'Sonnet 1.0',
            models: [
              { name: 'Sonnet 1.0', stats: { ...nextRivals[anthropicIndex].stats } }
            ]
          };

          nextNewsFeed = [{
            tick: currentTick,
            type: 'public',
            text: "INDUSTRY ALERT: Anthropic has been established by former researchers. They enter the market with Sonnet 1.0!",
            iconColor: 'text-purple-400'
          }, ...nextNewsFeed];

          nextEmails = [{
            id: 'rival_anthropic_' + Date.now().toString(),
            sender: 'AI Market Intelligence',
            subject: 'New Competitor Detected: Anthropic',
            body: `Industry Alert:\n\nAnthropic has been officially founded. Led by former senior researchers, they are entering the market with a strong focus on alignment and safety.\n\nThey have deployed their Sonnet 1.0 model, which is highly competitive in reasoning, coding, and safety benchmarks. We must step up our own research to maintain competitiveness.`,
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

            const techDetails = {
              moe: { name: 'Mixture of Experts (MoE)', desc: 'This sparse activation architecture dynamically routes inputs to specialized sub-networks. Models will compile with a faster training speed.' },
              ssm: { name: 'State Space Models (SSM/Mamba)', desc: 'A linear-time alternative to transformers that processes long sequences extremely efficiently. Training speed is significantly boosted.' },
              liquid_nn: { name: 'Liquid Neural Networks', desc: 'Inspired by biological brains, this architecture dynamically adapts its weights during inference. Massive boost to training speed.' },
              textbook_acquisition: { name: 'Textbook Corpus Acquisition', desc: 'Licensed educational textbook materials are now integrated, unlocking high-quality knowledge and reasoning training datasets.' },
              synthetic_data: { name: 'Synthetic Reasoning Generation', desc: 'Enables LLM-assisted dataset generation, filtering out high-quality logic proofs to unlock the Synthetic Reasoning Data training corpus.' },
              multimodal_tokenizers: { name: 'Multimodal Data Tokenizers', desc: 'Synchronized visual-text tokenization enhances multimodal training outputs by +5%.' },
              rlhf: { name: 'RLHF Alignment', desc: 'Reinforcement Learning from Human Feedback. Unlocks professional human evaluation and preference datasets for model training.' },
              dpo: { name: 'Direct Preference Optimization (DPO)', desc: 'Replaces complex policy reinforcement loops with direct preference losses, boosting SFT/RLHF alignment gains by +15%.' },
              constitutional_ai: { name: 'Constitutional AI', desc: 'Enables automated AI-critique feedback loops. Boosts reasoning and agentic scores by +5% on training runs.' },
              fp8_quantization: { name: 'FP8 Quantization', desc: 'Downscales weights to 8-bit precision, reducing the physical GPU node requirements for model routing by 20%.' },
              speculative_decoding: { name: 'Speculative Decoding', desc: 'Uses a smaller draft model to pre-verify sequences, accelerating response latency under high load spikes.' },
              flash_attention: { name: 'FlashAttention', desc: 'Optimizes GPU memory-access routines to reduce compute footprint by a cumulative 40%.' }
            };

            const techInfo = techDetails[nextActiveResearch.techId] || { name: nextActiveResearch.techId.toUpperCase(), desc: 'This technology is now available.' };

            // Send email
            nextEmails = [{
              id: 'r_done_' + Date.now().toString(),
              sender: 'Labs Director',
              subject: `Research Completed: ${techInfo.name}`,
              body: `Good news! Our research team has finished studying ${techInfo.name}.\n\n${techInfo.desc}\n\nYou can see its benefits active in model development or training panels.`,
              tick: currentTick,
              read: false,
              reward: null,
              claimed: false
            }, ...nextEmails];

            nextNewsFeed = [{
              tick: currentTick,
              type: 'science',
              text: `Research Complete: Unlocked ${techInfo.name}!`,
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

        // 4. Global compute pooling and auto-routing calculation
        let totalGpusRequired = 0;
        let computePerUser = nextUnlockedTech.includes('flash_attention') ? 0.006 : nextUnlockedTech.includes('fp8_quantization') ? 0.008 : 0.01;
        
        Object.values(state.countries).forEach(c => {
          if (c.openMarkets?.player && c.deployedModelId) {
            const users = c.playerUsers || 0;
            totalGpusRequired += Math.ceil(users * computePerUser);
          }
        });

        const totalGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
        const activeTrainingGpus = nextLlms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
        const totalIdleGpus = Math.max(0, totalGpus - activeTrainingGpus);
        const adequacy = totalIdleGpus >= totalGpusRequired ? 1.0 : (totalIdleGpus / Math.max(1, totalGpusRequired));

        // Find best player released model to auto-deploy
        const playerReleasedModels = nextLlms.filter(m => m.status === 'released');
        const bestModel = playerReleasedModels.length > 0 ? [...playerReleasedModels].sort((a, b) => {
          const aRating = (a.stats.agentic + a.stats.coding + a.stats.reasoning + a.stats.knowledge + a.stats.math + a.stats.multilingual + a.stats.multimodal) / 7;
          const bRating = (b.stats.agentic + b.stats.coding + b.stats.reasoning + b.stats.knowledge + b.stats.math + b.stats.multilingual + b.stats.multimodal) / 7;
          return bRating - aRating;
        })[0] : null;

        const updatedCountries = {};
        let googleRevTotal = 0;
        let openaiRevTotal = 0;
        let anthropicRevTotal = 0;

        for (const [cid, country] of Object.entries(state.countries)) {
          const isOpenPlayer = country.openMarkets?.player;
          const isOpenOpenai = country.openMarkets?.openai;
          const isOpenGoogle = country.openMarkets?.google;
          let isOpenAnthropic = country.openMarkets?.anthropic || anthropicJustActivated;

          // Auto-route player model
          const playerModelId = bestModel && isOpenPlayer ? bestModel.id : null;

          // Competitiveness calculations
          let scorePlayer = 0;
          if (isOpenPlayer && bestModel && totalIdleGpus > 0) {
            const rating = (bestModel.stats.agentic + bestModel.stats.coding + bestModel.stats.reasoning + bestModel.stats.knowledge + bestModel.stats.math + bestModel.stats.multilingual + bestModel.stats.multimodal) / 7;
            scorePlayer = (rating / 15) * (country.satisfaction / 100);
          }

          let scoreGoogle = 0;
          const googleRival = nextRivals.find(r => r.name === 'Google');
          if (googleRival && isOpenGoogle) {
            const rating = (googleRival.stats.agentic + googleRival.stats.coding + googleRival.stats.reasoning + googleRival.stats.knowledge + googleRival.stats.math + googleRival.stats.multilingual + googleRival.stats.multimodal) / 7;
            scoreGoogle = rating / (googleRival.price || 15);
          }

          let scoreOpenai = 0;
          const openaiRival = nextRivals.find(r => r.name === 'OpenAI');
          if (openaiRival && isOpenOpenai) {
            const rating = (openaiRival.stats.agentic + openaiRival.stats.coding + openaiRival.stats.reasoning + openaiRival.stats.knowledge + openaiRival.stats.math + openaiRival.stats.multilingual + openaiRival.stats.multimodal) / 7;
            scoreOpenai = rating / (openaiRival.price || 15);
          }

          let scoreAnthropic = 0;
          const anthropicRival = nextRivals.find(r => r.name === 'Anthropic');
          if (anthropicRival && anthropicRival.active && isOpenAnthropic) {
            const rating = (anthropicRival.stats.agentic + anthropicRival.stats.coding + anthropicRival.stats.reasoning + anthropicRival.stats.knowledge + anthropicRival.stats.math + anthropicRival.stats.multilingual + anthropicRival.stats.multimodal) / 7;
            scoreAnthropic = rating / (anthropicRival.price || 15);
          }

          // Target shares based on competitiveness
          const totalScore = scorePlayer + scoreGoogle + scoreOpenai + scoreAnthropic;
          let targetPlayer = country.playerShare || 0;
          let targetGoogle = country.googleShare || 60;
          let targetOpenai = country.openaiShare || 40;
          let targetAnthropic = country.anthropicShare || 0;

          if (totalScore > 0) {
            targetPlayer = (scorePlayer / totalScore) * 100;
            targetGoogle = (scoreGoogle / totalScore) * 100;
            targetOpenai = (scoreOpenai / totalScore) * 100;
            targetAnthropic = (scoreAnthropic / totalScore) * 100;
          }

          // Drift shares smoothly (2% adjustment per day)
          let playerShare = (country.playerShare || 0) + (targetPlayer - (country.playerShare || 0)) * 0.02;
          let googleShare = (country.googleShare || 0) + (targetGoogle - (country.googleShare || 0)) * 0.02;
          let openaiShare = (country.openaiShare || 0) + (targetOpenai - (country.openaiShare || 0)) * 0.02;
          let anthropicShare = (country.anthropicShare || 0) + (targetAnthropic - (country.anthropicShare || 0)) * 0.02;

          // Clamp and normalize
          playerShare = Math.max(0, Math.min(100, playerShare));
          googleShare = Math.max(0, Math.min(100, googleShare));
          openaiShare = Math.max(0, Math.min(100, openaiShare));
          anthropicShare = Math.max(0, Math.min(100, anthropicShare));

          const sumShare = playerShare + googleShare + openaiShare + anthropicShare;
          if (sumShare > 0) {
            playerShare = parseFloat(((playerShare / sumShare) * 100).toFixed(2));
            googleShare = parseFloat(((googleShare / sumShare) * 100).toFixed(2));
            openaiShare = parseFloat(((openaiShare / sumShare) * 100).toFixed(2));
            anthropicShare = parseFloat(((anthropicShare / sumShare) * 100).toFixed(2));
          }

          // Users
          const playerUsers = Math.round(country.demand * (playerShare / 100));
          const openaiUsers = Math.round(country.demand * (openaiShare / 100));
          const googleUsers = Math.round(country.demand * (googleShare / 100));
          const anthropicUsers = Math.round(country.demand * (anthropicShare / 100));

          const gpusRequired = Math.ceil(playerUsers * computePerUser);

          // Latency & satisfaction updates
          let latency = 10;
          let satisfaction = country.satisfaction || 100;

          if (!bestModel || totalIdleGpus === 0) {
            latency = 999;
            satisfaction = Math.max(0, satisfaction - 6);
          } else if (adequacy < 1.0) {
            latency = Math.round(10 / adequacy);
            satisfaction = Math.max(0, satisfaction - 3);
          } else {
            latency = 10;
            satisfaction = Math.min(100, satisfaction + 2);
          }

          // Calculate daily revenue
          let playerCountryRev = playerUsers * 15 * (satisfaction / 100);
          if (!bestModel || totalIdleGpus === 0) playerCountryRev = 0;

          cashChange += Math.round(playerCountryRev);
          googleRevTotal += Math.round(googleUsers * (googleRival?.price || 15));
          openaiRevTotal += Math.round(openaiUsers * (openaiRival?.price || 15));
          anthropicRevTotal += Math.round(anthropicUsers * (anthropicRival?.price || 15));

          updatedCountries[cid] = {
            ...country,
            playerShare,
            googleShare,
            openaiShare,
            anthropicShare,
            playerUsers,
            gpusRequired,
            allocatedGpus: gpusRequired, // Auto-allocated GPUs show in the UI
            deployedModelId: playerModelId,
            latency,
            satisfaction,
            openMarkets: {
              player: !!isOpenPlayer,
              google: !!isOpenGoogle,
              openai: !!isOpenOpenai,
              anthropic: !!isOpenAnthropic
            }
          };
        }

        nextLlms = nextLlms.map(m => {
          if (m.status === 'released') {
            const aggUsers = Object.values(updatedCountries).reduce((sum, c) => c.deployedModelId === m.id ? sum + c.playerUsers : sum, 0);
            const aggGpus = Object.values(updatedCountries).reduce((sum, c) => c.deployedModelId === m.id ? sum + c.gpusRequired : sum, 0);
            const openRegions = Object.values(updatedCountries).filter(c => c.deployedModelId === m.id);
            const avgLatency = openRegions.length > 0 ? Math.round(openRegions.reduce((sum, c) => sum + c.latency, 0) / openRegions.length) : 10;
            const avgSatisfaction = openRegions.length > 0 ? Math.round(openRegions.reduce((sum, c) => sum + c.satisfaction, 0) / openRegions.length) : 100;

            return {
              ...m,
              productionGpus: aggGpus,
              marketMetrics: {
                users: aggUsers,
                gpusRequired: aggGpus,
                latency: avgLatency,
                satisfaction: avgSatisfaction
              }
            };
          }
          return m;
        });

        // 5. Calculate Server Cluster Temperature
        let targetHeat = 20;
        const activeGpuLoad = activeTrainingGpus + (totalGpusRequired * 0.3);
        if (activeGpuLoad > 0) {
          targetHeat = Math.min(100, 20 + Math.round((activeGpuLoad / 12) / state.infrastructure.coolingLevel));
        }
        
        let currentHeat = state.infrastructure.serverHeat;
        if (currentHeat < targetHeat) {
          currentHeat = Math.min(100, currentHeat + 3);
        } else if (currentHeat > targetHeat) {
          currentHeat = Math.max(20, currentHeat - 2);
        }

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

        // Fans decay
        let nextFans = state.resources.fans;
        if (currentTick % 10 === 0) {
          nextFans = Math.max(5, nextFans - 1);
        }

        // 7. Active rival AI competitor operations & intelligence alerts
        const TECH_NAMES = {
          moe: 'Mixture of Experts (MoE)',
          ssm: 'State Space Models (SSM)',
          liquid_nn: 'Liquid Neural Networks',
          textbook_acquisition: 'Textbook Acquisition',
          synthetic_data: 'Synthetic Data Generation',
          multimodal_tokenizers: 'Multimodal Tokenizers',
          rlhf: 'RLHF Preference Alignment',
          dpo: 'Direct Preference Optimization (DPO)',
          constitutional_ai: 'Constitutional AI',
          fp8_quantization: 'FP8 Model Quantization',
          speculative_decoding: 'Speculative Decoding',
          flash_attention: 'FlashAttention Kernels'
        };

        const ALL_TECHS = [
          { id: 'moe', cost: 500000, ticks: 100, prereq: 'transformer' },
          { id: 'ssm', cost: 1500000, ticks: 180, prereq: 'transformer' },
          { id: 'liquid_nn', cost: 3000000, ticks: 240, prereq: 'ssm' },
          { id: 'textbook_acquisition', cost: 300000, ticks: 60, prereq: 'web_crawling' },
          { id: 'synthetic_data', cost: 800000, ticks: 100, prereq: 'textbook_acquisition' },
          { id: 'multimodal_tokenizers', cost: 1200000, ticks: 140, prereq: 'synthetic_data' },
          { id: 'rlhf', cost: 600000, ticks: 100, prereq: 'instruction_sft' },
          { id: 'dpo', cost: 1000000, ticks: 120, prereq: 'rlhf' },
          { id: 'constitutional_ai', cost: 1800000, ticks: 150, prereq: 'dpo' },
          { id: 'fp8_quantization', cost: 400000, ticks: 80, prereq: 'transformer' },
          { id: 'speculative_decoding', cost: 800000, ticks: 110, prereq: 'fp8_quantization' },
          { id: 'flash_attention', cost: 1200000, ticks: 140, prereq: 'speculative_decoding' }
        ];

        nextRivals = nextRivals.map(r => {
          if (!r.active) return r;

          let cash = r.cash || 0;
          let compute = r.compute || 1000;
          let data = r.data || 100;
          let price = r.price || 15;
          let activeResearch = r.activeResearch ? { ...r.activeResearch } : null;
          let activeTraining = r.activeTraining ? { ...r.activeTraining } : null;
          const unlockedTech = [...(r.unlockedTech || ['transformer', 'web_crawling', 'instruction_sft'])];
          const models = [...(r.models || [])];
          let bestModelName = r.bestModel || 'None';
          let rivalStats = { ...r.stats };

          // Add daily country revenue
          let rivalRev = 0;
          if (r.name === 'Google') rivalRev = googleRevTotal;
          else if (r.name === 'OpenAI') rivalRev = openaiRevTotal;
          else if (r.name === 'Anthropic') rivalRev = anthropicRevTotal;

          cash += rivalRev;

          // Passive crawl data
          const passiveCrawl = r.name === 'Google' ? 3 : 2;
          data += passiveCrawl;

          // 7.1 R&D (Research) Loop
          if (activeResearch) {
            cash -= activeResearch.fundingPerTick;
            activeResearch.progress++;

            if (activeResearch.progress >= activeResearch.totalTicks) {
              // Unlock tech
              unlockedTech.push(activeResearch.techId);
              const techName = TECH_NAMES[activeResearch.techId] || activeResearch.techId;

              nextNewsFeed = [{
                tick: currentTick,
                type: 'science',
                text: `R&D Breakthrough: ${r.name} has completed research on ${techName}!`,
                iconColor: 'text-primary'
              }, ...nextNewsFeed];

              nextEmails = [{
                id: `intel_rd_done_${r.name}_${Date.now()}`,
                sender: 'AI Market Intelligence',
                subject: `Competitor R&D: ${r.name} unlocks ${techName}`,
                body: `Market Update:\n\nOur intelligence reports that ${r.name} has successfully completed research on '${techName}'.\n\nThey have added this technology to their active development pipeline, which will improve their future model capabilities.`,
                tick: currentTick,
                read: false,
                reward: null,
                claimed: false
              }, ...nextEmails];

              activeResearch = null;
            }
          } else {
            // Find a valid research candidate
            const candidates = ALL_TECHS.filter(t => !unlockedTech.includes(t.id) && unlockedTech.includes(t.prereq));
            if (candidates.length > 0 && cash > candidates[0].cost * 1.5 && Math.random() < 0.02) {
              const targetTech = candidates[0];
              activeResearch = {
                techId: targetTech.id,
                progress: 0,
                totalTicks: targetTech.ticks,
                fundingPerTick: Math.round(targetTech.cost / targetTech.ticks)
              };

              const techName = TECH_NAMES[targetTech.id] || targetTech.id;
              nextEmails = [{
                id: `intel_rd_start_${r.name}_${Date.now()}`,
                sender: 'AI Market Intelligence',
                subject: `Competitor R&D: ${r.name} targets ${techName}`,
                body: `Market Update:\n\nOur sources indicate that ${r.name} has allocated funding and researchers to study '${techName}'.\n\nThey are estimated to finish this research in ${targetTech.ticks} days.`,
                tick: currentTick,
                read: false,
                reward: null,
                claimed: false
              }, ...nextEmails];
            }
          }

          // 7.2 Hardware Expansion Loop
          if (cash > 500000 && Math.random() < 0.02) {
            cash -= 150000;
            compute += 320;

            nextNewsFeed = [{
              tick: currentTick,
              type: 'memory',
              text: `${r.name} expanded their data center infrastructure, adding +320 PFLOPS compute.`,
              iconColor: 'text-outline-variant'
            }, ...nextNewsFeed];
          }

          // 7.3 Model Training Loop
          if (activeTraining) {
            activeTraining.progress++;

            if (activeTraining.progress >= activeTraining.totalTicks) {
              // Complete training and release model
              models.push({
                name: activeTraining.modelName,
                stats: activeTraining.targetStats
              });
              bestModelName = activeTraining.modelName;
              rivalStats = { ...activeTraining.targetStats };

              nextNewsFeed = [{
                tick: currentTick,
                type: 'check_circle',
                text: `${r.name} has released a new model: ${activeTraining.modelName}!`,
                iconColor: 'text-[#10b981]'
              }, ...nextNewsFeed];

              nextEmails = [{
                id: `intel_train_done_${r.name}_${Date.now()}`,
                sender: 'AI Market Intelligence',
                subject: `Competitor Release: ${r.name} launches ${activeTraining.modelName}`,
                body: `Industry Alert:\n\n${r.name} has officially released its new flagship model: '${activeTraining.modelName}'.\n\nBenchmark Stats:\n- Agentic: ${rivalStats.agentic}%\n- Coding: ${rivalStats.coding}%\n- Reasoning: ${rivalStats.reasoning}%\n- Knowledge: ${rivalStats.knowledge}%\n- Math: ${rivalStats.math}%\n- Multilingual: ${rivalStats.multilingual}%\n- Multimodal: ${rivalStats.multimodal}%\n\nThis update improves their market competitiveness globally.`,
                tick: currentTick,
                read: false,
                reward: null,
                claimed: false
              }, ...nextEmails];

              activeTraining = null;
            }
          } else {
            // Train a new model (0.5% chance per tick if cash > $300k)
            if (cash > 300000 && Math.random() < 0.005) {
              let datasetType = 'web_dump';
              let datasetCost = 15000;
              let datasetBonus = { agentic: 2, coding: 2, reasoning: 1, knowledge: 5, math: 1, multilingual: 5, multimodal: 3 };

              if (unlockedTech.includes('rlhf')) {
                datasetType = 'rlhf_align';
                datasetCost = 350000;
                datasetBonus = { agentic: 15, coding: 10, reasoning: 12, knowledge: 15, math: 10, multilingual: 8, multimodal: 10 };
              } else if (unlockedTech.includes('synthetic_data')) {
                datasetType = 'synthetic';
                datasetCost = 200000;
                datasetBonus = { agentic: 8, coding: 20, reasoning: 15, knowledge: 10, math: 20, multilingual: 3, multimodal: 5 };
              } else if (unlockedTech.includes('textbook_acquisition')) {
                datasetType = 'textbooks';
                datasetCost = 80000;
                datasetBonus = { agentic: 3, coding: 8, reasoning: 8, knowledge: 12, math: 8, multilingual: 6, multimodal: 4 };
              }

              // Calculate stat gains
              let archMultiplier = 1.0;
              if (unlockedTech.includes('moe')) archMultiplier = 1.25;
              if (unlockedTech.includes('ssm')) archMultiplier = 1.4;
              if (unlockedTech.includes('liquid_nn')) archMultiplier = 1.6;

              const alignmentMultiplier = unlockedTech.includes('dpo') ? 1.15 : 1.0;
              const baseGains = Math.round(9 * archMultiplier * alignmentMultiplier);

              const extraReasoning = unlockedTech.includes('constitutional_ai') ? 5 : 0;
              const extraAgentic = unlockedTech.includes('constitutional_ai') ? 5 : 0;
              const extraMultimodal = unlockedTech.includes('multimodal_tokenizers') ? 5 : 0;

              const targetStats = {
                agentic: Math.min(100, rivalStats.agentic + baseGains + datasetBonus.agentic + extraAgentic),
                coding: Math.min(100, rivalStats.coding + baseGains + datasetBonus.coding),
                reasoning: Math.min(100, rivalStats.reasoning + baseGains + datasetBonus.reasoning + extraReasoning),
                knowledge: Math.min(100, rivalStats.knowledge + baseGains + datasetBonus.knowledge),
                math: Math.min(100, rivalStats.math + baseGains + datasetBonus.math),
                multilingual: Math.min(100, rivalStats.multilingual + baseGains + datasetBonus.multilingual),
                multimodal: Math.min(100, rivalStats.multimodal + baseGains + datasetBonus.multimodal + extraMultimodal)
              };

              const isFirst = !bestModelName || bestModelName === 'None';
              const nextVer = isFirst ? 1.0 : (parseFloat(bestModelName.split(' ')[1]) || 1.0) + 0.5;
              const series = r.name === 'OpenAI' ? 'GPT' : r.name === 'Google' ? 'Gemini' : 'Sonnet';
              const modelName = `${series} ${nextVer.toFixed(1)}`;

              const totalCost = datasetCost + 3840; // baseline 128 GPUs cost
              cash -= totalCost;

              activeTraining = {
                modelName,
                progress: 0,
                totalTicks: 180,
                datasetType,
                targetStats,
                cost: totalCost
              };

              nextEmails = [{
                id: `intel_train_start_${r.name}_${Date.now()}`,
                sender: 'AI Market Intelligence',
                subject: `Competitor Training: ${r.name} begins training ${modelName}`,
                body: `Market Update:\n\nOur sources indicate that ${r.name} has initiated a new pre-training run for '${modelName}' using a '${datasetType}' dataset.\n\nThey have reserved compute and the run is expected to complete in 180 days.`,
                tick: currentTick,
                read: false,
                reward: null,
                claimed: false
              }, ...nextEmails];
            }
          }

          // 7.4 Dynamic pricing adjustment (cut price if losing share, raise if dominanting)
          if (currentTick > 0 && currentTick % 30 === 0 && bestModelName !== 'None') {
            const lastShare = r.share || 0;
            if (lastShare < 15 && price > 8) {
              price -= 1;
              nextNewsFeed = [{
                tick: currentTick,
                type: 'warning',
                text: `${r.name} has cut their model price to $${price}/mo subscription to retain users!`,
                iconColor: 'text-[#eab308]'
              }, ...nextNewsFeed];
            } else if (lastShare > 35 && cash < 200000 && price < 30) {
              price += 1;
              nextNewsFeed = [{
                tick: currentTick,
                type: 'public',
                text: `${r.name} has raised subscription prices to $${price}/mo to boost compute expansion.`,
                iconColor: 'text-primary'
              }, ...nextNewsFeed];
            }
          }

          return {
            ...r,
            cash,
            compute,
            data,
            price,
            activeResearch,
            activeTraining,
            unlockedTech,
            models,
            bestModel: bestModelName,
            stats: rivalStats
          };
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
