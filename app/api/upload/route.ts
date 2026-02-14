import fs from 'fs'
import path from 'path'

const TEXT_EXTENSIONS = [
  '.txt', '.md', '.csv', '.json', '.xml', '.html', '.htm', '.log',
  '.tex', '.rst', '.adoc', '.py', '.js', '.ts', '.jsx', '.tsx', '.vue',
  '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.go', '.rs', '.rb', '.php',
  '.swift', '.kt', '.scala', '.r', '.sql', '.yaml', '.yml', '.toml', '.ini',
  '.cfg', '.conf', '.env', '.sh', '.bash', '.zsh', '.ps1', '.bat',
  '.css', '.scss', '.sass', '.less', '.graphql', '.gql',
]

function looksLikeText(buffer: Buffer): boolean {
  if (buffer.length === 0) return true
  let printable = 0
  const sample = buffer.length > 20000 ? buffer.subarray(0, 20000) : buffer
  for (let i = 0; i < sample.length; i++) {
    const b = sample[i]
    if (b === 0x0a || b === 0x0d || b === 0x09 || (b >= 0x20 && b < 0x7f) || b >= 0xa0) printable++
  }
  return printable / sample.length >= 0.85
}

export async function POST(request: Request) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const formData = await request.formData()
  const fileInfos: Record<string, any> = {}

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') continue
    const file = value as any
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const dest = path.join(uploadsDir, safeName)
    await fs.promises.writeFile(dest, buffer)

    const info: any = { originalFilename: file.name, filename: safeName, size: buffer.length, url: `/uploads/${safeName}` }
    const lower = (file.name || '').toLowerCase()

    try {
      if (lower.endsWith('.pdf')) {
        const data = new Uint8Array(buffer)
        const pdfModule = await import('pdf-parse').catch((err) => {
          console.error('pdf-parse dynamic import failed', err)
          return null
        })
        if (pdfModule) {
          const PDFParse = (pdfModule as any).PDFParse ?? (pdfModule as any).default
          if (PDFParse) {
            const parser = new PDFParse({ data })
            try {
              const result = await parser.getText()
              info.text = (result?.text ?? '').trim() || ''
            } catch (pdfErr) {
              console.error('PDF getText error', pdfErr)
            } finally {
              await parser.destroy?.()
            }
          }
        }
        if (!info.text && data.length > 0) {
          try {
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
            const doc = await pdfjs.getDocument({ data }).promise
            const numPages = doc.numPages
            const parts: string[] = []
            for (let i = 1; i <= numPages; i++) {
              const page = await doc.getPage(i)
              const content = await page.getTextContent()
              const pageText = (content.items as { str?: string }[])
                .map((item) => item.str ?? '')
                .join(' ')
              parts.push(pageText)
              page.cleanup()
            }
            await doc.destroy()
            info.text = parts.join('\n\n').trim() || ''
          } catch (pdfjsErr) {
            console.error('pdfjs-dist fallback error', pdfjsErr)
          }
        }
      }
      if (info.text === undefined && TEXT_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
        info.text = buffer.toString('utf8')
      }
      // Fallback: try to use whole file as text if it looks like text (any extension)
      if (info.text === undefined && looksLikeText(buffer)) {
        info.text = buffer.toString('utf8')
      }
      if (info.text === undefined) {
        info.text = ''
      }
    } catch (err) {
      console.error('Extraction error', err)
      info.text = info.text ?? ''
    }

    fileInfos[key] = fileInfos[key] || []
    fileInfos[key].push(info)
  }

  return new Response(JSON.stringify({ ok: true, files: fileInfos }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
