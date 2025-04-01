'use client'

import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { doc, setDoc, getDoc, getCountFromServer, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { Input } from '@/components/ui/input';

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

	const [input, setInput] = useState('');
	const [toElim, setToElim] = useState('');

	useEffect(() => {
		getRegistrants();
	}, [])

	const getRegistrants = async () => {
		try {
			// console.log("try")
			let addPlayers: ParticipantInfo[] = [];

			const playersRef = collection(db, "testParticipants");
			const q = query(playersRef, where("playernumber", "!=", "")); // This query gets all players, but returns it sorted by the query field
			const qSnapshot = await getDocs(q);
			qSnapshot.forEach((doc) => {
				addPlayers.push({ id: doc.id, playerNum: doc.data().playernumber, fname: doc.data().firstName, lname: doc.data().lastName, isEliminated: doc.data().isEliminated }) // CHANGE ID TO PLAYERNUMBER FOR ACTUAL GAME
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

	async function setTestPlayers() {
		for (let i = 1; i <= 50; i++) {
			await setDoc(doc(db, "testParticipants", `testPlayer${i}`), {
				playernumber: i,
				firstName: `f_name${i}`,
				lastName: `l_name${i}`,
				isEliminated: false
			});
		}
		console.log("Generated test players")
	}

	async function resetPlayers() {
		for (let i = 1; i <= 50; i++) {
			const playersToBeEliminatedRef = doc(db, "testParticipants", `testPlayer${i}`);
			await updateDoc(playersToBeEliminatedRef, {
				isEliminated: false
			})
		}
		getRegistrants();
	}

	async function elimPlayers() {
		if (/^[\d,\s]+$/.test(input)) { // If there are only numbers, commas, and/or whitespaces in the input


			// BASICALLY this needs to take the numbers we want to eliminate, find the id associated with them, and updated isEliminated for those id's in the db
			console.log('weoi')
			// setToElim(input);
			const elimNums = input.replaceAll(' ', '').split(',').map((element) => parseInt(element));
			console.log("elimNums: " + elimNums)
			let elimIDs: string[] = [];

			// This literally runs in O(N^2) time, I am a horrible programmer
			for (let i = 0; i < livingPlayers.length; i++) {
				for (let j = 0; j < elimNums.length; j++) {
					// console.log("i: " + i + ", livingPlayers[i].playerNum = " + livingPlayers[i].playerNum + "\nj: " + j + ", elimNums[j] = " + elimNums[j])
					if (livingPlayers[i].playerNum === elimNums[j]) {
						elimIDs.push(livingPlayers[i].id);
						// console.log("pushed " + livingPlayers[i].id)
					}
				}
			}
			console.log(elimIDs)
			if (elimIDs.length === 0) {
				window.confirm("No players eliminated.")
			}
			else {
				window.confirm("Players eliminated.")
			}


			for (let i = 0; i < elimIDs.length; i++) {
				const playersToBeEliminatedRef = doc(db, "testParticipants", elimIDs[i]);
				await updateDoc(playersToBeEliminatedRef, {
					isEliminated: true
				})
			}
			getRegistrants();

		}
		else if (toElim === '') {
			window.confirm("Please enter a value.")
		}
		else {
			window.confirm("Please enter only numbers and commas.")
		}



	}

	return (
		<AuthProvider>
			<div className='p-4'>
				<div className='flex flex-row gap-4'>
					<button onClick={() => setTestPlayers()} className='p-4 bg-amber-300 hover:bg-red-200'>
						generate test players
					</button>
					<button onClick={() => resetPlayers()} className='p-4 bg-amber-300 hover:bg-red-200'>
						reset test players
					</button>

					<button onClick={() => getRegistrants()} className='p-4 bg-amber-300 hover:bg-red-200'>
						Refresh
					</button>
				</div>




				<h3 className='text-xl font-bold'>Alive Players</h3>
				<Input
					value={input}
					onChange={e => setInput(e.target.value)}
				/>
				<button
					onClick={elimPlayers}
				>
					Add
				</button>
				<p>{input}</p>

				<div className='grid grid-cols-3 gap-4'>
					{livingPlayers.map(person => (
						<div
							className='flex flex-col items-center border border-[#999999] bg-[#444444]/25 rounded-sm'
							key={person.id}>
							<p>{person.fname} {person.lname}</p>
							<p>id: {person.id}</p>
							<p>player num: {person.playerNum}</p>
						</div>
					))}
				</div>


				<h3 className='text-xl font-bold'>Dead Players</h3>
				<div className='grid grid-cols-3 gap-4'>
					{deadPlayers.map(person => (
						<div
							className='flex flex-col items-center border border-[#999999] bg-[#444444]/25 rounded-sm'
							key={person.id}>
							<p>{person.fname} {person.lname}</p>
							<p>{person.id}</p>
							<p>player num: {person.playerNum}</p>
						</div>
					))}
				</div>

			</div>
		</AuthProvider>
	)
}

export default AdminPortal;