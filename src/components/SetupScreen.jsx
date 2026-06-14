import { useState } from 'react';
import { useGameStore } from '../store';

export default function SetupScreen() {
  const { startGame, setCompanyDetails } = useGameStore();
  const [companyName, setCompanyName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [logo, setLogo] = useState('memory');
  const [color, setColor] = useState('primary');

  const handleLaunch = () => {
    setCompanyDetails({ name: companyName, founder: founderName, logo, color });
    startGame();
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-background overflow-hidden dark">
      <div className="absolute inset-0 z-0 bg-background"></div>
      <div className="relative z-10 glass-panel w-full max-w-[800px] rounded-xl shadow-2xl p-lg md:p-xl flex flex-col gap-xl">
        <div className="flex flex-col items-center text-center gap-sm">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Create New Company</h1>
        </div>

        <form className="flex flex-col gap-lg w-full" onSubmit={e => { e.preventDefault(); handleLaunch(); }}>
          <div className="flex flex-col gap-md">
            <h2 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-white/5 pb-sm">1. Entity Identification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-surface-dim border border-outline-variant rounded-lg p-sm font-body-md text-body-md text-on-surface focus:border-primary transition-all outline-none"
                  placeholder="e.g. AETHER CORP"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="founderName">Primary Executive (Founder)</label>
                <input
                  id="founderName"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="bg-surface-dim border border-outline-variant rounded-lg p-sm font-body-md text-body-md text-on-surface focus:border-primary transition-all outline-none"
                  placeholder="Enter Full Name"
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-md">
            <h2 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-white/5 pb-sm">2. Visual Signifier</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Select a corporate logo archetype.</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-sm">
              {['memory', 'blur_on', 'architecture', 'eco', 'hub', 'bolt'].map((icon) => (
                <label key={icon} className="cursor-pointer group">
                  <input
                    type="radio"
                    name="logo"
                    checked={logo === icon}
                    onChange={() => setLogo(icon)}
                    className="peer sr-only"
                  />
                  <div className="h-16 flex items-center justify-center bg-surface-dim border border-outline-variant rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 transition-colors group-hover:bg-surface-bright/50">
                    <span className="material-symbols-outlined text-on-surface-variant peer-checked:text-primary transition-colors">{icon}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="flex flex-col gap-md">
              <h2 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-white/5 pb-sm">3. Color Accent</h2>
              <div className="flex gap-sm h-full items-center">
                {[
                  { id: 'primary', bg: 'bg-primary', ring: 'peer-checked:ring-primary/50' },
                  { id: 'secondary', bg: 'bg-secondary', ring: 'peer-checked:ring-secondary/50' },
                  { id: 'tertiary', bg: 'bg-tertiary', ring: 'peer-checked:ring-tertiary/50' },
                  { id: 'surface-variant', bg: 'bg-surface-variant', ring: 'peer-checked:ring-surface-variant/50' },
                ].map((c) => (
                  <label key={c.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      checked={color === c.id}
                      onChange={() => setColor(c.id)}
                      className="peer sr-only"
                    />
                    <div className={`w-8 h-8 rounded-full ${c.bg} border-2 border-transparent peer-checked:border-white transition-all ring-2 ring-transparent ${c.ring}`}></div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-md">
              <h2 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-white/5 pb-sm">4. Initial Strategy</h2>
              <div className="bg-surface-dim border border-outline-variant rounded-lg p-xs flex relative">
                <label className="flex-1 text-center py-sm z-10 cursor-pointer font-label-sm text-label-sm">
                  <input defaultChecked className="peer sr-only" name="strategy" type="radio" value="aggressive" />
                  <span className="text-on-surface-variant peer-checked:text-on-surface transition-colors">Aggressive Growth</span>
                </label>
                <label className="flex-1 text-center py-sm z-10 cursor-pointer font-label-sm text-label-sm">
                  <input className="peer sr-only" name="strategy" type="radio" value="research" />
                  <span className="text-on-surface-variant peer-checked:text-on-surface transition-colors">Sustainable Research</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-md pt-lg border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg transition-colors shadow-sm flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              Found Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
