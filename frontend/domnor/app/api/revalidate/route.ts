import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tag, token } = body;

  if (!tag || !token) {
    return NextResponse.json({ error: 'Missing tag or token' }, { status: 400 });
  }

  if (token !== process.env.NEXT_PUBLIC_REVALIDATION_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}