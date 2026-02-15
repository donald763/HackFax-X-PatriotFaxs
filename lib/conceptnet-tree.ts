export interface ConceptNetNode {
  id: string
  label: string
  children?: ConceptNetNode[]
}

const API = "https://api.conceptnet.io";

async function fetchConcepts(term: string, lang = "en", limit = 5): Promise<ConceptNetNode[]> {
  const uri = `/c/${lang}/${encodeURIComponent(term.replace(/\s+/g, '_'))}`;
  const url = `${API}${uri}`;
  const edgesUrl = `${API}/related${uri}?filter=/c/${lang}`;
  const res = await fetch(edgesUrl);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.related || []).slice(0, limit).map((item: any) => ({
    id: item['@id'] || item.id || item.label || item.term,
    label: item.label || item.term || item['@id']?.split('/').pop() || '',
    children: [],
  }));
}

export async function buildConceptNetTree(rootTerm: string, depth = 2, breadth = 4): Promise<ConceptNetNode> {
  const root: ConceptNetNode = { id: rootTerm, label: rootTerm, children: [] };
  async function build(node: ConceptNetNode, d: number) {
    if (d === 0) return;
    const children = await fetchConcepts(node.label, "en", breadth);
    node.children = children;
    await Promise.all(children.map(child => build(child, d - 1)));
  }
  await build(root, depth);
  return root;
}
