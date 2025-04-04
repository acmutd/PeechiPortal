"use client"

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { app } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Search, Filter, RefreshCw, UserX } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";

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

export function EliminationSystem() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'eliminated'>('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [playerNumberToEliminate, setPlayerNumberToEliminate] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const db = getFirestore(app);
        const q = query(collection(db, "participants"), where("isCheckedIn", "==", true));
        const querySnapshot = await getDocs(q);
        
        const participantsData: Participant[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          participantsData.push({
            id: doc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            school: data.school || '',
            classification: data.classification || '',
            isCheckedIn: !!data.isCheckedIn,
            playernumber: data.playernumber,
            iseliminated: !!data.iseliminated,
            eliminatedround: data.eliminatedround || 0
          });
        });

        // Sort by player number
        participantsData.sort((a, b) => {
          if (a.playernumber === null) return 1;
          if (b.playernumber === null) return -1;
          return a.playernumber - b.playernumber;
        });
        
        setParticipants(participantsData);
        setFilteredParticipants(participantsData);
        
        // Find the highest elimination round to set the current round
        const highestRound = Math.max(0, ...participantsData.map(p => p.eliminatedround || 0));
        setCurrentRound(highestRound > 0 ? highestRound : 1);
      } catch (error) {
        console.error("Error fetching participants:", error);
        setActionStatus({
          type: 'error',
          message: "Failed to load participants. Please try refreshing the page."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    let filtered = [...participants];
    
    // Apply status filter
    if (filterType === 'active') {
      filtered = filtered.filter(p => !p.iseliminated);
    } else if (filterType === 'eliminated') {
      filtered = filtered.filter(p => p.iseliminated);
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p => {
          // First try to match player number if query is a number
          if (!isNaN(parseInt(query)) && p.playernumber === parseInt(query)) {
            return true;
          }
          // Otherwise search by name or email
          return p.firstName.toLowerCase().includes(query) || 
                 p.lastName.toLowerCase().includes(query) || 
                 p.email.toLowerCase().includes(query);
        }
      );
    }
    
    setFilteredParticipants(filtered);
  }, [searchQuery, filterType, participants]);

  const handleEliminate = async (participantId: string) => {
    setUpdating(participantId);
    setActionStatus(null);
    
    try {
      const db = getFirestore(app);
      const participantDoc = doc(db, "participants", participantId);
      
      // Find the participant to check current status
      const participant = participants.find(p => p.id === participantId);
      
      if (participant?.iseliminated) {
        // If already eliminated, we're undoing the elimination
        await updateDoc(participantDoc, {
          iseliminated: false,
          eliminatedround: 0
        });
        
        // Update local state
        setParticipants(prev => 
          prev.map(p => 
            p.id === participantId 
              ? { ...p, iseliminated: false, eliminatedround: 0 } 
              : p
          )
        );
        
        setActionStatus({
          type: 'success',
          message: `Player #${participant.playernumber} (${participant.firstName} ${participant.lastName}) has been reinstated.`
        });
      } else {
        // Otherwise we're eliminating them
        await updateDoc(participantDoc, {
          iseliminated: true,
          eliminatedround: currentRound
        });
        
        // Update local state
        setParticipants(prev => 
          prev.map(p => 
            p.id === participantId 
              ? { ...p, iseliminated: true, eliminatedround: currentRound } 
              : p
          )
        );
        
        setActionStatus({
          type: 'success',
          message: `Player #${participant?.playernumber} (${participant?.firstName} ${participant?.lastName}) has been eliminated in round ${currentRound}.`
        });
      }
    } catch (error) {
      console.error("Error updating elimination status:", error);
      setActionStatus({
        type: 'error',
        message: "Failed to update elimination status. Please try again."
      });
    } finally {
      setUpdating(null);
      
      // Clear success message after 5 seconds
      if (actionStatus?.type === 'success') {
        setTimeout(() => setActionStatus(null), 5000);
      }
    }
  };

  const handleEliminateByNumber = async () => {
    if (!playerNumberToEliminate) return;
    
    const playerNumber = parseInt(playerNumberToEliminate);
    if (isNaN(playerNumber)) {
      setActionStatus({
        type: 'error',
        message: "Please enter a valid player number."
      });
      return;
    }
    
    const participant = participants.find(p => p.playernumber === playerNumber);
    if (!participant) {
      setActionStatus({
        type: 'error',
        message: `No player found with number ${playerNumber}.`
      });
      return;
    }
    
    // If already eliminated, show error
    if (participant.iseliminated) {
      setActionStatus({
        type: 'error',
        message: `Player #${playerNumber} is already eliminated.`
      });
      return;
    }
    
    await handleEliminate(participant.id);
    setPlayerNumberToEliminate('');
  };

  const refreshParticipants = async () => {
    setLoading(true);
    setActionStatus(null);
    
    try {
      const db = getFirestore(app);
      const q = query(collection(db, "participants"), where("isCheckedIn", "==", true));
      const querySnapshot = await getDocs(q);
      
      const participantsData: Participant[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        participantsData.push({
          id: doc.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          school: data.school || '',
          classification: data.classification || '',
          isCheckedIn: !!data.isCheckedIn,
          playernumber: data.playernumber,
          iseliminated: !!data.iseliminated,
          eliminatedround: data.eliminatedround || 0
        });
      });

      // Sort by player number
      participantsData.sort((a, b) => {
        if (a.playernumber === null) return 1;
        if (b.playernumber === null) return -1;
        return a.playernumber - b.playernumber;
      });
      
      setParticipants(participantsData);
      setFilteredParticipants(participantsData);
      
      setActionStatus({
        type: 'success',
        message: "Participant list refreshed successfully."
      });
    } catch (error) {
      console.error("Error refreshing participants:", error);
      setActionStatus({
        type: 'error',
        message: "Failed to refresh participants. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading participants...</div>;
  }

  const activePlayers = participants.filter(p => !p.iseliminated).length;
  const eliminatedPlayers = participants.filter(p => p.iseliminated).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or player #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={(value: 'all' | 'active' | 'eliminated') => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Players</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="eliminated">Eliminated Only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={refreshParticipants} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {actionStatus && (
        <div className={`${actionStatus.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'} p-4 rounded-md`}>
          {actionStatus.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 p-4 rounded-md flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current Round</div>
            <div className="text-2xl font-bold">{currentRound}</div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentRound(prev => Math.max(1, prev - 1))}
            >
              -
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentRound(prev => prev + 1)}
            >
              +
            </Button>
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-md">
          <div className="text-sm text-muted-foreground">Players Remaining</div>
          <div className="text-2xl font-bold text-green-500">{activePlayers} / {participants.length}</div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-md">
          <div className="text-sm text-muted-foreground">Players Eliminated</div>
          <div className="text-2xl font-bold text-red-500">{eliminatedPlayers}</div>
        </div>
      </div>
      
      <div className="bg-white/5 p-4 rounded-md">
        <h3 className="font-medium mb-2">Quick Elimination</h3>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter player number..."
            value={playerNumberToEliminate}
            onChange={(e) => setPlayerNumberToEliminate(e.target.value)}
            className="w-full max-w-xs"
            type="number"
          />
          <Button 
            variant="destructive"
            onClick={handleEliminateByNumber}
            disabled={!playerNumberToEliminate || loading}
          >
            <UserX className="h-4 w-4 mr-2" />
            Eliminate
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Player #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">School</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px] hidden md:table-cell">Round</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No players found. Try a different search or filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((participant) => (
                <TableRow key={participant.id} 
                  className={participant.iseliminated ? "bg-red-500/10" : "bg-green-500/10"}>
                  <TableCell className="font-bold">
                    {participant.playernumber || "-"}
                  </TableCell>
                  <TableCell>
                    {participant.firstName} {participant.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {participant.school}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      participant.iseliminated 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }`}>
                      {participant.iseliminated ? "Eliminated" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {participant.eliminatedround > 0 ? participant.eliminatedround : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={participant.iseliminated ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => handleEliminate(participant.id)}
                      disabled={updating === participant.id}
                    >
                      {updating === participant.id ? (
                        "Processing..."
                      ) : participant.iseliminated ? (
                        "Reinstate"
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" /> Eliminate
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 