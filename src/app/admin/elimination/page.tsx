'use client'

import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { doc, setDoc, getDoc, getCountFromServer, collection, query, where, getDocs, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase';
import { Input } from '@/components/ui/input';
import { ThemeProvider } from '@/components/theme-provider';
import { Ambulance, Crosshair, Home, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ParticipantInfo = {
  id: string,
  playerNum: number,
  fname: string,
  lname: string,
  isEliminated: boolean,
  eliminatedRound: number
}

function AdminPortal() {
  const [participantList, setParticipantList] = useState<ParticipantInfo[]>([]);
  const [livingPlayers, setLivingPlayers] = useState<ParticipantInfo[]>([]);
  const [deadPlayers, setDeadPlayers] = useState<ParticipantInfo[]>([]);

  const [currentRound, setCurrentRound] = useState(1);
  const [elimInput, setElimInput] = useState('');
  const [reviveInput, setReviveInput] = useState('');

  useEffect(() => {
    updateRegistrants();
    getRoundNumber();
  }, [])

  async function updateRegistrants() {
    try {
      const playersRef = collection(db, "participants");
      const q = query(playersRef, where("playernumber", "!=", ""));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        getRegistrants(); // I really don't get why I have to update in this roundabout way but React gets mad if I don't so shoot 🤷‍♂️
      });
    }
    catch (error) {
      console.error("Failed to get player records: " + error)
    }
  }

  const getRegistrants = async () => {
    try {
      let addPlayers: ParticipantInfo[] = [];

      const playersRef = collection(db, "participants");
      const q = query(playersRef, where("playernumber", "!=", "")); // This query gets all players, but returns it sorted by the query field
      const qSnapshot = await getDocs(q);
      qSnapshot.forEach((doc) => {
        addPlayers.push({
          id: doc.id,
          playerNum: doc.data().playernumber,
          fname: doc.data().firstName,
          lname: doc.data().lastName,
          isEliminated: doc.data().iseliminated,
          eliminatedRound: doc.data().eliminatedround
        })
      })
      setParticipantList(addPlayers);

      setLivingPlayers(addPlayers.filter(person => person.isEliminated === false));
      setDeadPlayers(addPlayers.filter(person => person.isEliminated === true));
    }
    catch (error) {
      console.error("Failed to get player records: " + error)
    }
  }

  async function getRoundNumber() {
    const unsub = onSnapshot(doc(db, "metadata", "counter"), (doc) => {
      setCurrentRound(doc.data()!.currentround)
    });
  }

  async function setRoundNumber(num: number) {
    if (num >= 1) {
      setCurrentRound(num);
      const roundRef = doc(db, "metadata", "counter");
      await updateDoc(roundRef, {
        currentround: num
      })
    }
  }


  async function elimPlayers() {
    if (/^[\d,\s]+$/.test(elimInput)) { // If there are only numbers, commas, and/or whitespaces in the input

      // BASICALLY this needs to take the numbers we want to eliminate, find the id associated with them, and updated isEliminated for those id's in the db
      const elimNums = elimInput.replaceAll(' ', '').split(',').map((element) => parseInt(element));
      let elimIDs: string[] = [];
      let successfullyElimed: number[] = [];

      // This literally runs in O(N^2) time, I am a horrible programmer
      for (let i = 0; i < elimNums.length; i++) {
        for (let j = 0; j < livingPlayers.length; j++) {
          if (livingPlayers[j].playerNum === elimNums[i]) {
            elimIDs.push(livingPlayers[j].id);
            successfullyElimed.push(elimNums[i]);
            // console.log("pushed " + livingPlayers[i].id)
          }
        }
      }
      if (elimIDs.length === 0) {
        window.confirm("No players eliminated.")
      }
      else {
        window.confirm("Players " + successfullyElimed + " eliminated.")
      }
      setElimInput('');
      
      for (let i = 0; i < elimIDs.length; i++) {
        const playerToBeEliminatedRef = doc(db, "participants", elimIDs[i]);
        await updateDoc(playerToBeEliminatedRef, {
          iseliminated: true,
          eliminatedround: currentRound
        })
      }
      getRegistrants();

    }
    else if (elimInput === '') {
      window.confirm("Please enter a value.")
    }
    else {
      window.confirm("Please enter only numbers and commas.")
    }
  }

  // This is basically elimPlayers copied but I don't think optimizing is worth my time here
  async function revivePlayers() {
    if (/^[\d,\s]+$/.test(reviveInput)) { // If there are only numbers, commas, and/or whitespaces in the input
      // console.log(reviveInput)
      const reviveNums = reviveInput.replaceAll(' ', '').split(',').map((element) => parseInt(element));
      let reviveIDs: string[] = [];
      let successfullyRevived: number[] = [];
      // console.log(reviveNums)

      for (let i = 0; i < reviveNums.length; i++) {
        for (let j = 0; j < deadPlayers.length; j++) {
          if (deadPlayers[j].playerNum === reviveNums[i]) {
            reviveIDs.push(deadPlayers[j].id);
            successfullyRevived.push(reviveNums[i]);
          }
        }
      }
      if (reviveIDs.length === 0) {
        window.confirm("No players revived.")
      }
      else {
        window.confirm("Players " + successfullyRevived + " revived.")
      }
      setReviveInput('');

      for (let i = 0; i < reviveIDs.length; i++) {
        const playerToBeRevivedRef = doc(db, "participants", reviveIDs[i]);
        await updateDoc(playerToBeRevivedRef, {
          iseliminated: false,
          eliminatedround: null
        })
      }
      getRegistrants();

    }
    else if (reviveInput === '') {
      window.confirm("Please enter a value.")
    }
    else {
      window.confirm("Please enter only numbers and commas.")
    }
  }

  /* Developer/debug functions */

  // async function setTestPlayers() {
  //   for (let i = 1; i <= 50; i++) {
  //     await setDoc(doc(db, "testParticipants", `testPlayer${i}`), {
  //       playernumber: i,
  //       discordUsername: `discord${i}`,
  //       firstName: `f_name${i}`,
  //       lastName: `l_name${i}`,
  //       iseliminated: false,
  //       eliminatedround: 0
  //     });
  //   }
  //   console.log("Generated test players")
  // }
  // async function resetPlayers() {
  //   for (let i = 1; i <= 50; i++) {
  //     const playersToBeEliminatedRef = doc(db, "testParticipants", `testPlayer${i}`);
  //     await updateDoc(playersToBeEliminatedRef, {
  //       isEliminated: false
  //     })
  //   }
  //   getRegistrants();
  // }


  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>

        <div className='flex flex-col items-center p-4 gap-4 w-full'>

          {/* Developer/debug buttons */}
          {/* <div className='flex flex-row gap-4'>
            <button onClick={() => setTestPlayers()} className='p-4 bg-amber-800 hover:bg-red-700'>
              generate test players
            </button>

            <button onClick={() => resetPlayers()} className='p-4 bg-amber-800 hover:bg-red-700'>
              reset test players
            </button>

            <button onClick={() => getRegistrants()} className='p-4 bg-amber-800 hover:bg-red-700'>
              Refresh
            </button>
          </div> */}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 w-full">
            <div>
              <h1 className="text-3xl font-bold">Peechi Games Elimination Tracker</h1>
              <p className="text-muted-foreground">Track player eliminations and manage game progress</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/check-in">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Check-In
                </Link>
              </Button>
            </div>
          </div>

          {/* Eliminate and revive players */}
          <div className='flex flex-col lg:flex-row gap-4 w-full'>
            <Card className='p-4 w-full'>
              <div>
                <h3 className='text-xl text-center font-bold'>Eliminate Players</h3>
                <p className='text-center' style={{ fontSize: "0.75rem" }}>Enter player numbers in a comma-separated list.</p>
              </div>
              <Input
                value={elimInput}
                onChange={e => setElimInput(e.target.value)}
              />
              <Button variant="destructive" size="lg" onClick={elimPlayers} style={{ backgroundColor: "red" }}>
                <Crosshair className='w-[0.1rem] h-1' />
                Eliminate
              </Button>
            </Card>


            <Card className='p-4 w-full'>
              <div>
                <h3 className='text-xl text-center font-bold'>Revive Players</h3>
                <p className='text-center' style={{ fontSize: "0.75rem" }}>Enter player numbers in a comma-separated list.</p>
              </div>
              <Input
                value={reviveInput}
                onChange={e => setReviveInput(e.target.value)}
              />
              <Button variant="destructive" size="lg" onClick={revivePlayers} style={{ backgroundColor: "green" }}>
                <Ambulance />
                Revive
              </Button>
            </Card>
          </div>

          <div className='flex flex-col lg:flex-row w-full gap-4'>
            <Card className='flex-row justify-between p-4 w-full items-center'>
              <h3 className='text-lg text-center font-bold'>Current Round</h3>
              <div className='flex flex-row items-center gap-4'>
                <h3 style={{ fontSize: "2rem" }} className='font-bold'>{currentRound}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRoundNumber(currentRound - 1)}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRoundNumber(currentRound + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </Card>
            <div className='flex flex-row lg:contents gap-4'>
              <Card className='w-full p-4 items-center gap-2'>
                <h3 className='text-md text-center font-bold'>Players Alive</h3>
                <h3 style={{ fontSize: "2rem", color: "#00cc00" }} className='font-bold'>{livingPlayers.length}/{participantList.length}</h3>
              </Card>
              <Card className='w-full p-4 items-center gap-2'>
                <h3 className='text-md text-center font-bold'>Dead Players</h3>
                <h3 style={{ fontSize: "2rem", color: "#cc0000" }} className='font-bold'>{deadPlayers.length}/{participantList.length}</h3>
              </Card>
            </div>
          </div>


          {/* All living players */}
          <div className='flex flex-col items-center w-full gap-2 mt-8'>
            <h2 className='text-2xl font-bold'>Living Players</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "33% 33% 33%",
                width: "100%",
                gap: "0.5rem"
              }}>
              {livingPlayers.map(person => (
                <Card className='items-center p-0 gap-0' key={person.id}>
                  <div className='flex w-full items-center justify-center p-2' style={{ borderBottomWidth: "1px", minHeight: "2.5rem" }}>
                    <small style={{ fontSize: "0.5rem" }} className='px-3 text-center'>{person.fname} {person.lname}</small>
                  </div>
                  <div className='flex justify-center w-full py-4'>
                    <h3 style={{ fontSize: "2rem" }} className='font-bold'>{person.playerNum}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* All dead players */}
          <div className='flex flex-col items-center w-full gap-2 mt-8'>
            <h2 className='text-2xl font-bold'>Dead Players</h2>
            <div className='grid grid-cols-3 lg:grid-cols-6 gap-4 w-full'
              style={{
                display: "grid",
                gridTemplateColumns: "33% 33% 33%",
                width: "100%",
                gap: "0.5rem"
              }}>
              {deadPlayers.map(person => (
                <Card className='items-center p-0 gap-0' style={{ backgroundColor: "rgba(136,68,68,0.25)", borderColor: "#994444" }} key={person.id}>
                  <div className='flex w-full items-center justify-center p-2' style={{ borderBottomWidth: "1px", borderColor: "#994444", minHeight: "2.5rem" }}>
                    <small style={{ fontSize: "0.5rem" }} className='px-3 text-center'>{person.fname} {person.lname}</small>
                  </div>
                  <div className='flex justify-center w-full py-4'>
                    <h3 style={{ fontSize: "2rem" }} className='font-bold'>{person.playerNum}</h3>
                  </div>
                  <div className='flex w-full items-center justify-center p-2' style={{ borderTopWidth: "1px", borderColor: "#994444", minHeight: "2.5rem" }}>
                    <small style={{ fontSize: "0.5rem" }} className='px-3 text-center'>Eliminated:<br/>Round {person.eliminatedRound}</small>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </ThemeProvider>
    </AuthProvider >
  )
}

export default AdminPortal;