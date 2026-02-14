export interface AngleDefinition {
  name: string
  landmarks: [number, number, number] // indices into 33-landmark array (A, B, C — angle at B)
  weight: number // importance weight for scoring (0-1)
}

export interface Exercise {
  id: string
  name: string
  category: "strength" | "flexibility" | "balance"
  targetImage: string
  description: string // short fallback description
  angles: AngleDefinition[]
  targetAngles: Record<string, number>
  tolerance: Record<string, number>
}

export const EXERCISES: Exercise[] = [
  {
    id: "squat",
    name: "Bodyweight Squat",
    category: "strength",
    targetImage: "/exercises/squat-target.svg",
    description: "Stand with feet shoulder-width apart, lower your hips back and down until thighs are parallel to the floor.",
    angles: [
      { name: "left_knee", landmarks: [23, 25, 27], weight: 1.0 },
      { name: "right_knee", landmarks: [24, 26, 28], weight: 1.0 },
      { name: "left_hip", landmarks: [11, 23, 25], weight: 0.8 },
      { name: "right_hip", landmarks: [12, 24, 26], weight: 0.8 },
    ],
    targetAngles: { left_knee: 90, right_knee: 90, left_hip: 90, right_hip: 90 },
    tolerance: { left_knee: 15, right_knee: 15, left_hip: 20, right_hip: 20 },
  },
  {
    id: "pushup",
    name: "Push-Up (Down)",
    category: "strength",
    targetImage: "/exercises/pushup-target.svg",
    description: "Start in plank position, lower your body until elbows form a 90-degree angle.",
    angles: [
      { name: "left_elbow", landmarks: [11, 13, 15], weight: 1.0 },
      { name: "right_elbow", landmarks: [12, 14, 16], weight: 1.0 },
      { name: "body_line", landmarks: [11, 23, 25], weight: 0.7 },
    ],
    targetAngles: { left_elbow: 90, right_elbow: 90, body_line: 180 },
    tolerance: { left_elbow: 15, right_elbow: 15, body_line: 10 },
  },
  {
    id: "plank",
    name: "Plank Hold",
    category: "strength",
    targetImage: "/exercises/plank-target.svg",
    description: "Hold a straight line from head to heels with arms extended or on forearms.",
    angles: [
      { name: "left_elbow", landmarks: [11, 13, 15], weight: 0.8 },
      { name: "right_elbow", landmarks: [12, 14, 16], weight: 0.8 },
      { name: "body_line_l", landmarks: [11, 23, 25], weight: 1.0 },
      { name: "body_line_r", landmarks: [12, 24, 26], weight: 1.0 },
    ],
    targetAngles: { left_elbow: 90, right_elbow: 90, body_line_l: 180, body_line_r: 180 },
    tolerance: { left_elbow: 15, right_elbow: 15, body_line_l: 10, body_line_r: 10 },
  },
  {
    id: "lunge",
    name: "Forward Lunge",
    category: "strength",
    targetImage: "/exercises/lunge-target.svg",
    description: "Step forward, lowering until both knees form 90-degree angles. Keep torso upright.",
    angles: [
      { name: "front_knee", landmarks: [23, 25, 27], weight: 1.0 },
      { name: "back_knee", landmarks: [24, 26, 28], weight: 0.8 },
      { name: "torso", landmarks: [11, 23, 25], weight: 0.6 },
    ],
    targetAngles: { front_knee: 90, back_knee: 90, torso: 170 },
    tolerance: { front_knee: 15, back_knee: 20, torso: 15 },
  },
  {
    id: "tree-pose",
    name: "Tree Pose",
    category: "balance",
    targetImage: "/exercises/tree-pose-target.svg",
    description: "Stand on one leg, place the other foot on your inner thigh. Arms overhead or at heart center.",
    angles: [
      { name: "standing_knee", landmarks: [24, 26, 28], weight: 1.0 },
      { name: "raised_hip", landmarks: [12, 24, 26], weight: 0.8 },
      { name: "torso", landmarks: [12, 24, 28], weight: 0.6 },
    ],
    targetAngles: { standing_knee: 175, raised_hip: 160, torso: 180 },
    tolerance: { standing_knee: 10, raised_hip: 20, torso: 10 },
  },
]
