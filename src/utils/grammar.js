// Grammar & spell check via LanguageTool's free public API — no backend
// needed, works directly from the browser. Note the public tier's limits:
// ~20 requests/minute and up to ~20KB of text per request, which is more
// than enough for notes/journal entries but worth knowing if it ever
// returns a rate-limit error.

const LANGUAGETOOL_URL = 'https://api.languagetool.org/v2/check'

export async function checkGrammar(text, language = 'auto') {
  if (!text || !text.trim()) return []

  const body = new URLSearchParams({ text, language })
  const res = await fetch(LANGUAGETOOL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    throw new Error(res.status === 429 ? 'Rate limit reached — wait a moment and try again.' : `Grammar check failed (${res.status})`)
  }

  const data = await res.json()
  return (data.matches || []).map((m) => ({
    message: m.message,
    shortMessage: m.shortMessage,
    offset: m.offset,
    length: m.length,
    replacements: (m.replacements || []).slice(0, 3).map((r) => r.value),
    context: m.context?.text || '',
    category: m.rule?.category?.name || '',
  }))
}
