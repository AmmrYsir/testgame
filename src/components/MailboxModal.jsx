import { useState } from 'react';
import { useGameStore } from '../store';

export default function MailboxModal({ isOpen, onClose }) {
  const { emails, markEmailAsRead, claimEmailReward } = useGameStore();
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  if (!isOpen) return null;

  // Selected Email details
  const activeEmail = emails.find(e => e.id === selectedEmailId) || emails[0];

  const handleSelectEmail = (emailId) => {
    setSelectedEmailId(emailId);
    markEmailAsRead(emailId);
  };

  const handleClaim = (emailId) => {
    claimEmailReward(emailId);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-fade-in">
      <div 
        className="glass-panel w-full max-w-[900px] h-[550px] rounded-xl flex flex-col overflow-hidden shadow-2xl relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-lg py-4 border-b border-white/10 bg-surface-container/60 flex justify-between items-center flex-none">
          <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">mail</span>
            Corporate Communications Center
          </h3>
          <button 
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Email List (40% width) */}
          <div className="w-[38%] border-r border-white/10 flex flex-col h-full bg-surface-dim/20">
            <div className="p-2 border-b border-white/5 bg-surface-container-low/30 text-[10px] text-outline uppercase font-semibold tracking-wider px-4">
              Inbox ({emails.filter(e => !e.read).length} Unread)
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {emails.length === 0 ? (
                <div className="p-lg text-center text-outline italic text-xs">No emails in inbox.</div>
              ) : (
                emails.map((email) => {
                  const isSelected = activeEmail?.id === email.id;
                  const isUnread = !email.read;
                  
                  return (
                    <div
                      key={email.id}
                      onClick={() => handleSelectEmail(email.id)}
                      className={`p-4 cursor-pointer text-left transition-colors flex items-start gap-3 relative ${
                        isSelected 
                          ? 'bg-primary/10' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {isUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary absolute left-1.5 top-5 shadow-[0_0_8px_rgba(173,198,255,0.8)]"></span>
                      )}
                      
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs truncate font-semibold block ${isUnread ? 'text-on-surface' : 'text-outline'}`}>
                            {email.sender}
                          </span>
                          <span className="text-[9px] text-outline shrink-0 font-mono">Day {email.tick}</span>
                        </div>
                        <h4 className={`text-xs truncate font-bold ${isUnread ? 'text-on-surface' : 'text-outline-variant'}`}>
                          {email.subject}
                        </h4>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Email Detail Inspector (62% width) */}
          <div className="w-[62%] flex flex-col h-full bg-surface-container-low/20">
            {activeEmail ? (
              <div className="p-lg flex flex-col h-full overflow-y-auto gap-md">
                
                {/* Detail Header */}
                <div className="border-b border-white/10 pb-md space-y-sm flex-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-outline font-semibold">From: </span>
                      <span className="text-xs text-primary font-bold">{activeEmail.sender}</span>
                    </div>
                    <span className="text-xs text-outline font-mono">Day {activeEmail.tick}</span>
                  </div>
                  <div>
                    <span className="text-xs text-outline font-semibold">Subject: </span>
                    <h2 className="text-on-surface font-bold text-base inline-block ml-1">{activeEmail.subject}</h2>
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 text-xs text-on-surface-variant font-sans leading-relaxed whitespace-pre-wrap select-text pr-2">
                  {activeEmail.body}
                </div>

                {/* Optional Claimable Reward Card */}
                {activeEmail.reward && (
                  <div className="mt-auto pt-md border-t border-white/10 flex-none">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-md flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-outline uppercase font-semibold">Attached Funding Reward</span>
                        <p className="font-label-md text-label-md text-primary font-bold text-sm">
                          {activeEmail.reward.cash && `+$${activeEmail.reward.cash.toLocaleString()} Cash Reserves`}
                          {activeEmail.reward.hype && ` +${activeEmail.reward.hype} Hype Points`}
                        </p>
                      </div>

                      <button
                        onClick={() => handleClaim(activeEmail.id)}
                        disabled={activeEmail.claimed}
                        className={`font-label-sm text-label-sm font-semibold uppercase tracking-wider px-md py-2.5 rounded-xl transition-all ${
                          activeEmail.claimed
                            ? 'bg-surface-dim border border-white/5 text-outline cursor-default'
                            : 'bg-primary hover:bg-primary-container text-on-primary shadow-[0_0_15px_rgba(173,198,255,0.3)]'
                        }`}
                      >
                        {activeEmail.claimed ? 'Claimed' : 'Claim Reward'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-outline italic text-xs">
                Select a message to view
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}