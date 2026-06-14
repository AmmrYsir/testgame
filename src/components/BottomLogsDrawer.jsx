import { useState } from 'react';
import { useGameStore } from '../store';

export default function BottomLogsDrawer({ isOpen, onClose }) {
  const { newsFeed } = useGameStore();
  const [filter, setFilter] = useState('all'); // 'all', 'system', 'training', 'public'

  if (!isOpen) return null;

  // Filter logs
  const filteredLogs = newsFeed.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'system') return log.type === 'memory' || log.type === 'ac_unit' || log.type === 'cloud';
    if (filter === 'training') return log.type === 'model_training' || log.type === 'check_circle';
    if (filter === 'public') return log.type === 'public' || log.type === 'warning' || log.type === 'handshake';
    return true;
  });

  return (
    <div className="absolute bottom-12 left-0 right-0 h-64 bg-surface-container-low/95 dark:bg-surface-container-low/95 backdrop-blur-2xl border-t border-white/10 z-40 flex flex-col overflow-hidden shadow-2xl">
      {/* Header bar of drawer */}
      <div className="px-lg py-2 border-b border-white/10 bg-surface-container/60 flex items-center justify-between flex-none">
        <div className="flex items-center gap-6">
          <h3 className="font-label-md text-label-md text-on-surface flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
            <span className="material-symbols-outlined text-[16px] text-primary animate-pulse">terminal</span>
            Startup Diagnostics & Intel Console
          </h3>

          {/* Filters */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Operations' },
              { id: 'system', label: 'Infrastructure' },
              { id: 'training', label: 'Neural Training' },
              { id: 'public', label: 'Market & Releases' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`text-[10px] font-label-sm font-semibold uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                  filter === cat.id 
                    ? 'bg-primary/15 text-primary border border-primary/20' 
                    : 'bg-surface-dim hover:bg-surface-bright/20 border border-white/5 text-outline'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
        </button>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 select-text">
        {filteredLogs.length === 0 ? (
          <p className="text-outline italic text-center pt-8">No diagnostics logged under this filter.</p>
        ) : (
          filteredLogs.map((log, index) => {
            const time = `[DAY ${String(log.tick).padStart(3, '0')}]`;
            
            // Map types to console colors
            let colorClass = 'text-on-surface';
            if (log.type === 'warning' || log.type === 'error') colorClass = 'text-error font-bold';
            else if (log.type === 'check_circle' || log.type === 'handshake') colorClass = 'text-secondary font-bold';
            else if (log.type === 'model_training' || log.type === 'science') colorClass = 'text-primary';
            else if (log.type === 'cloud' || log.type === 'memory') colorClass = 'text-outline-variant';

            return (
              <div key={index} className="flex gap-3 items-start leading-relaxed border-b border-white/5 pb-1 last:border-0 hover:bg-white/5 px-2 py-0.5 rounded transition-colors">
                <span className="text-outline shrink-0">{time}</span>
                <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0 select-none opacity-80">{log.type}</span>
                <span className={colorClass}>{log.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}