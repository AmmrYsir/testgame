import { useGameStore } from '../store';

export default function LeftMenu({ activeTab, setActiveTab, isLogsOpen, setIsLogsOpen }) {
  const { infrastructure } = useGameStore();

  return (
    <nav className="hidden md:flex flex-col w-64 bg-surface-container/80 dark:bg-surface-container/80 backdrop-blur-2xl border-r border-white/5 z-40 flex-none h-full py-md">
      <div className="px-md mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold border border-white/10 overflow-hidden">
          <img alt="Executive Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxpi4KYk_4_XAulFSztkYTpILq7Rk2wmkwrrPzCMVl3ZwTmq5ZdyddfIrvhs_xshVjr47cWqFHJa5iikRREy-uBc0OFmRXUj5x-w4meanZAaPejgP3cxJOp8J1gLlJ_C1-Owa0SFaBsHeU8ocCpHg6Jtq1h0bT0G6j3VyQ5ON2KKtvraxmsKF22nYUXM-x_wUgRBs3rRWda9YG7JZS4HOZMkbifkYs1Om5T1eHQzFozV4pYvtBD51uRaZk_ajOGdFhdl96iUVBQ0o" />
        </div>
        <div>
          <h2 className="font-label-md text-label-md text-on-surface">Command Center</h2>
          <p className="font-label-sm text-label-sm text-outline">Series A Startup</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-sm">
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold w-full text-left transition-transform duration-200 group ${activeTab === 'infrastructure' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/10'}`}
        >
          <span className={`material-symbols-outlined ${activeTab !== 'infrastructure' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>developer_board</span>
          <span className="font-label-md text-label-md">Hardware</span>
          {activeTab === 'infrastructure' && <span className="ml-auto w-2 h-2 rounded-full bg-secondary-fixed"></span>}
        </button>
        <button
          onClick={() => setActiveTab('model')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold w-full text-left transition-transform duration-200 group ${activeTab === 'model' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/10'}`}
        >
          <span className={`material-symbols-outlined ${activeTab !== 'model' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>model_training</span>
          <span className="font-label-md text-label-md">Model</span>
          {activeTab === 'model' && <span className="ml-auto w-2 h-2 rounded-full bg-secondary-fixed"></span>}
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold w-full text-left transition-transform duration-200 group ${activeTab === 'research' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/10'}`}
        >
          <span className={`material-symbols-outlined ${activeTab !== 'research' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>science</span>
          <span className="font-label-md text-label-md">Research</span>
          {activeTab === 'research' && <span className="ml-auto w-2 h-2 rounded-full bg-secondary-fixed"></span>}
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold w-full text-left transition-transform duration-200 group ${activeTab === 'market' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/10'}`}
        >
          <span className={`material-symbols-outlined ${activeTab !== 'market' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>storefront</span>
          <span className="font-label-md text-label-md">Market</span>
          {activeTab === 'market' && <span className="ml-auto w-2 h-2 rounded-full bg-secondary-fixed"></span>}
        </button>
      </div>

      {/* Diagnostics Logs Button at bottom */}
      <div className="mt-auto px-sm pt-md border-t border-white/5">
        <button
          onClick={() => setIsLogsOpen(!isLogsOpen)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold w-full text-left transition-all duration-200 group border ${
            isLogsOpen
              ? 'bg-primary/20 text-primary border-primary/20'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/10 border-transparent'
          }`}
        >
          <span className={`material-symbols-outlined ${!isLogsOpen ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>terminal</span>
          <span className="font-label-md text-label-md">Diagnostics Logs</span>
        </button>
      </div>
    </nav>
  );
}
