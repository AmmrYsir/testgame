import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Game Flow State
  gameStage: 'menu', // 'menu', 'newGameSetup', 'playing'
  simulationSpeed: 1, // 0 = paused, 1 = normal, 2 = fast, 3 = very fast
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
    { name: 'OpenAI', bestModel: 'GPT-4.0', share: 60, stats: { knowledge: 75, coding: 80, math: 75, creativity: 70, hallucination: 5 } },
    { name: 'Anthropic', bestModel: 'Claude 3.5 Sonnet', share: 30, stats: { knowledge: 80, coding: 75, math: 70, creativity: 80, hallucination: 3 } }
  ],

  // Mailbox System
  emails: [
    {
      id: 'welcome_email',
      sender: 'Corporate Board',
      subject: 'Founders Memo: Welcome to the AI Race',
      body: 'Initialization protocol complete. We have secured $1,000,000 in starting seed capital for your venture.\n\nYour mandate is clear: acquire GPU cluster hardware, fund progressive lab research pipelines, and align advanced neural weights to build models that dominate the commercial B2B contract board. Watch your server heat index carefully, and beware of OpenAI and Anthropic—they are aggressively expanding their frontrunner model benchmarks. Good luck.',
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
      revenuePerTick: 0
    };
    return {
      llms: [...state.llms, newModel],
      newsFeed: [{ tick: state.resources.currentTick, type: 'schema', text: `Model configuration profile '${name}' initialized. Ready for training.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

  startTraining: (modelId, allocatedGpus, epochs, datasetType) => set((state) => {
    // Check if model exists
    const model = state.llms.find(m => m.id === modelId);
    if (!model || model.status === 'training') return state;

    // Check available GPUs
    const activeTrainingGpus = state.llms.reduce((sum, m) => sum + (m.training?.allocatedGpus || 0), 0);
    const totalAvailableGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
    const idleGpus = totalAvailableGpus - activeTrainingGpus;

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

  releaseLLM: (modelId, releaseType) => set((state) => {
    const model = state.llms.find(m => m.id === modelId);
    if (!model || model.status === 'training' || model.status === 'draft') return state;

    // Calculate revenue yield
    const statSum = model.stats.knowledge + model.stats.coding + model.stats.math + model.stats.creativity;
    const penalty = model.stats.hallucination * 2.5;
    const rating = Math.max(10, statSum - penalty);

    let rev = 0;
    let hypeGained = 0;

    if (releaseType === 'b2b') {
      rev = Math.round(rating * 150);
      hypeGained = Math.floor(rating * 0.1);
    } else {
      rev = Math.round(rating * 40);
      hypeGained = Math.floor(rating * 0.4);
    }

    const emailSubject = `Model Publicly Deployed: ${model.name} v${model.version.toFixed(1)}`;
    const emailBody = `Operations team has successfully published your model '${model.name}' v${model.version.toFixed(1)} weights to the ${releaseType === 'b2b' ? 'Enterprise B2B API gateway' : 'B2C public app store'}.\n\nModel stats at deployment:\n- Rating score: ${rating.toFixed(0)}\n- Hype gained: +${hypeGained}\n- Revenue yield: +$${rev.toLocaleString()}/tick.`;

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
      llms: state.llms.map(m => m.id === modelId ? { ...m, status: 'released', releaseType, revenuePerTick: rev } : m),
      resources: { ...state.resources, hype: Math.min(100, state.resources.hype + hypeGained) },
      emails: [newEmail, ...state.emails],
      newsFeed: [{ tick: state.resources.currentTick, type: 'public', text: `Released ${model.name} v${model.version.toFixed(1)} to the public. Expected revenue: $${rev.toLocaleString()}/day.`, iconColor: 'text-primary' }, ...state.newsFeed]
    };
  }),

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
          subject: `Research Completed: ${techName} Protocol Enabled`,
          body: `Superb news! Our research team has completed the study on '${techName}' after ${nextActiveResearch.totalTicks} ticks of progressive labs funding.\n\nThis framework has been officially deployed to our network architecture pipeline. You can now build and upgrade model profiles using these parameters.`,
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

    // 3. Train models progress and heat calculations
    let activeTrainingCount = 0;
    let totalAllocatedGpus = 0;

    const nextLlms = state.llms.map(m => {
      if (m.status === 'training' && m.training) {
        activeTrainingCount++;
        totalAllocatedGpus += m.training.allocatedGpus;
        
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
            subject: `Training Complete: ${m.name} v${nextVer.toFixed(1)}`,
            body: `Operations reports success. Model weights for '${m.name}' have been aligned and baked to version v${nextVer.toFixed(1)}.\n\nOptimized Benchmark Stats:\n- Knowledge: ${m.training.targetStats.knowledge}%\n- Coding: ${m.training.targetStats.coding}%\n- Math & Reasoning: ${m.training.targetStats.math}%\n- Creativity: ${m.training.targetStats.creativity}%\n- Hallucination: ${m.training.targetStats.hallucination}%\n\nThe model weights are hot and ready to release to public B2B/B2C channels or lease to private enterprise client contracts.`,
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

    // Calculate Heat Load
    let targetHeat = 20; // nominal base heat
    if (activeTrainingCount > 0) {
      targetHeat = Math.min(100, 20 + Math.round((totalAllocatedGpus / 12) / state.infrastructure.coolingLevel));
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
      // High heat has a 5% chance of disrupting a random active training run
      const trainingModel = nextLlms.find(m => m.status === 'training');
      if (trainingModel) {
        nextEmails = [{
          id: 't_abort_' + Date.now().toString(),
          sender: 'Facility Operations',
          subject: 'CRITICAL: GPU Cluster Thermal Shutdown Alert',
          body: `Emergency thermal failsafes triggered. Server temperatures exceeded the safety threshold of 85% (hit ${currentHeat}%). To prevent critical hardware degradation of GPU stacks, the active training pipeline for model '${trainingModel.name}' has been aborted.\n\nAll weights in training are lost. Action Required: Upgrade HVAC cooling facility level or allocate fewer GPUs to avoid thermal overloading.`,
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

    // 4. Contract payouts and time elapsed
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
            subject: `Contract Fulfilled: ${c.client}`,
            body: `Congratulations, lease contract with ${c.client} has been fully completed over the ${c.duration} day duration.\n\nThe client has released the model weights and wired the milestone completion bonus of $50,000 to our accounts. Claim the funding below to unlock it.`,
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

    // 5. Released model revenue
    let releasedRevenue = 0;
    nextLlms.forEach(m => {
      if (m.status === 'released') {
        releasedRevenue += m.revenuePerTick;
      }
    });
    cashChange += releasedRevenue;

    // Hype decay
    let nextHype = state.resources.hype;
    if (currentTick % 10 === 0) {
      nextHype = Math.max(5, nextHype - 1);
    }

    // Rival releases & Market updates
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
        subject: `RIVAL UPDATE: ${rival.name} deploys ${updatedRival.bestModel}`,
        body: `Market reports show ${rival.name} has launched a major version upgrade, releasing '${updatedRival.bestModel}' directly into production.\n\nThey have captured additional market share, rising to ${updatedRival.share}%. Their diagnostic metrics show high performance, particularly on ${statName.toUpperCase()} (${updatedRival.stats[statName]}%).\n\nUpgrade your models immediately to retain competitive positioning.`,
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

    // 6. Milestone Detections & VC Grant Emails
    const nextMilestones = { ...state.milestones };
    
    // GPU Milestone: 128 physical + cloud leased
    const currentTotalGpus = state.infrastructure.gpus + state.infrastructure.cloudGpusRented;
    if (currentTotalGpus >= 128 && !nextMilestones.gpu128) {
      nextMilestones.gpu128 = true;
      nextEmails = [{
        id: 'm_gpu_' + Date.now().toString(),
        sender: 'VC Lead Investor',
        subject: 'Compute Expansion Grant Milestone Reached',
        body: `We are thrilled to see you scale your compute infrastructure to over 128 GPUs. This is a critical compute density milestone that positions us to train next-generation backbones.\n\nThe investment board has approved a matching capital grant of $200,000 to assist in funding synthetic training or RLHF datasets.\n\nClaim the funding bonus below.`,
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
        subject: 'Series A Milestone: Hype Expansion Capital',
        body: `Your accounts have reached over $2,000,000 in capital reserves. This financial runway has sparked major press buzz, raising your brand valuation and industry standing.\n\nWe have coordinated an official PR release to capitalize on this hype milestone, yielding +25 Hype Index points.\n\nClaim below to announce.`,
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
}));
