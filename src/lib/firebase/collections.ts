import {
  collection,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './client';
import type { Quest, ProjectCard, TeamMember, SwipeRecord, UserProfile, Team } from '../types';

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
export const projectsCollection = collection(db, 'projects').withConverter(createConverter<ProjectCard>());
export const teamsCollection = collection(db, 'teams').withConverter(createConverter<Team>());
export const swipesCollection = collection(db, 'swipes').withConverter(createConverter<SwipeRecord>());
export const usersCollection = collection(db, 'users').withConverter(createConverter<UserProfile>());
