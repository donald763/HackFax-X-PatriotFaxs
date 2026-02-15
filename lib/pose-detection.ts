// Stub implementation - pose detection disabled for now
export async function initPoseLandmarker() {
  return null
}

export async function detectPose() {
  return {
    landmarks: [],
    visibility: [],
  }
}

export function getLastDetectionTime() {
  return Date.now()
}
