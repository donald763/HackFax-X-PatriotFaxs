// In-memory storage for user course progress
// In production, this should be replaced with a database
const userCourseProgress = new Map<string, Map<string, any>>()

export async function saveUserCourseProgress(
  userId: string,
  courseId: string,
  progress: any
): Promise<void> {
  if (!userCourseProgress.has(userId)) {
    userCourseProgress.set(userId, new Map())
  }
  userCourseProgress.get(userId)!.set(courseId, { ...progress, savedAt: Date.now() })
}

export async function getUserCourseProgress(
  userId: string,
  courseId: string
): Promise<any> {
  const userProgress = userCourseProgress.get(userId)
  if (!userProgress) {
    return null
  }
  return userProgress.get(courseId) ?? null
}

export async function getAllUserCourses(userId: string): Promise<any[]> {
  const userProgress = userCourseProgress.get(userId)
  if (!userProgress) {
    return []
  }
  return Array.from(userProgress.entries()).map(([courseId, progress]) => ({
    courseId,
    ...progress,
  }))
}

export async function deleteUserCourseProgress(userId: string, courseId: string): Promise<void> {
  const userProgress = userCourseProgress.get(userId)
  if (userProgress) {
    userProgress.delete(courseId)
  }
}
