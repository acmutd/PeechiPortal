"use client"

import { useEffect, useState } from 'react';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from "@/app/firebase";

export function EmailList() {
    const [emails, setEmails] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const db = getFirestore(app);
                const q = query(collection(db, "participants"));
                const querySnapshot = await getDocs(q);
                
                const emailList = querySnapshot.docs.map(doc => doc.data().email);
                setEmails(emailList);
            } catch (error) {
                console.error("Error fetching emails:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);

    if (loading) {
        return <div>Loading emails...</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Registered Emails ({emails.length})</h2>
            <div className="max-h-96 overflow-y-auto">
                <ul className="space-y-2">
                    {emails.map((email, index) => (
                        <li key={index} className="p-2 bg-white/10 rounded">
                            {email}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
} 