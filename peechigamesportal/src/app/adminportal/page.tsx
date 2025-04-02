'use client'

import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { doc, setDoc, getDoc, getCountFromServer, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { Input } from '@/components/ui/input';
import { ThemeProvider } from '@/components/theme-provider';

type ParticipantInfo = {
	id: string,
	playerNum: number,
	fname: string,
	lname: string,
	isEliminated: boolean,
}

function AdminPortal() {
	const [participantList, setParticipantList] = useState<ParticipantInfo[]>([]);
	const [livingPlayers, setLivingPlayers] = useState<ParticipantInfo[]>([]);
	const [deadPlayers, setDeadPlayers] = useState<ParticipantInfo[]>([]);

	const [elimInput, setElimInput] = useState('');
	const [reviveInput, setReviveInput] = useState('');

	useEffect(() => {
		getRegistrants();
	}, [])

	// Used to get registrant/player data.  
	const getRegistrants = async () => {
		try {
			// console.log("try")
			let addPlayers: ParticipantInfo[] = [];

			const playersRef = collection(db, "testParticipants");
			const q = query(playersRef, where("playernumber", "!=", "")); // This query gets all players, but returns it sorted by the query field
			const qSnapshot = await getDocs(q);
			qSnapshot.forEach((doc) => {
				addPlayers.push({
					id: doc.id,
					playerNum: doc.data().playernumber,
					fname: doc.data().firstName,
					lname: doc.data().lastName,
					isEliminated: doc.data().isEliminated
				})
			})
			setParticipantList(addPlayers);

			// Kinda sussy bc these should ultimately be filtered from participantList and not addPlayers since addPlayers isn't actually saved, but this func is async so I can't filter from participantList since we can only access old data in it AHHH😒 
			setLivingPlayers(addPlayers.filter(person => person.isEliminated === false));
			setDeadPlayers(addPlayers.filter(person => person.isEliminated === true));
		}
		catch (error) {
			console.error("Failed to get player records: " + error)
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
			
			for (let i = 0; i < elimIDs.length; i++) {
				const playerToBeEliminatedRef = doc(db, "testParticipants", elimIDs[i]);
				await updateDoc(playerToBeEliminatedRef, {
					isEliminated: true
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
			console.log(reviveInput)
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
			
			for (let i = 0; i < reviveIDs.length; i++) {
				const playerToBeRevivedRef = doc(db, "testParticipants", reviveIDs[i]);
				await updateDoc(playerToBeRevivedRef, {
					isEliminated: false
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
	// 	for (let i = 1; i <= 50; i++) {
	// 		await setDoc(doc(db, "testParticipants", `testPlayer${i}`), {
	// 			playernumber: null,
	// 			discordUsername: `discord${i}`,
	// 			firstName: `f_name${i}`,
	// 			lastName: `l_name${i}`,
	// 			isEliminated: false
	// 		});
	// 	}
	// 	console.log("Generated test players")
	// }
	// async function resetPlayers() {
	// 	for (let i = 1; i <= 50; i++) {
	// 		const playersToBeEliminatedRef = doc(db, "testParticipants", `testPlayer${i}`);
	// 		await updateDoc(playersToBeEliminatedRef, {
	// 			isEliminated: false
	// 		})
	// 	}
	// 	getRegistrants();
	// }


	return (
		<AuthProvider>
			<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>

				<div className='flex flex-col items-center p-4 gap-8'>

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

					{/* Eliminate and revive players */}
					<div className='flex flex-col lg:flex-row gap-4 w-full'>
						<div className='flex flex-col w-full items-center justify-center border border-[#999999] bg-[#444444]/25 rounded-sm p-4 gap-4'>
							<div>
								<h3 className='text-xl text-center font-bold'>Eliminate Players</h3>
								<p className='text-center'>Enter player numbers in a comma-separated list.</p>
							</div>
							<Input
								value={elimInput}
								onChange={e => setElimInput(e.target.value)}
							/>
							<button
								className='mt-4 px-4 py-2 rounded-sm bg-red-500 hover:bg-red-700 active:bg-red-700'
								onClick={elimPlayers}
							>
								Eliminate
							</button>
						</div>

						<div className='flex flex-col w-full items-center justify-center border border-[#999999] bg-[#444444]/25 rounded-sm p-4 gap-4'>
							<div>
								<h3 className='text-xl text-center font-bold'>Revive Players</h3>
								<p className='text-center'>Enter player numbers in a comma-separated list.</p>
							</div>
							<Input
								value={reviveInput}
								onChange={e => setReviveInput(e.target.value)}
							/>
							<button
								className='mt-4 px-4 py-2 rounded-sm bg-green-500 hover:bg-green-700 active:bg-green-700'
								onClick={revivePlayers}
							>
								Revive
							</button>
						</div>
					</div>



					{/* All living players */}
					<div className='flex flex-col items-center w-full gap-2'>
						<h2 className='text-2xl font-bold'>Living Players</h2>
						<div className='grid grid-cols-3 lg:grid-cols-6 gap-4 w-full'>
							{livingPlayers.map(person => (
								<div
									className='flex flex-col items-center justify-center border border-[#999999] bg-[#444444]/25 rounded-sm py-4'
									key={person.id}>
									<small className='text-[0.5rem]'>{person.fname} {person.lname}</small>
									<h3 className='text-3xl font-bold'>{person.playerNum}</h3>
									<small className='text-[0.5rem]'>{person.id}</small>
								</div>
							))}
						</div>
					</div>

					{/* All dead players */}
					<div className='flex flex-col items-center w-full gap-2'>
						<h2 className='text-2xl font-bold'>Dead Players</h2>
						<div className='grid grid-cols-3 lg:grid-cols-6 gap-4 w-full'>
							{deadPlayers.map(person => (
								<div
									className='flex flex-col items-center justify-center border border-[#cc9999] bg-[#884444]/25 rounded-sm py-4'
									key={person.id}>
									<h3 className='text-3xl font-bold'>{person.playerNum}</h3>
									<small className='text-[0.5rem]'>{person.id}</small>
								</div>
							))}
						</div>
					</div>

				</div>
			</ThemeProvider>
		</AuthProvider>
	)
}

export default AdminPortal;