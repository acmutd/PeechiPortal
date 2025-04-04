"use client"

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, doc, runTransaction, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Search, RefreshCw } from "lucide-react";

type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  discordUsername: string;
  school: string;
  classification: string;
  isCheckedIn: boolean;
  playernumber: number | null;
  iseliminated: boolean;
  eliminatedround: number;
};

export function CheckInSystem() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPlayerNumber, setNextPlayerNumber] = useState(1);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>("Checking authentication...");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setAuthStatus(`Authenticated as: ${user.email}`);
        console.log("User is signed in:", user.email);
      } else {
        // User is signed out
        setAuthStatus("Not authenticated. Please sign in.");
        console.log("User is not signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to calculate the next available player number and any gaps in the sequence
  const calculateAvailableNumbers = (participants: Participant[]) => {
    // Get all currently assigned player numbers
    const assignedNumbers = participants
      .filter(p => p.isCheckedIn && p.playernumber !== null)
      .map(p => p.playernumber as number)
      .sort((a, b) => a - b);
    
    // Find gaps in the sequence
    const gaps: number[] = [];
    if (assignedNumbers.length > 0) {
      for (let i = 1; i < assignedNumbers[assignedNumbers.length - 1]; i++) {
        if (!assignedNumbers.includes(i)) {
          gaps.push(i);
        }
      }
      
      // Set the next player number to be one more than the highest assigned number
      setNextPlayerNumber(assignedNumbers[assignedNumbers.length - 1] + 1);
    } else {
      // If no numbers are assigned, start from 1
      setNextPlayerNumber(1);
    }
    
    // Store available gap numbers
    setAvailableNumbers(gaps);
    
    return { nextNum: assignedNumbers.length > 0 ? assignedNumbers[assignedNumbers.length - 1] + 1 : 1, gaps };
  };

  const fetchParticipants = async () => {
    try {
      setRefreshing(true);
      const db = getFirestore(app);
      const q = query(collection(db, "participants"));
      const querySnapshot = await getDocs(q);
      
      const participantsData: Participant[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        participantsData.push({
          id: doc.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          discordUsername: data.discordUsername || '',
          school: data.school || '',
          classification: data.classification || '',
          isCheckedIn: !!data.isCheckedIn,
          playernumber: data.playernumber,
          iseliminated: !!data.iseliminated,
          eliminatedround: data.eliminatedround || 0
        });
      });

      // Sort alphabetically by last name
      participantsData.sort((a, b) => a.lastName.localeCompare(b.lastName));
      setParticipants(participantsData);
      setFilteredParticipants(participantsData);

      // Calculate next available player number and gaps in number sequence
      calculateAvailableNumbers(participantsData);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError("Failed to load participants. Please try refreshing the page.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
    
    // Set up real-time listener for participant changes
    const db = getFirestore(app);
    const unsubscribe = onSnapshot(collection(db, "participants"), () => {
      // Only refresh data if it's not caused by our own updates
      if (!updating) {
        fetchParticipants();
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredParticipants(participants);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = participants.filter(
        p => p.firstName.toLowerCase().includes(query) || 
            p.lastName.toLowerCase().includes(query) || 
            p.email.toLowerCase().includes(query)
      );
      setFilteredParticipants(filtered);
    }
  }, [searchQuery, participants]);

  const handleCheckIn = async (participantId: string) => {
    setUpdating(participantId);
    setError(null);
    setCheckInSuccess(null);
    
    try {
      const db = getFirestore(app);
      const auth = getAuth(app);
      const user = auth.currentUser;
      
      console.log("Current auth user:", user ? user.email : "Not authenticated");
      
      // Use a transaction to ensure global consistency
      await runTransaction(db, async (transaction) => {
        // Get the latest data
        const participantRef = doc(db, "participants", participantId);
        const participantSnapshot = await transaction.get(participantRef);
        
        if (!participantSnapshot.exists()) {
          throw new Error("Participant doesn't exist!");
        }
        
        const participantData = participantSnapshot.data();
        const participant = participants.find(p => p.id === participantId);
        
        if (participantData.isCheckedIn) {
          // Undoing check-in - free up the player number
          transaction.update(participantRef, {
            isCheckedIn: false,
            playernumber: null
          });
          
          // Update local state after transaction completes
          setParticipants(prev => 
            prev.map(p => 
              p.id === participantId 
                ? { ...p, isCheckedIn: false, playernumber: null } 
                : p
            )
          );
          
          setCheckInSuccess(`${participant?.firstName} ${participant?.lastName} has been removed from check-in.`);
        } else {
          // Need to determine appropriate player number
          // First, get all checked-in players to determine the next number
          const allParticipantsQuery = query(collection(db, "participants"));
          const allParticipantsSnapshot = await getDocs(allParticipantsQuery);
          
          const checkedInParticipants: { playernumber: number | null }[] = [];
          allParticipantsSnapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
            const data = docSnapshot.data();
            if (data.isCheckedIn) {
              checkedInParticipants.push({ playernumber: data.playernumber });
            }
          });
          
          // Calculate next available number or use a gap
          let numberToAssign: number;
          
          // Get all currently assigned numbers
          const assignedNumbers = checkedInParticipants
            .filter(p => p.playernumber !== null)
            .map(p => p.playernumber as number)
            .sort((a, b) => a - b);
          
          // Find gaps in the sequence
          const gaps: number[] = [];
          if (assignedNumbers.length > 0) {
            for (let i = 1; i < assignedNumbers[assignedNumbers.length - 1]; i++) {
              if (!assignedNumbers.includes(i)) {
                gaps.push(i);
              }
            }
          }
          
          // Use the first gap, or the next sequential number if no gaps
          if (gaps.length > 0) {
            numberToAssign = gaps[0];
          } else {
            numberToAssign = assignedNumbers.length > 0 
              ? assignedNumbers[assignedNumbers.length - 1] + 1 
              : 1;
          }
          
          transaction.update(participantRef, {
            isCheckedIn: true,
            playernumber: numberToAssign,
            checkedInAt: new Date(),
            checkedInBy: user ? user.email : "unknown"
          });
          
          // Update local state after transaction completes
          setParticipants(prev => 
            prev.map(p => 
              p.id === participantId 
                ? { ...p, isCheckedIn: true, playernumber: numberToAssign } 
                : p
            )
          );
          
          setCheckInSuccess(`${participant?.firstName} ${participant?.lastName} checked in as Player #${numberToAssign}.`);
        }
      });
      
      // After the transaction completes, refresh all data
      await fetchParticipants();
      
    } catch (error: unknown) {
      console.error("Error updating check-in status:", error);
      setError(`Failed to update check-in status: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUpdating(null);
      
      // Clear success message after 3 seconds
      if (checkInSuccess) {
        setTimeout(() => setCheckInSuccess(null), 3000);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading participants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/20 text-blue-500 p-4 rounded-md mb-4">
        Authentication Status: {authStatus}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center flex-1 space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={fetchParticipants} 
          disabled={refreshing}
          className="w-full md:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-500/20 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {checkInSuccess && (
        <div className="bg-green-500/20 text-green-500 p-4 rounded-md">
          {checkInSuccess}
        </div>
      )}
      
      <div className="bg-white/5 p-4 rounded-md">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Next Sequential Number: <span className="font-bold">{nextPlayerNumber}</span>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Checked In: <span className="font-bold">{participants.filter(p => p.isCheckedIn).length}</span> / {participants.length}
            </div>
          </div>
          
          {availableNumbers.length > 0 && (
            <div className="mt-3 md:mt-0">
              <div className="text-sm text-muted-foreground">
                Available Gap Numbers: <span className="font-bold">{availableNumbers.slice(0, 5).join(', ')}{availableNumbers.length > 5 ? `, +${availableNumbers.length - 5} more` : ''}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                These will be assigned first before using higher numbers
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] hidden md:table-cell">Player #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">School</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No participants found. Try a different search.
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((participant) => (
                <TableRow key={participant.id} 
                  className={participant.isCheckedIn ? "bg-green-500/10" : ""}>
                  <TableCell className="font-bold hidden md:table-cell">
                    {participant.playernumber || "-"}
                  </TableCell>
                  <TableCell>
                    {participant.firstName} {participant.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {participant.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {participant.school}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={participant.isCheckedIn ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleCheckIn(participant.id)}
                      disabled={updating === participant.id}
                    >
                      {updating === participant.id ? (
                        "Processing..."
                      ) : participant.isCheckedIn ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" /> Undo
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" /> Check In
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