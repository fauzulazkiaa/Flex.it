import React, { useState, useEffect } from 'react';
import { Bell, Check, X, FolderGit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Invitation {
  id: string;
  email: string;
  activityId: string;
  activity: {
    title: string;
    user: { name: string; email: string };
  };
}

export const InvitationsPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
    // Poll every 30 seconds for new invitations
    const interval = setInterval(fetchInvitations, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (invitationId: string, action: 'ACCEPT' | 'REJECT') => {
    setProcessingId(invitationId);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, action }),
      });
      if (res.ok) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        // Might want to trigger a refresh of activities here, but a page reload or mutate works too.
        if (action === 'ACCEPT') {
          window.location.reload(); // Simple way to refresh data
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#121215] text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {invitations.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-[#121215] border border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-800/80 bg-[#0c0c0e]">
                <h3 className="font-bold text-zinc-100 flex items-center gap-2 text-sm">
                  <Bell className="w-4 h-4 text-indigo-400" /> Undangan Tim
                </h3>
              </div>
              
              <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                {loading ? (
                  <p className="text-zinc-500 text-xs text-center py-4">Memuat...</p>
                ) : invitations.length === 0 ? (
                  <p className="text-zinc-500 text-xs text-center py-4 italic">Belum ada undangan masuk.</p>
                ) : (
                  <ul className="space-y-2">
                    {invitations.map(inv => (
                      <li key={inv.id} className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/80">
                        <p className="text-xs text-zinc-400 mb-1">
                          <span className="font-semibold text-zinc-200">{inv.activity.user?.name || inv.activity.user?.email}</span> mengundang Anda:
                        </p>
                        <p className="text-sm font-bold text-zinc-100 mb-3">{inv.activity.title}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction(inv.id, 'ACCEPT')}
                            disabled={processingId === inv.id}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" /> Terima
                          </button>
                          <button
                            onClick={() => handleAction(inv.id, 'REJECT')}
                            disabled={processingId === inv.id}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-rose-950 text-zinc-300 hover:text-rose-400 rounded-lg text-xs font-bold transition disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" /> Tolak
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
