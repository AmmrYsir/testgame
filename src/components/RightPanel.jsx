import { useGameStore } from '../store';

export default function RightPanel() {
  const { newsFeed } = useGameStore();

  return (
    <aside className="hidden lg:flex w-80 glass-panel rounded-xl flex-col h-full overflow-hidden shadow-2xl relative border border-white/10 m-6 ml-0">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface/40 flex-none">
        <h3 className="font-label-md text-label-md text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary-container text-sm">public</span>
          Global Market Intel
        </h3>
        <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {newsFeed.map((item, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-bright/20 transition-colors border border-transparent hover:border-white/5">
              <div className="mt-1 flex-none">
                <span className={`material-symbols-outlined ${item.iconColor} text-sm`}>{item.type}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-outline">Day {item.tick} • System Log</span>
                <p className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10 bg-surface/20 flex-none text-center">
        <button className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors uppercase tracking-wider w-full py-2">Load More Logs</button>
      </div>
    </aside>
  );
}
