"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  collection, addDoc, doc, updateDoc, onSnapshot,
  query, where, runTransaction, getDocs, getFirestore,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/app/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, User, Mail, GraduationCap, Skull, Heart, RefreshCw, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

const db = getFirestore(app);
const auth = getAuth(app);

const CARD_BG = 'var(--admin-card-bg)';
const INPUT_BG = 'var(--admin-input-bg)';
const INPUT_BORDER = 'var(--admin-input-border)';

type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  classification: string;
  isCheckedIn: boolean;
  playernumber: number | null;
  iseliminated: boolean;
  eliminatedround: number;
};

type Tab = 'adduser' | 'checkin' | 'eliminate';
type SortField = 'firstName' | 'lastName';
type SortDir = 'asc' | 'desc';
type EliminatedFilter = 'all' | 'active' | 'eliminated';
type YearFilter = 'All' | 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
type CheckInFilter = 'pending' | 'checkedin' | 'all';

const YEAR_OPTIONS: YearFilter[] = ['All', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

const inputCls = `h-14 pl-12 bg-[${INPUT_BG}] border-[${INPUT_BORDER}] text-white placeholder:text-white/40 rounded-lg focus-visible:ring-0 focus-visible:border-[#E84784]`;
const selectTriggerCls = `h-14 pl-12 bg-[${INPUT_BG}] border-[${INPUT_BORDER}] text-white rounded-lg focus:ring-0`;

function AddUserTab() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [classification, setClassification] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !classification) {
      setError('All fields are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      const existing = await getDocs(query(collection(db, 'participants'), where('email', '==', email.trim())));
      if (!existing.empty) {
        setError('A participant with that email already exists.');
        setSubmitting(false);
        return;
      }
      await addDoc(collection(db, 'participants'), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        classification,
        discordUsername: 'n/a',
        school: 'unaffiliated',
        optin: false,
        signup: new Date(),
        iseliminated: false,
        eliminatedround: 0,
        playernumber: null,
        isCheckedIn: false,
      });
      setFirstName('');
      setLastName('');
      setEmail('');
      setClassification('');
      setSuccess(`${displayName} added.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to add participant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-8 pb-6">
      <form onSubmit={handleAdd} className="space-y-5 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none z-10" />
            <Select value={classification} onValueChange={setClassification}>
              <SelectTrigger className={selectTriggerCls}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: INPUT_BG, borderColor: INPUT_BORDER }}>
                <SelectGroup>
                  {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map((y) => (
                    <SelectItem key={y} value={y} className="text-white focus:bg-white/10 focus:text-white">{y}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-10 bg-[#E84784] hover:bg-[#E84784]/90 text-white font-sunday uppercase tracking-widest text-sm rounded-lg"
        >
          {submitting ? 'Adding...' : 'Add User'}
        </Button>
      </form>
    </div>
  );
}

function CheckInTab({ participants }: { participants: Participant[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInFilter, setCheckInFilter] = useState<CheckInFilter>('pending');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = participants.filter((p) => {
    if (checkInFilter === 'pending' && p.isCheckedIn) return false;
    if (checkInFilter === 'checkedin' && !p.isCheckedIn) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  const selected = participants.find((p) => p.id === selectedId);

  const handleCheckIn = async (participantId: string) => {
    setUpdating(participantId);
    setError(null);
    setSuccess(null);
    const participant = participants.find((p) => p.id === participantId);
    try {
      const user = auth.currentUser;
      await runTransaction(db, async (transaction) => {
        const ref = doc(db, 'participants', participantId);
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error("Participant doesn't exist!");
        const data = snap.data();
        if (data.isCheckedIn) {
          transaction.update(ref, { isCheckedIn: false, playernumber: null });
          setSuccess(`${participant?.firstName} ${participant?.lastName} check-in removed.`);
        } else {
          const allSnap = await getDocs(query(collection(db, 'participants')));
          const assigned = allSnap.docs
            .filter((d) => d.data().isCheckedIn && d.data().playernumber != null)
            .map((d) => d.data().playernumber as number)
            .sort((a, b) => a - b);
          const gaps: number[] = [];
          for (let i = 1; assigned.length > 0 && i < assigned[assigned.length - 1]; i++) {
            if (!assigned.includes(i)) gaps.push(i);
          }
          const num = gaps.length > 0 ? gaps[0] : (assigned.length > 0 ? assigned[assigned.length - 1] + 1 : 1);
          transaction.update(ref, {
            isCheckedIn: true,
            playernumber: num,
            checkedInAt: new Date(),
            checkedInBy: user ? user.email : 'unknown',
          });
          setSuccess(`${participant?.firstName} ${participant?.lastName} checked in as Player #${num}.`);
        }
      });
      setSelectedId(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update check-in status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 px-8">
      <div className="pt-6 pb-3 flex-shrink-0 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
          <Input
            placeholder="Search for participant"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex rounded overflow-hidden border border-white/10 w-fit">
          {([['pending', 'Pending'], ['checkedin', 'Checked In'], ['all', 'All']] as [CheckInFilter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => { setCheckInFilter(f); setSelectedId(null); }}
              className={cn(
                'px-3 py-1 text-xs font-medium transition-colors h-7',
                checkInFilter === f ? 'bg-[#E84784] text-white' : 'bg-white/5 text-white/50 hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && <p className="text-green-400 text-xs">{success}</p>}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 admin-table-scroll pb-2">
        <table className="table-fixed w-full text-sm">
          <thead className="sticky top-0">
            <tr>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pl-3 pr-4 w-[22%]" style={{ backgroundColor: CARD_BG }}>First Name</th>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pr-4 w-[22%]" style={{ backgroundColor: CARD_BG }}>Last Name</th>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pr-4 w-[40%]" style={{ backgroundColor: CARD_BG }}>Email Address</th>
              <th className="text-left text-xs text-white/50 font-medium pb-3 w-[16%]" style={{ backgroundColor: CARD_BG }}>Year</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white/40">No participants found.</td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                  className={cn(
                    'border-t border-white/10 cursor-pointer transition-colors',
                    p.id === selectedId ? 'bg-[#E84784]/15' : 'hover:bg-white/5'
                  )}
                >
                  <td className="py-3.5 pl-3 pr-4 text-white truncate">{p.firstName}</td>
                  <td className="py-3.5 pr-4 text-white truncate">{p.lastName}</td>
                  <td className="py-3.5 pr-4 text-white/70 truncate">{p.email}</td>
                  <td className="py-3.5 text-white/70 truncate">{p.classification}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-3 pb-5 flex-shrink-0">
        <Button
          onClick={() => selectedId && handleCheckIn(selectedId)}
          disabled={!selectedId || !!updating}
          className="w-full h-10 bg-[#E84784] hover:bg-[#E84784]/90 text-white font-sunday uppercase tracking-widest text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating
            ? 'Processing...'
            : selected
              ? `${selected.isCheckedIn ? 'Undo Check In' : 'Check In'} — ${selected.firstName} ${selected.lastName}`
              : 'Check In'
          }
        </Button>
      </div>
    </div>
  );
}

function EliminateTab({ participants }: { participants: Participant[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<YearFilter>('All');
  const [sortField, setSortField] = useState<SortField>('lastName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [eliminatedFilter, setEliminatedFilter] = useState<EliminatedFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmEliminate, setConfirmEliminate] = useState<Participant | null>(null);
  const [elimByNumInput, setElimByNumInput] = useState('');
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'metadata', 'counter'), (snapshot) => {
      if (snapshot.exists()) setCurrentRound(snapshot.data().currentround || 1);
    });
    return () => unsub();
  }, []);

  const filtered = participants
    .filter((p) => {
      if (!p.isCheckedIn) return false;
      if (yearFilter !== 'All' && p.classification !== yearFilter) return false;
      if (eliminatedFilter === 'active' && p.iseliminated) return false;
      if (eliminatedFilter === 'eliminated' && !p.iseliminated) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.playernumber !== null && String(p.playernumber).includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const va = sortField === 'firstName' ? a.firstName : a.lastName;
      const vb = sortField === 'firstName' ? b.firstName : b.lastName;
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const checkedIn = participants.filter((p) => p.isCheckedIn);
  const activeCount = checkedIn.filter((p) => !p.iseliminated).length;
  const eliminatedCount = checkedIn.filter((p) => p.iseliminated).length;

  const handleEliminate = async (participant: Participant) => {
    setUpdating(participant.id);
    setError(null);
    try {
      await updateDoc(doc(db, 'participants', participant.id), {
        iseliminated: true,
        eliminatedround: currentRound,
        eliminatedAt: new Date(),
      });
      setSuccess(`${participant.firstName} ${participant.lastName} eliminated.`);
      setSelectedId(null);
      setConfirmEliminate(null);
      setElimByNumInput('');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to eliminate participant.');
    } finally {
      setUpdating(null);
    }
  };

  const handleRevive = async (participant: Participant) => {
    setUpdating(participant.id);
    setError(null);
    try {
      await updateDoc(doc(db, 'participants', participant.id), {
        iseliminated: false,
        eliminatedround: null,
        eliminatedAt: null,
      });
      setSuccess(`${participant.firstName} ${participant.lastName} revived.`);
      setSelectedId(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to revive participant.');
    } finally {
      setUpdating(null);
    }
  };

  const handleElimByNum = () => {
    const num = parseInt(elimByNumInput.trim());
    if (isNaN(num)) { setError('Enter a valid player number.'); return; }
    setError(null);
    const player = participants.find((p) => p.playernumber === num && !p.iseliminated);
    if (!player) { setError(`Player #${num} not found or already eliminated.`); return; }
    setConfirmEliminate(player);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  return (
    <div className="h-full flex flex-col min-h-0 px-8">
      <div className="pt-6 pb-3 flex-shrink-0 space-y-3">
        <div className="flex gap-4 text-xs">
          <span className="text-white/50">Checked In: <span className="text-white font-bold">{checkedIn.length}</span></span>
          <span className="text-white/30">|</span>
          <span className="text-white/50">Active: <span className="text-green-400 font-bold">{activeCount}</span></span>
          <span className="text-white/30">|</span>
          <span className="text-white/50">Eliminated: <span className="text-red-400 font-bold">{eliminatedCount}</span></span>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
          <Input
            placeholder="Search for participant"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={yearFilter} onValueChange={(v) => setYearFilter(v as YearFilter)}>
            <SelectTrigger className="w-32 h-8 bg-white/5 border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: INPUT_BG, borderColor: INPUT_BORDER }}>
              <SelectGroup>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={y} className="text-white focus:bg-white/10 focus:text-white">{y}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {(['firstName', 'lastName'] as SortField[]).map((f) => (
            <button
              key={f}
              onClick={() => toggleSort(f)}
              className={cn(
                'px-3 py-1 rounded text-xs font-medium border h-8 transition-colors',
                sortField === f
                  ? 'bg-[#E84784]/20 border-[#E84784] text-[#E84784]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
              )}
            >
              {f === 'firstName' ? 'First Name' : 'Last Name'} {sortField === f ? (sortDir === 'asc' ? 'A→Z' : 'Z→A') : ''}
            </button>
          ))}

          <div className="flex rounded overflow-hidden border border-white/10">
            {([['all', 'All'], ['active', 'Active'], ['eliminated', 'Eliminated']] as [EliminatedFilter, string][]).map(([f, label]) => (
              <button
                key={f}
                onClick={() => setEliminatedFilter(f)}
                className={cn(
                  'px-3 py-1 text-xs font-medium transition-colors h-8',
                  eliminatedFilter === f ? 'bg-[#E84784] text-white' : 'bg-white/5 text-white/50 hover:text-white'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
            <Input
              type="number"
              placeholder="Eliminate by Player #"
              value={elimByNumInput}
              onChange={(e) => setElimByNumInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleElimByNum()}
              className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-lg text-sm"
            />
          </div>
          <Button
            onClick={handleElimByNum}
            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs px-4"
          >
            <Skull className="h-4 w-4 mr-1" /> Eliminate
          </Button>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && <p className="text-green-400 text-xs">{success}</p>}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 admin-table-scroll pb-2">
        <table className="w-full text-sm">
          <thead className="sticky top-0">
            <tr>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pl-3 pr-4" style={{ backgroundColor: CARD_BG }}>First Name</th>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pr-4" style={{ backgroundColor: CARD_BG }}>Last Name</th>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pr-4" style={{ backgroundColor: CARD_BG }}>Email Address</th>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pr-4" style={{ backgroundColor: CARD_BG }}>Year</th>
              <th className="text-left text-xs text-white/50 font-medium pb-3 pr-4" style={{ backgroundColor: CARD_BG }}>Status</th>
              <th className="pb-3" style={{ backgroundColor: CARD_BG }} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/40">No participants found.</td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                  className={cn(
                    'border-t border-white/10 cursor-pointer transition-colors',
                    p.id === selectedId ? 'bg-[#E84784]/15' : 'hover:bg-white/5',
                    p.iseliminated && 'opacity-50'
                  )}
                >
                  <td className={cn('py-3 pl-3 pr-4 text-white', p.iseliminated && 'line-through text-white/40')}>
                    {p.firstName}
                  </td>
                  <td className={cn('py-3 pr-4 text-white', p.iseliminated && 'line-through text-white/40')}>
                    {p.lastName}
                  </td>
                  <td className="py-3 pr-4 text-white/70">{p.email}</td>
                  <td className="py-3 pr-4 text-white/70">{p.classification}</td>
                  <td className="py-3 pr-4">
                    {p.iseliminated ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
                        <Skull className="h-3 w-3" /> Eliminated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    {p.id === selectedId && (
                      p.iseliminated ? (
                        <Button
                          size="sm"
                          onClick={() => handleRevive(p)}
                          disabled={updating === p.id}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                        >
                          <Heart className="h-3 w-3 mr-1" /> Revive
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setConfirmEliminate(p)}
                          disabled={updating === p.id}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs h-7 px-3"
                        >
                          <Skull className="h-3 w-3 mr-1" /> Eliminate
                        </Button>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pb-4 flex-shrink-0" />

      <AlertDialog
        open={!!confirmEliminate}
        onOpenChange={(open) => { if (!open) { setConfirmEliminate(null); setElimByNumInput(''); } }}
      >
        <AlertDialogContent style={{ backgroundColor: '#2a2a2a', borderColor: '#555' }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Skull className="h-5 w-5 text-red-400" />
              Eliminate {confirmEliminate?.firstName} {confirmEliminate?.lastName}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Marks them as eliminated (Round {currentRound}). You can revive them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ backgroundColor: '#3c3c3c', borderColor: '#555', color: 'white' }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmEliminate && handleEliminate(confirmEliminate)}
              disabled={!!updating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {updating ? 'Eliminating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'adduser', label: 'Add User' },
  { id: 'checkin', label: 'Check In' },
  { id: 'eliminate', label: 'Eliminate' },
];

function ParticipantManagementInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const rawTab = searchParams.get('tab');
  const activeTab: Tab = (rawTab === 'checkin' || rawTab === 'eliminate') ? rawTab : 'adduser';

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'participants')),
      (snapshot) => {
        setParticipants(
          snapshot.docs.map((d) => ({
            id: d.id,
            firstName: d.data().firstName || '',
            lastName: d.data().lastName || '',
            email: d.data().email || '',
            classification: d.data().classification || '',
            isCheckedIn: !!d.data().isCheckedIn,
            playernumber: d.data().playernumber ?? null,
            iseliminated: !!d.data().iseliminated,
            eliminatedround: d.data().eliminatedround || 0,
          }))
        );
        setLoading(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const switchTab = (tab: Tab) => {
    router.push(`/admin?tab=${tab}`, { scroll: false });
  };

  if (loading) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center h-[620px]"
        style={{ backgroundColor: CARD_BG }}
      >
        <RefreshCw className="animate-spin h-8 w-8 text-[#E84784]" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col h-[620px]"
      style={{ backgroundColor: CARD_BG }}
    >
      <div className="flex justify-center pt-3 flex-shrink-0">
        <div className="flex gap-4 border-b border-white px-3">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={cn(
                'pb-3 font-sunday text-sm uppercase tracking-widest transition-colors',
                activeTab === id
                  ? 'text-white'
                  : 'text-white/35 hover:text-white/70'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'adduser' && <AddUserTab />}
        {activeTab === 'checkin' && <CheckInTab participants={participants} />}
        {activeTab === 'eliminate' && <EliminateTab participants={participants} />}
      </div>
    </div>
  );
}

export function ParticipantManagement() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl flex items-center justify-center h-[620px]" style={{ backgroundColor: CARD_BG }}>
          <RefreshCw className="animate-spin h-8 w-8 text-[#E84784]" />
        </div>
      }
    >
      <ParticipantManagementInner />
    </Suspense>
  );
}
