import { doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './client';
import { questsCollection, projectsCollection } from './collections';
import { quests, projectCards } from '../mock-data';

export async function seedFirestore() {
  // Check if already seeded
  const existing = await getDocs(questsCollection);
  if (!existing.empty) {
    return { message: 'Already seeded', questCount: existing.size };
  }

  // Seed quests
  for (const quest of quests) {
    const { id, ...data } = quest;
    await setDoc(doc(db, 'quests', id), data);
  }

  // Seed projects (assign to first quest)
  for (const card of projectCards) {
    const { id, ...data } = card;
    await setDoc(doc(db, 'projects', id), {
      ...data,
      questId: quests[0].id,
      createdBy: 'seed-user',
    });
  }

  return { message: 'Seeded successfully', questCount: quests.length, projectCount: projectCards.length };
}
