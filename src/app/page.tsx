"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect } from 'react';
export default function Home() {

  const session = useSession();
useEffect(()=>{

},[session.data?.user])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      {session ? (
        <div>
          <p>Welcome, {session.data?.user?.email}</p>
          <p>User ID: {session.data?.user?.id}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Please sign in.</p>
          <button onClick={() => signIn()}>Sign In</button>
        </div>
      )}
    
    </main>
  );
}
