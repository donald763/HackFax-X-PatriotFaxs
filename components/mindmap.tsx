"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getUnsplashImage } from "@/lib/unsplash"
import { MindMapNode } from "@/lib/mindmap"

// Placeholder for Unsplash image fetching
// Will be replaced with real API integration
const fetchUnsplashImage = async (query: string) => {
  return `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`
}

function MindMapBranch({ node, images, onSelect }: { node: MindMapNode, images: Record<string, string>, onSelect: (n: MindMapNode) => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="flex flex-col items-center">
      <Button
        className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform border-2 border-white mb-2"
        onClick={() => { setExpanded((e) => !e); onSelect(node) }}
      >
        {node.label}
      </Button>
      {expanded && node.children && (
        <div className="flex flex-col gap-2 ml-6 border-l-2 border-indigo-300 pl-4">
          {node.children.map((child) => (
            <MindMapBranch key={child.id} node={child} images={images} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export function InteractiveKnowledgeTree({ root }: { root?: MindMapNode }) {
  if (!root) return <div>Loading tree...</div>

  const [images, setImages] = useState<Record<string, string>>({})
  const [totalNodes, setTotalNodes] = useState(0)
  const [loadedImages, setLoadedImages] = useState(0)

  // Count total nodes in tree (BFS)
  React.useEffect(() => {
    if (!root) return;
    let count = 0;
    const queue: MindMapNode[] = [root];
    const seen = new Set<string>();
    while (queue.length) {
      const node = queue.shift()!;
      if (!seen.has(node.id)) {
        seen.add(node.id);
        count++;
        if (node.children) queue.push(...node.children);
      }
    }
    setTotalNodes(count);
  }, [root]);

  // Preload images for all nodes in the tree (BFS)
  React.useEffect(() => {
    if (!root) return;
    const queue: MindMapNode[] = [root];
    const seen = new Set<string>();
    let loaded = 0;
    while (queue.length) {
      const node = queue.shift()!;
      if (!seen.has(node.id)) {
        seen.add(node.id);
        getUnsplashImage(node.label).then((url) => {
          setImages((prev) => ({ ...prev, [node.id]: url || `https://source.unsplash.com/600x400/?${encodeURIComponent(node.label)}` }));
          setLoadedImages((prev) => prev + 1);
        });
        if (node.children) queue.push(...node.children);
      }
    }
    setLoadedImages(0);
  }, [root]);

  function TreeNode({ node }: { node: MindMapNode }) {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className="flex flex-col items-center">
        <Button
          className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform border-2 border-white mb-2"
          onClick={() => setExpanded((e) => !e)}
        >
          {node.label}
        </Button>
        {images[node.id] && (
          <img
            src={images[node.id]}
            alt={node.label}
            className="rounded-xl mb-2 w-full max-w-xs h-32 object-cover border-4 border-pink-300 shadow-lg"
          />
        )}
        {expanded && node.children && (
          <div className="flex flex-col gap-2 ml-6 border-l-2 border-indigo-300 pl-4">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Progress bar UI
  const loadingPct = totalNodes > 0 ? Math.round((loadedImages / totalNodes) * 100) : 0;
  const loading = loadedImages < totalNodes;

  return (
    <div className="flex flex-col items-center w-full min-h-[60vh] p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl relative overflow-x-auto">
      {loading && (
        <div className="w-full max-w-md mb-4">
          <div className="flex items-center justify-between text-xs text-white font-medium mb-1">
            <span>Loading Knowledge Tree...</span>
            <span>{loadingPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${loadingPct}%` }} />
          </div>
        </div>
      )}
      <div className="mb-6 text-3xl font-bold text-white drop-shadow-lg">Interactive Knowledge Tree: {root.label}</div>
      <div className="flex flex-col items-center gap-8">
        <TreeNode node={root} />
      </div>
    </div>
  );
}
