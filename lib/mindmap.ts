import { forwardToGemini } from "./gemini"

export interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
}

export async function generateMindMapTree(topic: string): Promise<MindMapNode> {
  const prompt = `Generate a mind map for the topic: "${topic}". Return the result as a JSON object with the following structure: { id, label, children: [ ... ] }, where each node has a unique id, a label, and an optional array of children. Only include relevant subtopics and break down the topic into logical branches and sub-branches. Do not include explanations or extra text.`
  const result = await forwardToGemini({ prompt })
  try {
    const tree = JSON.parse(result)
    if (tree && tree.label && Array.isArray(tree.children)) {
      return tree
    }
  } catch {}
  throw new Error("Failed to parse mind map tree from Gemini")
}
