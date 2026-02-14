"use client"
import React, { useState } from 'react'

export default function FileUploader() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const upload = async () => {
    if (!files || files.length === 0) return
    setUploading(true)
    const form = new FormData()
    Array.from(files).forEach((f) => form.append('files', f))

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      setResult(json)
    } catch (err) {
      console.error(err)
      setResult({ error: 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4 border rounded">
      <label className="block mb-2">Add lecture notes / PDFs</label>
      <input type="file" multiple onChange={onChange} />
      <div className="mt-3">
        <button className="btn" onClick={upload} disabled={uploading || !files}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      {result && (
        <div className="mt-3">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          {result.files && (
            <ul>
              {Object.entries(result.files).map(([key, arr]: any) => (
                <li key={key}>
                  {arr.map((f: any) => (
                    <div key={f.filename}>
                      <a href={f.url} target="_blank" rel="noreferrer">{f.originalFilename || f.filename}</a> — {Math.round(f.size/1024)} KB
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
