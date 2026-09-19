export type WordSpan = { word: string, start: number, end: number }

const TOKEN = /[A-Za-z][A-Za-z']*/g
const CAMEL = /[a-z][A-Z]/
const ALL_CAPS = /^[A-Z]{2,6}$/
const HOST = /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/
const HAS_DIGIT = /\d/

/** Words that look like product names, paths, or codes rather than prose. */
export function shouldCheckWord(word: string) {
    if (word.length < 3) return false
    if (HAS_DIGIT.test(word)) return false
    if (CAMEL.test(word)) return false
    if (ALL_CAPS.test(word)) return false
    if (word.includes("@")) return false
    if (HOST.test(word)) return false
    if (/^(https?|www)$/i.test(word)) return false
    return true
}

export function tokenizeWords(text: string): WordSpan[] {
    const spans: WordSpan[] = []
    TOKEN.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = TOKEN.exec(text))) {
        spans.push({word: match[0], start: match.index, end: match.index + match[0].length})
    }
    return spans
}

export function misspelledSpans(text: string, correct: (word: string) => boolean): WordSpan[] {
    return tokenizeWords(text).filter(({word}) => shouldCheckWord(word) && !correct(word))
}
