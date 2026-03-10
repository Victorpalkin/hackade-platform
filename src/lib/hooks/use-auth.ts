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
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() } as UserProfile);
        } else {
          const newProfile: Omit<UserProfile, 'id'> = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName ?? '',
            email: firebaseUser.email ?? '',
            photoURL: firebaseUser.photoURL ?? '',
            role: 'hacker',
          };
          await setDoc(userRef, newProfile);
          setProfile({ id: firebaseUser.uid, ...newProfile });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const handleSignIn = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setProfile(null);
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, profile, loading, signIn: handleSignIn, signOut: handleSignOut } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
