import { useState } from 'react';
import TopBar from './TopBar';
import LeftMenu from './LeftMenu';
import InfrastructureView from './InfrastructureView';
import ModelView from './ModelView';
import BottomLogsDrawer from './BottomLogsDrawer';
import MailboxModal from './MailboxModal';
import ResearchView from './ResearchView';
import MarketView from './MarketView';

export default function TycoonUI() {
  const [activeTab, setActiveTab] = useState('infrastructure');
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-on-surface overflow-hidden dark relative pb-12">
      <TopBar onMailboxToggle={() => setIsMailboxOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        <LeftMenu activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 flex flex-col relative h-full">
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none p-12">
            <img alt="Isometric Server Racks" className="max-w-full max-h-full object-contain filter contrast-125 saturate-50 drop-shadow-2xl opacity-60 mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS9kfBDQNCyZUW4fFu-YdEG0fh_NiGNdx-8Vk9bjCzFeN76rex2CqV460-UCucE9VrS1lRD_fcKcpFQTOW89YKO9dVAf5k-_uNCepCWM2_SVpadFrtM_5DC69ARLDAxyhhI0wRyMb5T0C7LDzZAbyMC69rTnl8wmXmLcQ0IgBHIach9-mvRJdlbaV7UyC-KDYunplgPA5ETI2Lh21tFOT5cVkUyUMBfYNeAghxXiJwXuh0YAa7Hvf6OddVXFMduokRmKfaTg1KJqY" />
          </div>

          <div className="relative z-10 flex-1 p-6 h-full overflow-hidden flex flex-col">
            {activeTab === 'infrastructure' && <InfrastructureView />}
            {activeTab === 'model' && <ModelView />}
            {activeTab === 'research' && <ResearchView />}
            {activeTab === 'market' && <MarketView />}
          </div>

          {/* Bottom logs console */}
          <BottomLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} />

          {/* Interactive Mailbox Modal */}
          <MailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />
        </main>
      </div>

      <footer className="bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-md absolute bottom-0 left-0 right-0 flex items-center justify-between px-lg z-50 h-12 border-t border-white/10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsLogsOpen(!isLogsOpen)}
            className={`font-label-sm text-label-sm font-semibold uppercase tracking-wider px-3 py-1 rounded transition-colors ${
              isLogsOpen 
                ? 'bg-primary/20 text-primary border border-primary/20' 
                : 'text-outline hover:text-surface-tint border border-transparent'
            }`}
          >
            Diagnostics Logs
          </button>
        </div>
      </footer>
    </div>
  );
}
