import clientPromise from '@/lib/mongodb';

export async function saveUserCourseProgress(userId: string, courseId: string, progress: any) {
  const client = await clientPromise;
  const db = client.db('hackfax');
  const collection = db.collection('user_courses');
  await collection.updateOne(
    { userId, courseId },
    { $set: { progress } },
    { upsert: true }
  );
}

export async function getUserCourseProgress(userId: string, courseId: string) {
  const client = await clientPromise;
  const db = client.db('hackfax');
  const collection = db.collection('user_courses');
  const doc = await collection.findOne({ userId, courseId });
  return doc?.progress || null;
}
