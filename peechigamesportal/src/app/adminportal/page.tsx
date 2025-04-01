'use client'

import React from 'react'
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

function AdminPortal() {

    async function handleClick() {
        await setDoc(doc(db, "participants", "00testentry"), {
            name: "Los Angeles",
            state: "CA",
            country: "USA"
        });
    }

    return (
        <AuthProvider>
            <div>
                <button onClick={() => handleClick()} className='p-4 bg-amber-300 hover:bg-red-200'>
                    wo0qek0qwo
                </button>
            </div>
        </AuthProvider>
    )
}

export default AdminPortal;