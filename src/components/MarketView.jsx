import { useGameStore } from '../store';

export default function MarketView() {
  const { llms, releaseLLM } = useGameStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto w-full pt-12 pb-24 overflow-y-auto">
      <div className="col-span-1 lg:col-span-12 mb-sm flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Market & Releases</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Deploy your completed neural weights to enterprise or consumer markets.</p>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-12 flex flex-col gap-gutter">
        <section className="glass-panel p-lg rounded-xl">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md border-b border-white/10 pb-xs">Completed Models</h3>
          <div className="flex flex-col gap-md mt-md">
            {llms.length === 0 ? (
              <p className="text-outline italic">No models have finished training yet.</p>
            ) : (
              llms.map(llm => (
                <div key={llm.id} className="p-md rounded-xl border border-outline-variant bg-surface-container flex flex-col md:flex-row justify-between items-center gap-md">
                  <div className="flex items-center gap-md w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">model_training</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface">{llm.name} {llm.version}</h4>
                      <p className="font-label-sm text-label-sm text-outline mt-xs">
                        Knowledge: {llm.stats.knowledge} | Code: {llm.stats.coding} | Logic: {llm.stats.math} | Creativity: {llm.stats.creativity}
                      </p>
                      <p className="font-label-sm text-label-sm text-error mt-xs">Hallucination: {llm.stats.hallucination}%</p>
                    </div>
                  </div>
                  
                  {llm.isReleased ? (
                    <span className="px-sm py-xs bg-surface-dim border border-white/5 rounded text-outline font-label-sm uppercase">Released</span>
                  ) : (
                    <div className="flex gap-sm w-full md:w-auto">
                      <button 
                        onClick={() => releaseLLM(llm.id, 'b2b')}
                        className="flex-1 md:flex-none bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md text-label-md px-md py-sm rounded-lg transition-all duration-300"
                      >
                        B2B Enterprise
                      </button>
                      <button 
                        onClick={() => releaseLLM(llm.id, 'b2c')}
                        className="flex-1 md:flex-none bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(173,198,255,0.2)]"
                      >
                        B2C Consumer App
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
