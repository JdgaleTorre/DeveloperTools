'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>You are not signed in.</p>
        <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
