import { NextResponse } from 'next/server';
import { seedFirestore } from '@/lib/firebase/seed';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Seed endpoint is only available in development' }, { status: 403 });
  }

  try {
    const result = await seedFirestore();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 }
    );
  }
}
