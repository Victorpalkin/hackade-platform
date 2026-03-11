'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithGoogle, signOut } from '../firebase/auth';
import { db } from '../firebase/client';
import type { UserProfile } from '../types';
import React from 'react';

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Check email allowlist
        const res = await fetch('/api/auth/check-allowlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: firebaseUser.email }),
        });
        const { allowed } = await res.json();
        if (!allowed) {
          await signOut();
          setUser(null);
          setProfile(null);
          setError('Access restricted. Your email is not on the allowlist.');
          setLoading(false);
          return;
        }

        const token = await firebaseUser.getIdToken();
        document.cookie = `firebaseAuthToken=${token}; path=/; max-age=3600; SameSite=Lax`;

        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        let userProfile: UserProfile;

        if (snap.exists()) {
          userProfile = { id: snap.id, ...snap.data() } as UserProfile;
        } else {
          const newProfile: Omit<UserProfile, 'id'> = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName ?? '',
            email: firebaseUser.email ?? '',
            photoURL: firebaseUser.photoURL ?? '',
            role: 'hacker',
          };
          await setDoc(userRef, newProfile);
          userProfile = { id: firebaseUser.uid, ...newProfile };
        }

        setProfile(userProfile);
        document.cookie = `userRole=${userProfile.role}; path=/; max-age=3600; SameSite=Lax`;
      } else {
        setProfile(null);
        document.cookie = 'firebaseAuthToken=; path=/; max-age=0';
        document.cookie = 'userRole=; path=/; max-age=0';
      }
      setLoading(false);
    });
  }, []);

  const handleSignIn = useCallback(async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      if (!message.includes('popup-closed-by-user')) {
        setError(message);
      }
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setProfile(null);
    document.cookie = 'firebaseAuthToken=; path=/; max-age=0';
    document.cookie = 'userRole=; path=/; max-age=0';
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, profile, loading, error, signIn: handleSignIn, signOut: handleSignOut } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
