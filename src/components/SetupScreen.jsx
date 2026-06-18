import { useState, useCallback } from 'react';
import { useGameStore } from '../store';

const colorMap = {
  primary: '#3b82f6',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  'surface-variant': '#94a3b8'
};

const strategyCashMap = {
  bootstrapped: 5000000,
  corporate: 10000000,
  vc: 25000000
};

export default function SetupScreen() {
  const { startGame, setCompanyDetails, setGameStage, setStartingCash } = useGameStore();
  const [companyName, setCompanyName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [logo, setLogo] = useState('memory');
  const [color, setColor] = useState('primary');
  const [strategy, setStrategy] = useState('corporate');

  const handleLaunch = () => {
    if (!companyName.trim() || !founderName.trim()) return;
    const startingCash = strategyCashMap[strategy] || 10000000;
    setCompanyDetails({ 
      name: companyName.toUpperCase(), 
      founder: founderName, 
      logo, 
      color: colorMap[color] || '#3b82f6' 
    });
    setStartingCash(startingCash);
    startGame();
  };

  const handleAbort = useCallback(() => {
    setGameStage('menu');
  }, [setGameStage]);

  const isValid = companyName.trim() !== '' && founderName.trim() !== '';

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-[#0d0f14] overflow-hidden dark select-none">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800b_1px,transparent_1px)] bg-[size:32px_32px]">
        {/* Soft Radial Ambient Backlights */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 bg-[#191b23]/75 backdrop-blur-2xl border border-white/10 w-full max-w-[750px] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-lg md:p-xl flex flex-col gap-lg animate-slide-in mx-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-1 border-b border-white/5 pb-md">
          <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-[0.25em] block">
            Company Setup
          </span>
          <h1 className="font-display-lg text-[22px] md:text-[28px] text-on-surface font-extrabold uppercase tracking-tight">
            Create New Company
          </h1>
        </div>

        <form className="flex flex-col gap-md w-full" onSubmit={e => { e.preventDefault(); handleLaunch(); }}>
          
          {/* Live Logo/Identity Preview Card */}
          <div className="bg-[#0b0e15]/60 border border-white/5 rounded-xl p-md flex items-center gap-md select-none animate-fade-in">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
              style={{ 
                backgroundColor: `${colorMap[color]}15`, 
                borderColor: `${colorMap[color]}40`,
                boxShadow: `0 0 15px ${colorMap[color]}15`
              }}
            >
              <span 
                className="material-symbols-outlined text-2xl transition-all duration-300"
                style={{ color: colorMap[color] }}
              >
                {logo}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-outline font-semibold">Corporate Identity Preview</span>
              <h3 
                className="font-display-md text-base font-bold uppercase truncate tracking-wide transition-all duration-300 mt-0.5"
                style={{ color: companyName.trim() ? '#ffffff' : 'rgba(255,255,255,0.2)' }}
              >
                {companyName.trim() ? companyName : 'Your Company Name'}
              </h3>
              <p className="font-mono text-[9px] text-outline mt-0.5 truncate">
                Founder: <span className="text-on-surface/80">{founderName.trim() ? founderName : '---'}</span>
              </p>
            </div>
          </div>
          
          {/* Section 1: Entity Identification */}
          <div className="space-y-sm">
            <h2 className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 1. Company Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md bg-surface-container/20 p-md rounded-lg border border-white/5">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-outline uppercase tracking-wider" htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-[#0b0e15] border border-white/10 rounded-lg p-2.5 font-sans text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="e.g. AETHER INDUSTRIES"
                  type="text"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-outline uppercase tracking-wider" htmlFor="founderName">Founder Name</label>
                <input
                  id="founderName"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="bg-[#0b0e15] border border-white/10 rounded-lg p-2.5 font-sans text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Your Name"
                  type="text"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logo archetype */}
          <div className="space-y-sm">
            <h2 className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 2. Select Logo
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-sm bg-surface-container/20 p-md rounded-lg border border-white/5">
              {['memory', 'blur_on', 'architecture', 'eco', 'hub', 'bolt'].map((icon) => (
                <label key={icon} className="cursor-pointer group relative">
                  <input
                    type="radio"
                    name="logo"
                    checked={logo === icon}
                    onChange={() => setLogo(icon)}
                    className="peer sr-only"
                  />
                  <div className="h-14 flex items-center justify-center bg-[#0b0e15] border border-white/10 rounded-lg peer-checked:border-primary peer-checked:bg-primary/15 transition-all group-hover:bg-white/5 peer-checked:shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                    <span className="material-symbols-outlined text-outline peer-checked:text-primary transition-colors text-xl">{icon}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Accent and Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Color Accent */}
            <div className="space-y-sm">
              <h2 className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 3. Select Theme Color
              </h2>
              <div className="flex gap-md bg-surface-container/20 p-md rounded-lg border border-white/5 h-[62px] items-center justify-around">
                {[
                  { id: 'primary', bg: 'bg-[#3b82f6]', ring: 'peer-checked:ring-[#3b82f6]/40' },
                  { id: 'secondary', bg: 'bg-[#10b981]', ring: 'peer-checked:ring-[#10b981]/40' },
                  { id: 'tertiary', bg: 'bg-[#f59e0b]', ring: 'peer-checked:ring-[#f59e0b]/40' },
                  { id: 'surface-variant', bg: 'bg-[#94a3b8]', ring: 'peer-checked:ring-[#94a3b8]/40' },
                ].map((c) => (
                  <label key={c.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      checked={color === c.id}
                      onChange={() => setColor(c.id)}
                      className="peer sr-only"
                    />
                    <div className={`w-8 h-8 rounded-full ${c.bg} border-2 border-transparent peer-checked:border-white transition-all ring-4 ring-transparent ${c.ring}`}></div>
                  </label>
                ))}
              </div>
            </div>

            {/* Initial Strategy */}
            <div className="space-y-sm">
              <h2 className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 4. Select Funding Strategy
              </h2>
              <div className="bg-surface-container/20 p-sm rounded-lg border border-white/5 flex h-[62px] items-center">
                <div className="bg-[#0b0e15] border border-white/10 rounded-lg p-0.5 flex w-full gap-0.5">
                  {[
                    { id: 'bootstrapped', label: 'Bootstrapped', desc: '5 Million' },
                    { id: 'corporate', label: 'Corporate Backed', desc: '10 Million' },
                    { id: 'vc', label: 'VC Funded', desc: '25 Million' }
                  ].map((opt) => (
                    <label key={opt.id} className="flex-1 text-center py-1 z-10 cursor-pointer font-mono text-[8px] uppercase tracking-wider">
                      <input 
                        checked={strategy === opt.id} 
                        onChange={() => setStrategy(opt.id)} 
                        className="peer sr-only" 
                        name="strategy" 
                        type="radio" 
                        value={opt.id} 
                      />
                      <span className="text-outline peer-checked:text-primary peer-checked:font-bold transition-all px-1 block py-0.5 bg-transparent peer-checked:bg-primary/10 rounded-md">
                        {opt.label}
                        <span className="block text-[7px] text-outline-variant font-semibold mt-0.5">{opt.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-md pt-md border-t border-white/5 flex justify-between items-center">
            {/* Cancel/Abort */}
            <button
              type="button"
              onClick={handleAbort}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-outline hover:text-on-surface hover:bg-white/5 font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              Back
            </button>

            {/* Launch */}
            <button
              type="submit"
              disabled={!isValid}
              className={`px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-sm transition-all border ${
                isValid
                  ? 'bg-[#3b82f6] text-white border-transparent hover:bg-[#2563eb] hover:shadow-[0_0_12px_rgba(59,130,246,0.4)] cursor-pointer'
                  : 'bg-white/5 border-transparent text-outline opacity-30 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-base">add_business</span>
              <span>Start Game</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
