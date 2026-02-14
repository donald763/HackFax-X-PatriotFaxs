"use client"

interface KeyConcept {
  term: string
  definition: string
}

interface SummaryData {
  title: string
  overview: string
  keyConcepts: KeyConcept[]
  importantPoints: string[]
  connections: string
}

interface SummaryViewProps {
  data: SummaryData
  onBack: () => void
  onComplete: () => void
}

export function SummaryView({ data, onBack, onComplete }: SummaryViewProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
        </svg>
        Back to roadmap
      </button>

      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-full bg-teal-50 px-2.5 text-xs font-medium text-teal-700">
          Summary
        </span>
      </div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
        {data.title}
      </h1>

      {/* Overview */}
      <div className="mb-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
        <p className="text-[15px] leading-relaxed text-foreground">{data.overview}</p>
      </div>

      {/* Key Concepts */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Key Concepts
        </h2>
        <div className="space-y-3">
          {data.keyConcepts.map((concept, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-1 text-sm font-semibold text-foreground">{concept.term}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{concept.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Points */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Important Points
        </h2>
        <div className="rounded-xl border border-border bg-card p-5">
          <ul className="space-y-2.5">
            {data.importantPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Connections */}
      {data.connections && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            Connections
          </p>
          <p className="text-sm leading-relaxed text-foreground">{data.connections}</p>
        </div>
      )}

      <div className="flex justify-center pb-12">
        <button
          onClick={onComplete}
          className="h-11 rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  )
}
