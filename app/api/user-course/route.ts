import { NextRequest, NextResponse } from 'next/server';
import { saveUserCourseProgress, getUserCourseProgress } from '@/lib/user-course';

export async function POST(req: NextRequest) {
  const { userId, courseId, progress } = await req.json();
  if (!userId || !courseId) {
    return NextResponse.json({ error: 'Missing userId or courseId' }, { status: 400 });
  }
  await saveUserCourseProgress(userId, courseId, progress);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const courseId = searchParams.get('courseId');
  if (!userId || !courseId) {
    return NextResponse.json({ error: 'Missing userId or courseId' }, { status: 400 });
  }
  const progress = await getUserCourseProgress(userId, courseId);
  return NextResponse.json({ progress });
}
