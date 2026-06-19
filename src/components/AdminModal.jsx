import { useState } from 'react';
import { useGameStore } from '../store';

export default function AdminModal({ isOpen, onClose }) {
  const {
    subscriptionTiers,
    llms,
    countries,
    addSubscriptionTier,
    updateSubscriptionTier,
    deleteSubscriptionTier,
    freeModelId,
    setFreeModelId,
    analyticsHistory,
    feedbacks
  } = useGameStore();

  const [editingTierId, setEditingTierId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState(20);
  const [formModelId, setFormModelId] = useState('');
  const [formRateLimit, setFormRateLimit] = useState(100);
  const [formPriority, setFormPriority] = useState('normal');
  const [formSafety, setFormSafety] = useState('strict');

  if (!isOpen) return null;

  const releasedModels = llms.filter(m => m.status === 'released');

  // Global SaaS Stats
  const totalSubscribers = (subscriptionTiers || []).reduce((sum, t) => sum + (t.subscribers || 0), 0);
  const totalMrr = (subscriptionTiers || []).reduce((sum, t) => sum + (t.mrr || 0), 0);
  const totalFreeUsers = Object.values(countries || {}).reduce((sum, c) => sum + (c.tierUsers?.free || 0), 0);
  const totalRegisteredAccounts = totalFreeUsers + totalSubscribers;
  
  const activeTiersCount = (subscriptionTiers || []).filter(t => t.modelId).length;
  
  const avgSatisfaction = totalSubscribers > 0
    ? Math.round(
        (subscriptionTiers || []).reduce((sum, t) => sum + (t.satisfaction || 100) * (t.subscribers || 0), 0) / totalSubscribers
      )
    : 100;

  // Handle Form open
  const startEdit = (tier) => {
    setEditingTierId(tier.id);
    setIsCreating(false);
    setFormName(tier.name);
    setFormPrice(tier.price);
    setFormModelId(tier.modelId || '');
    setFormRateLimit(tier.rateLimit || 100);
    setFormPriority(tier.priority || 'normal');
    setFormSafety(tier.safety || 'strict');
  };

  const startCreate = () => {
    setEditingTierId(null);
    setIsCreating(true);
    setFormName('Pro Plus Plan');
    setFormPrice(30);
    setFormModelId(releasedModels[0]?.id || '');
    setFormRateLimit(250);
    setFormPriority('normal');
    setFormSafety('strict');
  };

  const cancelForm = () => {
    setEditingTierId(null);
    setIsCreating(false);
  };

  const saveForm = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const routedModelId = formModelId === '' ? null : formModelId;

    if (isCreating) {
      addSubscriptionTier(formName, formPrice, routedModelId, formRateLimit, formPriority, formSafety);
    } else {
      updateSubscriptionTier(editingTierId, {
        name: formName,
        price: Number(formPrice),
        modelId: routedModelId,
        rateLimit: Number(formRateLimit),
        priority: formPriority,
        safety: formSafety
      });
    }

    setEditingTierId(null);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-[#07090e]/80 backdrop-blur-md z-50 flex items-center justify-center p-md">
      <div className="bg-[#121620]/95 border border-white/10 rounded-2xl w-full max-w-[950px] h-[620px] shadow-2xl flex flex-col overflow-hidden animate-slide-in relative text-on-surface">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-lg py-md border-b border-white/5 bg-[#171c2a]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">dashboard</span>
            <div>
              <h2 className="font-display-md text-sm font-extrabold uppercase tracking-wider text-on-surface">SaaS Admin Panel</h2>
              <p className="font-mono text-[9px] text-outline uppercase tracking-wider mt-0.5">Subscription Tier & B2B Commercial Console</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Content - Dual Pane */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANE: Tier Management & Marketing */}
          <div className="w-[420px] border-r border-white/5 flex flex-col bg-[#141926]/20">
            {/* Tiers List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-sm">
              <div className="flex justify-between items-center px-sm">
                <span className="font-mono text-[10px] text-outline uppercase tracking-wider font-bold">Active Billings Plans</span>
                <button
                  type="button"
                  onClick={startCreate}
                  className="bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded hover:bg-primary/20 transition-all font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">add</span> Add Custom Tier
                </button>
              </div>

              <div className="space-y-xs mt-1">
                {(subscriptionTiers || []).map(tier => {
                  const routedModel = releasedModels.find(m => m.id === tier.modelId);
                  const isSelected = editingTierId === tier.id;
                  
                  return (
                    <div
                      key={tier.id}
                      onClick={() => startEdit(tier)}
                      className={`group p-md rounded-xl border transition-all cursor-pointer select-none flex flex-col gap-xs ${
                        isSelected
                          ? 'bg-primary/15 border-primary shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                          : 'bg-[#151a26]/75 hover:bg-[#1a2130] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                            {tier.name}
                            {tier.id === 'free' && (
                              <span className="text-[7.5px] px-1 bg-white/5 border border-white/10 rounded font-normal text-outline">DEFAULT</span>
                            )}
                          </h4>
                           <span className="font-mono text-[9.5px] text-outline block mt-0.5">
                             Route: {routedModel ? `${routedModel.name} v${routedModel.version}` : <span className="text-error/70 italic">Not Routed</span>}
                           </span>
                        </div>
                        <div className="text-right">
                          <span className="font-display font-bold text-xs text-primary">
                            {tier.price === 0 ? 'FREE' : `$${tier.price}`}
                          </span>
                          <span className="text-[9px] text-outline block font-mono">/mo</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-xs mt-2 pt-2 border-t border-white/5 text-center font-mono text-[9px]">
                        <div>
                          <span className="text-outline block text-[7.5px] uppercase">Subscribers</span>
                          <span className="font-bold text-on-surface">{(tier.subscribers || 0).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-outline block text-[7.5px] uppercase">MRR</span>
                          <span className="font-bold text-primary">${(tier.mrr || 0).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-outline block text-[7.5px] uppercase">Satisfaction</span>
                          <span className={`font-bold ${tier.satisfaction < 50 ? 'text-error' : tier.satisfaction < 80 ? 'text-tertiary' : 'text-secondary'}`}>
                            {tier.satisfaction}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FREE ACCOUNTS ROUTER CARD */}
            <div className="p-md border-t border-white/5 bg-[#171d2b]/60 flex flex-col gap-sm">
              <span className="font-mono text-[9.5px] text-outline uppercase tracking-wider font-bold flex items-center gap-1 text-left">
                <span className="material-symbols-outlined text-xs">router</span> Free Accounts Router
              </span>
              <div className="flex flex-col gap-1">
                <select
                  value={freeModelId || ''}
                  onChange={(e) => setFreeModelId(e.target.value || null)}
                  className="w-full bg-[#0b0e15] border border-white/10 rounded-lg p-2 font-sans text-xs text-on-surface focus:border-primary outline-none"
                >
                  <option value="">-- No Model Routed (FREE Tier Disabled) --</option>
                  {releasedModels.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} v{m.version} ({Math.round((m.stats.agentic + m.stats.coding + m.stats.reasoning + m.stats.knowledge + m.stats.math + m.stats.multilingual + m.stats.multimodal) / 7)}% avg)
                    </option>
                  ))}
                </select>
                <p className="font-mono text-[8px] text-outline/60 mt-1 leading-normal text-left">
                  Routes all non-paying registered users to this model. If disabled, free tier user growth is zero.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Editing Form or Overview */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-lg bg-[#0e111a]/40">
            {editingTierId || isCreating ? (
              /* BUILDER FORM */
              <form onSubmit={saveForm} className="space-y-lg flex flex-col h-full justify-between">
                <div className="space-y-md">
                  <div className="flex justify-between items-center border-b border-white/5 pb-sm">
                    <h3 className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
                      {isCreating ? 'Create Custom Tier' : 'Configure Tier Settings'}
                    </h3>
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="text-[10px] font-mono text-outline hover:text-on-surface hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Plan Name */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-mono text-[9px] text-outline uppercase tracking-wider" htmlFor="tierName">Tier Name</label>
                    <input
                      id="tierName"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="bg-[#0b0e15] border border-white/10 rounded-lg p-2.5 font-sans text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="e.g. Pro Plus"
                      type="text"
                      required
                    />
                  </div>

                  {/* Price & Routed Model */}
                  <div className="grid grid-cols-2 gap-md text-left">
                    {/* Price Slider */}
                    <div className="flex flex-col gap-1.5 bg-[#0b0e15]/40 border border-white/5 p-3 rounded-xl">
                      <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-outline mb-1">
                        <span>Pricing</span>
                        <span className="text-primary font-bold text-xs">
                          {formPrice === 0 ? 'FREE' : `$${formPrice}/mo`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="5"
                        value={formPrice}
                        onChange={(e) => setFormPrice(parseInt(e.target.value))}
                        className="w-full accent-primary cursor-pointer my-1"
                      />
                      <div className="flex justify-between font-mono text-[8px] text-outline/50 mt-1">
                        <span>Free (FREE)</span>
                        <span>Premium ($1,000)</span>
                      </div>
                    </div>

                    {/* Routed Model */}
                    <div className="flex flex-col gap-1.5 bg-[#0b0e15]/40 border border-white/5 p-3 rounded-xl">
                      <label className="font-mono text-[9px] text-outline uppercase tracking-wider block" htmlFor="routedModel">Routed Model</label>
                      <select
                        id="routedModel"
                        value={formModelId}
                        onChange={(e) => setFormModelId(e.target.value)}
                        className="w-full bg-[#0b0e15] border border-white/10 rounded-lg p-2 font-sans text-xs text-on-surface focus:border-primary outline-none mt-1"
                      >
                        <option value="">-- No Model Routed --</option>
                        {releasedModels.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} v{m.version} ({Math.round((m.stats.agentic + m.stats.coding + m.stats.reasoning + m.stats.knowledge + m.stats.math + m.stats.multilingual + m.stats.multimodal) / 7)}% avg)
                          </option>
                        ))}
                      </select>
                      <span className="font-mono text-[8px] text-outline/60 mt-1 block">
                        Routes subscriber queries to this trained neural model.
                      </span>
                    </div>
                  </div>

                  {/* Rate Limits & Quality Priority */}
                  <div className="grid grid-cols-2 gap-md text-left">
                    {/* Rate Limit Selector */}
                    <div className="flex flex-col gap-1.5 bg-[#0b0e15]/40 border border-white/5 p-3 rounded-xl">
                      <span className="font-mono text-[9px] text-outline uppercase tracking-wider block mb-1">Plan Rate Limit (queries/tick)</span>
                      <div className="grid grid-cols-5 gap-xs">
                        {[
                          { val: 5, lbl: '5' },
                          { val: 20, lbl: '20' },
                          { val: 100, lbl: '100' },
                          { val: 500, lbl: '500' },
                          { val: 9999, lbl: 'Unlim' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => setFormRateLimit(opt.val)}
                            className={`py-2 px-1 rounded-lg text-center font-mono text-[9.5px] transition-all cursor-pointer ${
                              formRateLimit === opt.val
                                ? 'bg-primary text-white font-bold'
                                : 'bg-[#0b0e15] border border-white/5 hover:bg-white/5 text-outline'
                            }`}
                          >
                            {opt.lbl}
                          </button>
                        ))}
                      </div>
                      <span className="font-mono text-[8px] text-outline/50 mt-1.5 block">
                        Higher limits attract developers but heavily load regional compute.
                      </span>
                    </div>

                    {/* Routing Priority */}
                    <div className="flex flex-col gap-1.5 bg-[#0b0e15]/40 border border-white/5 p-3 rounded-xl">
                      <span className="font-mono text-[9px] text-outline uppercase tracking-wider block mb-1">Queue Priority</span>
                      <div className="grid grid-cols-3 gap-xs">
                        {[
                          { id: 'low', label: 'Low', score: '0.8x' },
                          { id: 'normal', label: 'Normal', score: '1.0x' },
                          { id: 'high', label: 'High', score: '1.25x' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormPriority(opt.id)}
                            className={`py-2 px-1 rounded-lg text-center font-mono text-[9.5px] transition-all cursor-pointer flex flex-col items-center justify-center ${
                              formPriority === opt.id
                                ? 'bg-primary text-white font-bold'
                                : 'bg-[#0b0e15] border border-white/5 hover:bg-white/5 text-outline'
                            }`}
                          >
                            <span>{opt.label}</span>
                            <span className="text-[7.5px] opacity-60">{opt.score}</span>
                          </button>
                        ))}
                      </div>
                      <span className="font-mono text-[8px] text-outline/50 mt-1 block">
                        Affects value score. Higher priority channels bypass query latency.
                      </span>
                    </div>
                  </div>

                  {/* Safety & Content Moderation */}
                  <div className="flex flex-col gap-1.5 bg-[#0b0e15]/40 border border-white/5 p-3 rounded-xl text-left">
                    <span className="font-mono text-[9px] text-outline uppercase tracking-wider block mb-1">Content Safety Moderation Level</span>
                    <div className="grid grid-cols-3 gap-xs">
                      {[
                        { id: 'strict', label: 'Strict (Aligned)', desc: '0.9x Value, 0% PR Scandals' },
                        { id: 'moderate', label: 'Moderate', desc: '1.0x Value, Safe defaults' },
                        { id: 'none', label: 'None (Unfiltered)', desc: '1.15x Value, 1% Incident chance' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFormSafety(opt.id)}
                          className={`py-2 px-2 rounded-lg text-center font-mono text-[10px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            formSafety === opt.id
                              ? opt.id === 'none'
                                ? 'bg-error text-white font-bold'
                                : 'bg-primary text-white font-bold'
                              : 'bg-[#0b0e15] border border-white/5 hover:bg-white/5 text-outline'
                          }`}
                        >
                          <span className="font-bold">{opt.label}</span>
                          <span className="text-[7.5px] opacity-70">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                    {formSafety === 'none' && (
                      <div className="text-[8.5px] text-error bg-error/10 border border-error/25 p-2 rounded-lg mt-2 flex items-center gap-1.5 animate-pulse font-mono">
                        <span className="material-symbols-outlined text-xs">warning</span>
                        <span>WARNING: Bypassing safety filters unlocks full model capability (+15% value) but risks random legal and PR compliance actions ($50,000 fine per incident).</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between items-center border-t border-white/5 pt-md mt-lg">
                  <div>
                    {!isCreating && editingTierId !== 'free' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete the plan '${formName}'?`)) {
                            deleteSubscriptionTier(editingTierId);
                            setEditingTierId(null);
                          }
                        }}
                        className="bg-error/15 border border-error/25 text-error px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider hover:bg-error/25 transition-all font-bold cursor-pointer"
                      >
                        Delete Tier
                      </button>
                    )}
                  </div>

                  <div className="flex gap-sm">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="px-4 py-2 rounded-lg border border-white/10 text-outline hover:text-on-surface hover:bg-white/5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-[#2563eb] text-white px-5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all font-bold cursor-pointer"
                    >
                      Save Plan
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* GLOBAL SaaS CONSOLE OVERVIEW */
              <div className="space-y-md flex flex-col h-full overflow-hidden text-left">
                {/* Header */}
                <div className="border-b border-white/5 pb-xs flex justify-between items-center">
                  <h3 className="font-mono text-xs text-primary font-bold uppercase tracking-wider">SaaS Business Analytics</h3>
                  <span className="font-mono text-[9px] text-outline">LIVE CONSOLE</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-md">
                  {/* SaaS Metric Cards */}
                  <div className="grid grid-cols-3 gap-sm">
                    <div className="bg-[#0b0e15]/40 border border-white/5 p-md rounded-xl font-mono text-left relative overflow-hidden group hover:border-white/10 transition-all">
                      <span className="text-outline text-[9px] uppercase tracking-wider block">Total Registered</span>
                      <span className="font-display font-extrabold text-[20px] text-on-surface mt-1 block">
                        {totalRegisteredAccounts.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-outline/70 block mt-0.5">
                        {totalFreeUsers.toLocaleString()} Free • {totalSubscribers.toLocaleString()} Paid
                      </span>
                    </div>

                    <div className="bg-[#0b0e15]/40 border border-white/5 p-md rounded-xl font-mono text-left relative overflow-hidden group hover:border-white/10 transition-all">
                      <span className="text-outline text-[9px] uppercase tracking-wider block">Paid Subscriptions</span>
                      <span className="font-display font-extrabold text-[20px] text-secondary mt-1 block">
                        {totalSubscribers.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-outline/70 block mt-0.5">
                        Active paid plans: {activeTiersCount}
                      </span>
                    </div>

                    <div className="bg-[#0b0e15]/40 border border-white/5 p-md rounded-xl font-mono text-left relative overflow-hidden group hover:border-white/10 transition-all">
                      <span className="text-outline text-[9px] uppercase tracking-wider block">Monthly Recurring (MRR)</span>
                      <span className="font-display font-extrabold text-[20px] text-primary mt-1 block">
                        ${totalMrr.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-secondary font-bold block mt-0.5">
                        Avg Sat: {avgSatisfaction}%
                      </span>
                    </div>
                  </div>

                  {/* SVG Historical MRR Graph */}
                  <div className="bg-[#0b0e15]/40 border border-white/5 rounded-xl p-md space-y-sm">
                    <span className="font-mono text-[9px] text-outline uppercase tracking-wider font-bold block">MRR Growth Trend (Last 20 ticks)</span>
                    <div className="h-[120px] w-full flex items-center justify-center relative bg-[#07090e]/50 border border-white/5 rounded-lg overflow-hidden">
                      {analyticsHistory && analyticsHistory.length > 1 ? (
                        <svg className="w-full h-full p-2" viewBox="0 0 450 120" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="mrrAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="30" x2="450" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          <line x1="0" y1="60" x2="450" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          <line x1="0" y1="90" x2="450" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          {/* Path & Area */}
                          <path
                            d={(() => {
                              const maxVal = Math.max(...analyticsHistory.map(h => h.mrr), 1);
                              const points = analyticsHistory.map((h, i) => {
                                const x = (i / (analyticsHistory.length - 1)) * 430 + 10;
                                const y = 100 - (h.mrr / maxVal) * 80;
                                return `${x},${y}`;
                              });
                              return `M ${points.join(' L ')}`;
                            })()}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <path
                            d={(() => {
                              const maxVal = Math.max(...analyticsHistory.map(h => h.mrr), 1);
                              const points = analyticsHistory.map((h, i) => {
                                const x = (i / (analyticsHistory.length - 1)) * 430 + 10;
                                const y = 100 - (h.mrr / maxVal) * 80;
                                return `${x},${y}`;
                              });
                              const lastX = (analyticsHistory.length - 1) / (analyticsHistory.length - 1) * 430 + 10;
                              return `M 10,110 L ${points.join(' L ')} L ${lastX},110 Z`;
                            })()}
                            fill="url(#mrrAreaGrad)"
                          />
                        </svg>
                      ) : (
                        <div className="text-[10px] text-outline/50 font-mono italic">Gathering more historical tick data...</div>
                      )}
                    </div>
                  </div>

                  {/* Customer Review Feedback Feed */}
                  <div className="bg-[#0b0e15]/40 border border-white/5 rounded-xl p-md space-y-sm flex flex-col">
                    <span className="font-mono text-[9px] text-outline uppercase tracking-wider font-bold block">Live Customer Reviews & Feedback</span>
                    <div className="max-h-[170px] overflow-y-auto custom-scrollbar space-y-sm pr-1">
                      {feedbacks && feedbacks.length > 0 ? (
                        feedbacks.map(f => (
                          <div key={f.id} className="bg-[#121620]/60 border border-white/5 rounded-xl p-3 flex gap-3 text-left font-sans text-xs transition-all hover:border-white/10 hover:bg-[#151a27]/60">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-mono text-[10px] shrink-0">
                              {f.author.slice(0, 2).toUpperCase()}
                            </div>
                            {/* Body */}
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-on-surface text-[11px]">{f.author}</span>
                                <span className="font-mono text-[9px] text-outline/60">Tick {f.tick}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="flex text-amber-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-xs">
                                      {i < f.rating ? 'star' : 'star_border'}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-[9px] text-outline/80 font-mono">
                                  {f.tierName} • {f.modelName}
                                </span>
                              </div>
                              <p className="text-on-surface-variant text-[11px] leading-relaxed pt-0.5">{f.comment}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-outline/50 font-mono italic text-[10px]">
                          No reviews received yet. (Ticks occur every few seconds)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
