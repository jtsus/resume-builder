import {misspelledSpans, shouldCheckWord, tokenizeWords} from "./words"

test("tokenizes words and apostrophes", () => {
    expect(tokenizeWords("Don't skip PubSub ATS")).toEqual([
        {word: "Don't", start: 0, end: 5},
        {word: "skip", start: 6, end: 10},
        {word: "PubSub", start: 11, end: 17},
        {word: "ATS", start: 18, end: 21},
    ])
})

test("skips codes, camel case, and hosts", () => {
    expect(shouldCheckWord("teh")).toBe(true)
    expect(shouldCheckWord("PubSub")).toBe(false)
    expect(shouldCheckWord("ATS")).toBe(false)
    expect(shouldCheckWord("C")).toBe(false)
    expect(shouldCheckWord("justins.io")).toBe(false)
    expect(shouldCheckWord("https")).toBe(false)
    expect(shouldCheckWord("www")).toBe(false)
    expect(shouldCheckWord("web2")).toBe(false)
})

test("reports only words the checker rejects", () => {
    const known = new Set(["Led", "the"])
    expect(misspelledSpans("Led the qwik team", (word) => known.has(word))).toEqual([
        {word: "qwik", start: 8, end: 12},
        {word: "team", start: 13, end: 17},
    ])
})
