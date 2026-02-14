export async function fetchExerciseDescription(
  exerciseName: string,
  category: string
): Promise<string> {
  const response = await fetch("/api/exercise-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exerciseName, category }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch exercise description")
  }

  const data = await response.json()
  return typeof data === "string" ? data : data.text ?? data.response ?? JSON.stringify(data)
}
