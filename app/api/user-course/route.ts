import { NextRequest, NextResponse } from "next/server"
import { saveUserCourseProgress, getUserCourseProgress } from "@/lib/user-course"

export async function POST(req: NextRequest) {
  try {
    const { userId, courseId, progress } = await req.json()
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId" },
        { status: 400 }
      )
    }
    await saveUserCourseProgress(userId, courseId, progress)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Error saving course progress:", err)
    return NextResponse.json(
      { error: err.message ?? "Failed to save progress" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId" },
        { status: 400 }
      )
    }
    const progress = await getUserCourseProgress(userId, courseId)
    return NextResponse.json({ progress })
  } catch (err: any) {
    console.error("Error retrieving course progress:", err)
    return NextResponse.json(
      { error: err.message ?? "Failed to retrieve progress" },
      { status: 500 }
    )
  }
}
