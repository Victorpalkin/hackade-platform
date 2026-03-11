import {
  collection,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './client';
import type { Quest, Project, SwipeRecord, UserProfile, Submission, Notification, HelpRequest, Judgment } from '../types';

function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(snap: QueryDocumentSnapshot): T {
      return { id: snap.id, ...snap.data() } as unknown as T;
    },
  };
}

export const questsCollection = collection(db, 'quests').withConverter(createConverter<Quest>());
export const projectsCollection = collection(db, 'projects').withConverter(createConverter<Project>());
export const swipesCollection = collection(db, 'swipes').withConverter(createConverter<SwipeRecord>());
export const usersCollection = collection(db, 'users').withConverter(createConverter<UserProfile>());
export const submissionsCollection = collection(db, 'submissions').withConverter(createConverter<Submission>());
export const notificationsCollection = collection(db, 'notifications').withConverter(createConverter<Notification>());
export const helpRequestsCollection = collection(db, 'helpRequests').withConverter(createConverter<HelpRequest>());
export const judgmentsCollection = collection(db, 'judgments').withConverter(createConverter<Judgment>());
