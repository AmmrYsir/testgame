import { useGameStore } from '../store';

export default function MainMenu() {
  const { setGameStage } = useGameStore();

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-background overflow-hidden dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 z-10 backdrop-blur-[2px]"></div>
        <img className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida/AP1WRLtA-JPQCU7-9YsZoktdk3QrYFJ4xsXQd6JaeXkgwXrFBUGQ7k-uritvK94YFO8JObuzuvCUri2nwzrjhwLP1otKgjzksnepMsKzNP1ys8sXA4GxiXnn0M_AjAYpyz4mZ4jBPU1BCNG-vxe_pL8-tqgUODmFLf0vhI1y-eJseLExt6D0v2-fE5ts-I-u6i360qhSa6TuQofJTkr0VQfKtRjQcA_8xEiKEEd-K-yVSg5fxvPL_zIaGBpgYg" alt="Server Background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10"></div>
      </div>
      <main className="relative z-20 w-full max-w-[600px] px-lg flex flex-col items-center">
        <div className="text-center mb-xl">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">
            AETHER CORP
          </h1>
          <p className="font-headline-md text-headline-md text-outline tracking-widest uppercase">
            LLM RACE
          </p>
        </div>
        <div className="bg-surface-container/60 backdrop-blur-xl border border-white/10 rounded-xl p-xl w-full flex flex-col gap-md shadow-2xl">
          <button 
            onClick={() => setGameStage('newGameSetup')}
            className="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-sm hover:bg-primary-container transition-colors group relative overflow-hidden"
          >
            <span className="material-symbols-outlined text-on-primary text-[20px] transition-transform group-hover:scale-110">rocket_launch</span>
            <span>New Startup</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
          </button>
          <button className="w-full bg-surface-bright/50 border border-white/5 text-on-surface py-md px-lg rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-sm hover:bg-surface-container-high hover:border-white/20 transition-all group">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">play_arrow</span>
            <span>Resume Command</span>
          </button>
          <button className="w-full bg-surface-bright/30 border border-white/5 text-outline py-md px-lg rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-sm hover:bg-surface-container hover:text-on-surface transition-all group">
            <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors text-[20px]">settings</span>
            <span>Executive Settings</span>
          </button>
        </div>
        <div className="mt-xl text-center">
          <p className="font-label-sm text-label-sm text-outline-variant uppercase">
            System Status: Optimal | Latency: 12ms
          </p>
        </div>
      </main>
    </div>
  );
}
