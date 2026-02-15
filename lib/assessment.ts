// lib/assessment.ts
export async function generateAssessmentQuestions(topic: string): Promise<{ question: string; options: string[]; correct: number }[]> {
  const prompt = `Generate a short multiple-choice assessment (3-5 questions) to test a user's knowledge of the topic: "${topic}".\nEach question should have 4 options, only one correct answer, and return the result as a JSON array of objects with fields: question, options (array), and correct (index of correct option). Do not include explanations or extra text.`;

  // Call your server-side API route
  const res = await fetch('/api/gemeni', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN}`, // server will verify this
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 4096 } }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const result = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  try {
    const questions = JSON.parse(result);
    if (Array.isArray(questions) && questions.every(q => q.question && Array.isArray(q.options) && typeof q.correct === 'number')) {
      return questions;
    }
  } catch {}

  throw new Error("Failed to parse assessment questions from Gemini API response");
}
