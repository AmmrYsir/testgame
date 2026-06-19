import { useState } from 'react';
import { useGameStore } from '../store';

export default function AdminModal({ isOpen, onClose }) {
  const {
    subscriptionTiers,
    llms,
    countries,
    marketingCampaign,
    addSubscriptionTier,
    updateSubscriptionTier,
    deleteSubscriptionTier,
    setMarketingCampaign
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
                            Route: {routedModel ? routedModel.name : <span className="text-error/70 italic">Not Routed</span>}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-display font-bold text-xs text-primary">${tier.price}</span>
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

            {/* MARKETING CAMPAIGNS CONTAINER */}
            <div className="p-md border-t border-white/5 bg-[#171d2b]/60 flex flex-col gap-sm">
              <span className="font-mono text-[9.5px] text-outline uppercase tracking-wider font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">campaign</span> Acquisition Marketing Campaigns
              </span>
              
              <div className="grid grid-cols-4 gap-xs bg-[#0b0e15] border border-white/5 p-1 rounded-xl">
                {[
                  { id: 'none', label: 'None', cost: '$0', boost: 'Flat' },
                  { id: 'low', label: 'Low', cost: '$5k', boost: '+25%' },
                  { id: 'medium', label: 'Med', cost: '$20k', boost: '+60%' },
                  { id: 'high', label: 'High', cost: '$50k', boost: '+120%' }
                ].map(campaign => (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() => setMarketingCampaign(campaign.id)}
                    className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer font-mono ${
                      marketingCampaign === campaign.id
                        ? 'bg-primary/20 border border-primary/40 text-primary font-bold shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                        : 'border border-transparent hover:bg-white/5 text-outline hover:text-on-surface'
                    }`}
                  >
                    <span className="text-[10px]">{campaign.label}</span>
                    <span className="text-[8px] opacity-70 mt-0.5">{campaign.cost}/tick</span>
                    <span className="text-[7.5px] text-secondary font-bold mt-0.5">{campaign.boost}</span>
                  </button>
                ))}
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
                        <span className="text-primary font-bold text-xs">${formPrice}/mo</span>
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
                        <span>Free ($0)</span>
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
                            {m.name} ({Math.round((m.stats.agentic + m.stats.coding + m.stats.reasoning + m.stats.knowledge + m.stats.math + m.stats.multilingual + m.stats.multimodal) / 7)}% avg)
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
              <div className="space-y-lg flex flex-col h-full justify-between">
                <div className="space-y-md">
                  <div className="border-b border-white/5 pb-sm">
                    <h3 className="font-mono text-xs text-primary font-bold uppercase tracking-wider text-left">SaaS Business Analytics</h3>
                  </div>

                  {/* SaaS Metric Cards */}
                  <div className="grid grid-cols-3 gap-sm">
                    <div className="bg-[#0b0e15]/40 border border-white/5 p-md rounded-xl text-center font-mono">
                      <span className="text-outline text-[9px] uppercase tracking-wider block">Total Subscribers</span>
                      <span className="font-display font-extrabold text-[22px] text-on-surface mt-1 block">
                        {totalSubscribers.toLocaleString()}
                      </span>
                      <span className="text-[7.5px] text-outline block mt-0.5">Across {activeTiersCount} active plans</span>
                    </div>

                    <div className="bg-[#0b0e15]/40 border border-white/5 p-md rounded-xl text-center font-mono">
                      <span className="text-outline text-[9px] uppercase tracking-wider block">Total Monthly MRR</span>
                      <span className="font-display font-extrabold text-[22px] text-primary mt-1 block">
                        ${totalMrr.toLocaleString()}
                      </span>
                      <span className="text-[7.5px] text-secondary font-bold block mt-0.5">Global monthly rate</span>
                    </div>

                    <div className="bg-[#0b0e15]/40 border border-white/5 p-md rounded-xl text-center font-mono">
                      <span className="text-outline text-[9px] uppercase tracking-wider block">Average Satisfaction</span>
                      <span className={`font-display font-extrabold text-[22px] mt-1 block ${avgSatisfaction < 60 ? 'text-error' : avgSatisfaction < 80 ? 'text-tertiary' : 'text-secondary'}`}>
                        {avgSatisfaction}%
                      </span>
                      <span className="text-[7.5px] text-outline block mt-0.5">User affinity baseline</span>
                    </div>
                  </div>

                  {/* regional data centers summary */}
                  <div className="bg-[#0b0e15]/40 border border-white/5 rounded-xl p-md space-y-sm text-left">
                    <span className="font-mono text-[9.5px] text-outline uppercase tracking-wider font-bold block">Regional Datacenter Status</span>
                    
                    <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-xs font-mono text-[10px]">
                      <div className="grid grid-cols-5 text-outline border-b border-white/5 pb-1 font-bold text-[9px] uppercase">
                        <span className="col-span-2">Country</span>
                        <span className="text-center">Market Share</span>
                        <span className="text-center">GPUs (Alloc / Req)</span>
                        <span className="text-right">Latency</span>
                      </div>
                      
                      {Object.values(countries || {})
                        .filter(c => c.openMarkets?.player)
                        .map(c => {
                          const deficit = (c.allocatedGpus || 0) < (c.gpusRequired || 0);
                          return (
                            <div key={c.name} className="grid grid-cols-5 py-1.5 border-b border-white/5 items-center">
                              <span className="col-span-2 text-on-surface font-semibold truncate">{c.name}</span>
                              <span className="text-center text-primary font-bold">{c.playerShare}%</span>
                              <span className="text-center flex justify-center gap-1">
                                <span className={deficit ? 'text-error font-bold' : 'text-on-surface'}>{c.allocatedGpus || 0}</span>
                                <span className="text-outline">/</span>
                                <span className="text-outline">{c.gpusRequired || 0}</span>
                              </span>
                              <span className={`text-right font-bold ${c.latency > 15 ? 'text-error animate-pulse' : 'text-secondary'}`}>
                                {c.latency === 999 ? 'Deficit' : `${c.latency}ms`}
                              </span>
                            </div>
                          );
                        })}
                      
                      {Object.values(countries || {}).filter(c => c.openMarkets?.player).length === 0 && (
                        <div className="text-center py-4 text-outline italic">No regions currently opened. Establish HQ or open country markets on the world map.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Tip */}
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl flex items-start gap-sm font-mono text-[9px] text-outline leading-relaxed text-left">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">info</span>
                  <div>
                    <span className="font-bold text-primary block uppercase mb-0.5">SaaS Operation Instructions</span>
                    Create subscription billing plans and map released models to them. Your total user compute required is calculated dynamically per region. Open country nodes act as regional compute data centers. Allocate GPUs to country nodes in the map sidebar to meet their query loads and maintain low latency.
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
