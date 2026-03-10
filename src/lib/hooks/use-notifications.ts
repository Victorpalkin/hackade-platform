'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { query, where, orderBy, limit, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { notificationsCollection } from '../firebase/collections';
import { db } from '../firebase/client';
import { useAuth } from './use-auth';
import type { Notification } from '../types';

const NOTIFICATIONS_LIMIT = 30;

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
      orderBy('createdAt', 'desc'),
      limit(NOTIFICATIONS_LIMIT)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setNotifications(snapshot.docs.map((d) => d.data()));
        setLoading(false);
      },
      (err) => {
        console.error('Notifications query failed:', err);
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
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach((n) => {
      batch.update(doc(db, 'notifications', n.id), { read: true });
    });
    await batch.commit().catch(() => {});
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}
