"use client"

import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { app } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowUpDown, UserPlus, Trash2, Shield, ShieldOff, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  classification: string;
  isCheckedIn: boolean;
  playernumber: number | null;
  iseliminated: boolean;
  eliminatedround: number;
};

export function ParticipantManagement() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'checkin' | 'adduser'>('checkin');

  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [checkInFilter, setCheckInFilter] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');
  const [sortField, setSortField] = useState<'firstName' | 'lastName'>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newClassification, setNewClassification] = useState('Freshman');

  const [updating, setUpdating] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const db = getFirestore(app);
    const unsubscribe = onSnapshot(collection(db, "participants"), (snapshot) => {
      const data: Participant[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        data.push({
          id: docSnap.id,
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: d.email || '',
          school: d.school || '',
          classification: d.classification || '',
          isCheckedIn: !!d.isCheckedIn,
          playernumber: d.playernumber ?? null,
          iseliminated: !!d.iseliminated,
          eliminatedround: d.eliminatedround || 0,
        });
      });
      setParticipants(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = [...participants];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    }

    if (yearFilter !== 'all') {
      result = result.filter(p => p.classification === yearFilter);
    }

    if (checkInFilter === 'checked-in') {
      result = result.filter(p => p.isCheckedIn);
    } else if (checkInFilter === 'not-checked-in') {
      result = result.filter(p => !p.isCheckedIn);
    }

    result.sort((a, b) => {
      const valA = a[sortField].toLowerCase();
      const valB = b[sortField].toLowerCase();
      const cmp = valA.localeCompare(valB);
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    setFilteredParticipants(result);
  }, [participants, searchQuery, yearFilter, checkInFilter, sortField, sortDirection]);

  useEffect(() => {
    if (actionStatus) {
      const timer = setTimeout(() => setActionStatus(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionStatus]);

  const toggleSort = () => {
    if (sortField === 'lastName') {
      setSortField('firstName');
    } else {
      setSortField('lastName');
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    }
  };

  const handleCheckIn = async (participant: Participant) => {
    setUpdating(participant.id);
    try {
      const db = getFirestore(app);
      const ref = doc(db, "participants", participant.id);
      await updateDoc(ref, { isCheckedIn: !participant.isCheckedIn });
      setActionStatus({
        type: 'success',
        message: participant.isCheckedIn
          ? `${participant.firstName} ${participant.lastName} unchecked.`
          : `${participant.firstName} ${participant.lastName} checked in.`
      });
    } catch {
      setActionStatus({ type: 'error', message: 'Failed to update check-in status.' });
    } finally {
      setUpdating(null);
      setShowDetailDialog(false);
    }
  };

  const handleEliminate = async (participant: Participant) => {
    setUpdating(participant.id);
    try {
      const db = getFirestore(app);
      const ref = doc(db, "participants", participant.id);
      await updateDoc(ref, { iseliminated: true, eliminatedround: 1 });
      setActionStatus({
        type: 'success',
        message: `${participant.firstName} ${participant.lastName} has been eliminated.`
      });
    } catch {
      setActionStatus({ type: 'error', message: 'Failed to eliminate participant.' });
    } finally {
      setUpdating(null);
      setShowDetailDialog(false);
    }
  };

  const handleRevive = async (participant: Participant) => {
    setUpdating(participant.id);
    try {
      const db = getFirestore(app);
      const ref = doc(db, "participants", participant.id);
      await updateDoc(ref, { iseliminated: false, eliminatedround: 0 });
      setActionStatus({
        type: 'success',
        message: `${participant.firstName} ${participant.lastName} has been revived.`
      });
    } catch {
      setActionStatus({ type: 'error', message: 'Failed to revive participant.' });
    } finally {
      setUpdating(null);
      setShowDetailDialog(false);
    }
  };

  const handleDelete = async (participant: Participant) => {
    setUpdating(participant.id);
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "participants", participant.id));
      setActionStatus({
        type: 'success',
        message: `${participant.firstName} ${participant.lastName} has been deleted.`
      });
    } catch {
      setActionStatus({ type: 'error', message: 'Failed to delete participant.' });
    } finally {
      setUpdating(null);
      setShowDetailDialog(false);
      setShowDeleteConfirm(false);
      setSelectedParticipant(null);
    }
  };

  const handleAddParticipant = async () => {
    if (!newFirstName.trim() || !newLastName.trim() || !newEmail.trim()) {
      setActionStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "participants"), {
        firstName: newFirstName.trim(),
        lastName: newLastName.trim(),
        email: newEmail.trim(),
        classification: newClassification,
        eliminatedround: 0,
        discordUsername: '',
        school: '',
        optin: false,
        signup: new Date(),
        iseliminated: false,
        playernumber: null,
        isCheckedIn: false,
      });

      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewClassification('Freshman');
      setActiveTab('checkin');
      setActionStatus({ type: 'success', message: 'Participant added successfully.' });
    } catch {
      setActionStatus({ type: 'error', message: 'Failed to add participant.' });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading participants...</div>;
  }

  const totalCount = participants.length;
  const checkedInCount = participants.filter(p => p.isCheckedIn).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`text-sm font-semibold tracking-wider uppercase pb-1 border-b-2 transition-colors ${
            activeTab === 'checkin'
              ? 'border-white text-white'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
        >
          Check In
        </button>
        <button
          onClick={() => setActiveTab('adduser')}
          className={`text-sm font-semibold tracking-wider uppercase pb-1 border-b-2 transition-colors ${
            activeTab === 'adduser'
              ? 'border-white text-white'
              : 'border-transparent text-muted-foreground hover:text-white'
          }`}
        >
          Add User
        </button>
      </div>

      {actionStatus && (
        <div className={`${actionStatus.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'} p-4 rounded-md`}>
          {actionStatus.message}
        </div>
      )}

      {activeTab === 'checkin' ? (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Total Players: <span className="font-bold text-white">{totalCount}</span>
              <span className="ml-4">Checked In: <span className="font-bold text-green-500">{checkedInCount}</span></span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for participant"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Year Standing" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="Freshman">Freshman</SelectItem>
                  <SelectItem value="Sophomore">Sophomore</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={checkInFilter} onValueChange={(v: 'all' | 'checked-in' | 'not-checked-in') => setCheckInFilter(v)}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Check-in Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="not-checked-in">Not Checked In</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={toggleSort} className="gap-1">
              <ArrowUpDown className="h-4 w-4" />
              Sort: {sortField === 'firstName' ? 'First' : 'Last'} Name ({sortDirection === 'asc' ? 'A-Z' : 'Z-A'})
            </Button>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email Address</TableHead>
                  <TableHead>Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No participants found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParticipants.map((participant) => (
                    <TableRow
                      key={participant.id}
                      className={`cursor-pointer transition-colors ${
                        selectedParticipant?.id === participant.id
                          ? 'bg-pink-500/20'
                          : participant.iseliminated
                            ? 'bg-red-500/10'
                            : participant.isCheckedIn
                              ? 'bg-green-500/10'
                              : ''
                      }`}
                      onClick={() => {
                        setSelectedParticipant(participant);
                        setShowDetailDialog(true);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {participant.isCheckedIn && (
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                          )}
                          {participant.iseliminated && (
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                          )}
                          {participant.firstName}
                        </div>
                      </TableCell>
                      <TableCell>{participant.lastName}</TableCell>
                      <TableCell className="hidden md:table-cell">{participant.email}</TableCell>
                      <TableCell>{participant.classification}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {selectedParticipant && !showDetailDialog && (
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg py-6"
              onClick={() => handleCheckIn(selectedParticipant)}
              disabled={updating === selectedParticipant.id}
            >
              {updating === selectedParticipant.id
                ? 'Processing...'
                : selectedParticipant.isCheckedIn
                  ? 'UNDO CHECK IN'
                  : 'CHECK IN'}
            </Button>
          )}
        </>
      ) : (
        <div className="space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <Input
              placeholder="First name"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <Input
              placeholder="Last name"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Year Standing</label>
            <Select value={newClassification} onValueChange={setNewClassification}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Freshman">Freshman</SelectItem>
                  <SelectItem value="Sophomore">Sophomore</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-6"
            onClick={handleAddParticipant}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            ADD PARTICIPANT
          </Button>
        </div>
      )}

      <AlertDialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <AlertDialogContent>
          {selectedParticipant && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedParticipant.firstName} {selectedParticipant.lastName}
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <p>Email: {selectedParticipant.email}</p>
                    <p>Year: {selectedParticipant.classification}</p>
                    <p>
                      Status:{' '}
                      {selectedParticipant.iseliminated ? (
                        <span className="text-red-500 font-medium">Eliminated (Round {selectedParticipant.eliminatedround})</span>
                      ) : (
                        <span className="text-green-500 font-medium">Active</span>
                      )}
                    </p>
                    <p>
                      Check-in:{' '}
                      {selectedParticipant.isCheckedIn ? (
                        <span className="text-green-500 font-medium">Checked In{selectedParticipant.playernumber ? ` (#${selectedParticipant.playernumber})` : ''}</span>
                      ) : (
                        <span className="text-muted-foreground">Not Checked In</span>
                      )}
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant={selectedParticipant.isCheckedIn ? 'outline' : 'default'}
                  onClick={() => handleCheckIn(selectedParticipant)}
                  disabled={updating === selectedParticipant.id}
                >
                  {selectedParticipant.isCheckedIn ? (
                    <><XCircle className="h-4 w-4 mr-2" /> Undo Check In</>
                  ) : (
                    <><CheckCircle className="h-4 w-4 mr-2" /> Check In</>
                  )}
                </Button>

                {selectedParticipant.iseliminated ? (
                  <Button
                    variant="outline"
                    onClick={() => handleRevive(selectedParticipant)}
                    disabled={updating === selectedParticipant.id}
                  >
                    <ShieldOff className="h-4 w-4 mr-2" /> Revive
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleEliminate(selectedParticipant)}
                    disabled={updating === selectedParticipant.id}
                  >
                    <Shield className="h-4 w-4 mr-2" /> Eliminate
                  </Button>
                )}

                <Button
                  variant="destructive"
                  className="bg-red-900 hover:bg-red-800"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={updating === selectedParticipant.id}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Participant
                </Button>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Participant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {selectedParticipant?.firstName} {selectedParticipant?.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedParticipant && handleDelete(selectedParticipant)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
