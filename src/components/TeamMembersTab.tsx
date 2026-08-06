import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Mail } from 'lucide-react';
import { Activity } from '../types';
import { useUser } from '@clerk/nextjs';

interface TeamMembersTabProps {
  activity: Activity;
}

interface TeamMember {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED';
  userId: string | null;
  user: { name: string | null; imageUrl: string | null } | null;
}

export const TeamMembersTab: React.FC<TeamMembersTabProps> = ({ activity }) => {
  const { user: clerkUser } = useUser();
  const currentUserId = clerkUser?.id;

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailToInvite, setEmailToInvite] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = activity.userId === currentUserId;

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/activities/${activity.id}/team`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activity.id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToInvite) return;
    setInviting(true);
    setError(null);
    try {
      const res = await fetch(`/api/activities/${activity.id}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToInvite }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengundang');
      setEmailToInvite('');
      fetchMembers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Hapus anggota ini dari tim?')) return;
    try {
      const res = await fetch(`/api/activities/${activity.id}/team?memberId=${memberId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="p-4 bg-[#121215] border border-indigo-900/40 rounded-2xl">
          <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-indigo-400" /> Undang Anggota Tim
          </h4>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={emailToInvite}
              onChange={(e) => setEmailToInvite(e.target.value)}
              placeholder="Email teman (contoh: budi@gmail.com)"
              className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500 transition"
              required
            />
            <button
              type="submit"
              disabled={inviting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50"
            >
              {inviting ? 'Mengundang...' : 'Undang'}
            </button>
          </form>
          {error && <p className="text-rose-400 text-xs mt-2">{error}</p>}
        </div>
      )}

      <div className="p-4 bg-[#121215] border border-zinc-800/80 rounded-2xl">
        <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-indigo-400" /> Daftar Anggota Tim
        </h4>
        
        {loading ? (
          <p className="text-zinc-500 text-sm">Memuat anggota...</p>
        ) : members.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">Belum ada anggota tim yang diundang.</p>
        ) : (
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.id} className="flex items-center justify-between p-3 bg-[#0c0c0e] border border-zinc-800/60 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  {member.user?.imageUrl ? (
                    <img src={member.user.imageUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-zinc-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                      <Mail className="w-4 h-4 text-zinc-400" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{member.user?.name || member.email}</p>
                    <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${member.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {member.status === 'ACCEPTED' ? 'Bergabung' : 'Menunggu'}
                  </span>
                  {(isOwner || member.userId === currentUserId) && (
                    <button onClick={() => handleRemove(member.id)} className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition" title={isOwner ? "Hapus" : "Keluar"}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
