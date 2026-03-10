'use client';

import dynamic from 'next/dynamic';

const DemoController = dynamic(
  () => import('@/components/demo/DemoController').then((m) => ({ default: m.DemoController })),
  { ssr: false }
);

export default function DemoPage() {
  return <DemoController />;
}
