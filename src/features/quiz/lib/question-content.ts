export type QuestionContentSegment =
  | { type: 'text'; value: string }
  | { type: 'code-block'; value: string }
  | { type: 'inline-code'; value: string }

const FENCE = '```'
const LANGUAGE_LINE_RE = /^[ \t]*[A-Za-z][\w-]*[ \t]*(?:\r?\n)/

const pushText = (segments: QuestionContentSegment[], value: string) => {
  if (value.length === 0) return
  const previous = segments.at(-1)
  if (previous?.type === 'text') {
    segments[segments.length - 1] = { type: 'text', value: previous.value + value }
    return
  }
  segments.push({ type: 'text', value })
}

const normalizeCodeBlock = (raw: string): string => {
  let value = raw.replace(LANGUAGE_LINE_RE, '')

  if (value.startsWith('\r\n')) value = value.slice(2)
  else if (value.startsWith('\n')) value = value.slice(1)
  else value = value.trimStart()

  if (value.endsWith('\r\n')) value = value.slice(0, -2)
  else if (value.endsWith('\n')) value = value.slice(0, -1)
  else value = value.trimEnd()

  return value
}

export const formatCodeBlock = (value: string): string => {
  const normalized = value.replace(/\r\n/g, '\n')
  if (normalized.includes('\n')) return normalized
  return normalized.replace(/\s+(?=\d+:)/g, '\n')
}

export const parseQuestionContent = (raw: string): QuestionContentSegment[] => {
  const segments: QuestionContentSegment[] = []
  let cursor = 0
  let text = ''

  while (cursor < raw.length) {
    if (raw.startsWith(FENCE, cursor)) {
      pushText(segments, text)
      text = ''

      const codeStart = cursor + FENCE.length
      const codeEnd = raw.indexOf(FENCE, codeStart)
      const codeRaw = codeEnd === -1 ? raw.slice(codeStart) : raw.slice(codeStart, codeEnd)
      segments.push({ type: 'code-block', value: normalizeCodeBlock(codeRaw) })
      cursor = codeEnd === -1 ? raw.length : codeEnd + FENCE.length
      continue
    }

    if (raw[cursor] === '`') {
      const codeEnd = raw.indexOf('`', cursor + 1)
      if (codeEnd !== -1) {
        pushText(segments, text)
        text = ''
        segments.push({ type: 'inline-code', value: raw.slice(cursor + 1, codeEnd) })
        cursor = codeEnd + 1
        continue
      }
    }

    text += raw[cursor]
    cursor += 1
  }

  pushText(segments, text)
  return segments
}
