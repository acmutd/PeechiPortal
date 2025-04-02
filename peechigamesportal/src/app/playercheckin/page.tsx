'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Input } from '@/components/ui/input'
import { AuthProvider } from '@/context/AuthProvider'
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../firebase'

function PlayerCheckIn() {
  const [discInput, setDiscInput] = useState('');

  async function handleCheckIn() {
    const participantsRef = collection(db, "testParticipants");
    const q = query(participantsRef, where("discordUsername", "==", discInput));
    const qSnapshot = await getDocs(q);

    // Get playercount to assign playernumber
    let currentPlayerCount: number = -10; // -10 as a sentinel
    const playerCountRef = doc(db, "metadata", "counter");
    const docSnap = await getDoc(playerCountRef);
    if (docSnap.exists()) {
      currentPlayerCount = docSnap.data().nextnumber;
    } else {
      window.confirm("Could not verify next player number. Please try again.")
      return;
    }

    let numDocsUpdated = 0;
    qSnapshot.forEach((document) => {
      try {
        const docRef = doc(db, "testParticipants", document.id);
        updateDoc(docRef, {
          playernumber: currentPlayerCount
        })
        numDocsUpdated++;

        // Increment playercount by 1 if update is successful
        updateDoc(playerCountRef, {
          nextnumber: currentPlayerCount + 1
        })
      }
      catch (error) {
        console.error(error);
      }
    })
    if (numDocsUpdated !== 0) {
      window.confirm("Successfully added. " + discInput + " is player " + currentPlayerCount)
    }
    else { // If no users were found with this username
      window.confirm("User not found.")
    }
  }

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className='p-4 space-y-4'>

          <button
            className='px-4 py-2 rounded-sm bg-slate-600 hover:bg-slate-400 active:bg-slate-400'
            onClick={() => { window.location.href = "/adminportal"; }}
          >
            Go to Player Elimination Page
          </button>

          <h2 className='text-2xl font-bold mt-8'>
            Check-In Players
          </h2>
          <div className=''>
            <p>Enter the player's Discord username:</p>
            <Input
              className='w-[25rem] max-w-full'
              value={discInput}
              onChange={(e) => setDiscInput(e.target.value)}
            />
          </div>

          <button
            className='px-4 py-1 rounded-sm bg-slate-400 hover:bg-slate-500 active:bg-slate-500 text-black'
            onClick={handleCheckIn}
          >
            Check In Player
          </button>
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default PlayerCheckIn