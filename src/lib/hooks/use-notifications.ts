'use client';

import { useState, useEffect, useCallback } from 'react';
import { query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { notificationsCollection } from '../firebase/collections';
import { db } from '../firebase/client';
import { useAuth } from './use-auth';
import type { Notification } from '../types';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(
      notificationsCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setNotifications(snapshot.docs.map((d) => d.data()));
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    const ref = doc(db, 'notifications', notificationId);
    await updateDoc(ref, { read: true }).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) => {
        const ref = doc(db, 'notifications', n.id);
        return updateDoc(ref, { read: true }).catch(() => {});
      })
    );
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}
