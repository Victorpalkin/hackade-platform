'use client';

import { useParams } from 'next/navigation';
import { DeployFlow } from '@/components/scenes/Scene5/DeployFlow';

export default function SubmitPage() {
  // DeployFlow is mostly self-contained with mock data for MVP
  return <DeployFlow />;
}
