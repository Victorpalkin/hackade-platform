import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const allowedEmails = process.env.ALLOWED_EMAILS;

  // If no allowlist is configured, everyone is allowed
  if (!allowedEmails) {
    return NextResponse.json({ allowed: true });
  }

  const { email } = await request.json();
  const list = allowedEmails.split(',').map((e) => e.trim().toLowerCase());
  const allowed = list.includes(email?.toLowerCase());

  return NextResponse.json({ allowed });
}
