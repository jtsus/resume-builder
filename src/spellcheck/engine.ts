import nspell from "nspell"
import {misspelledSpans, WordSpan} from "./words"

export type SpellChecker = { correct: (word: string) => boolean }

const EXTRA_WORDS = [
    "Kubernetes",
    "Rsync",
    "Typescript",
    "TypeScript",
    "jsPDF",
    "JSPDF",
    "PubSub",
    "Singletons",
    "PrismJS",
    "NodeJS",
    "MongoDB",
    "MySQL",
    "GitHub",
    "ATS",
    "Architected",
    "Palo",
]

let checkerPromise: Promise<SpellChecker> | null = null

export function loadSpellChecker(): Promise<SpellChecker> {
    if (!checkerPromise) {
        checkerPromise = (async () => {
            const base = `${process.env.PUBLIC_URL || ""}/dictionaries`
            const [aff, dic] = await Promise.all([
                fetch(`${base}/en_US.aff`).then((res) => {
                    if (!res.ok) throw new Error("Failed to load affix dictionary")
                    return res.text()
                }),
                fetch(`${base}/en_US.dic`).then((res) => {
                    if (!res.ok) throw new Error("Failed to load word dictionary")
                    return res.text()
                }),
            ])
            const spell = nspell(aff, dic)
            for (const word of EXTRA_WORDS) spell.add(word)
            return {
                correct: (word: string) => spell.correct(word) || spell.correct(word.toLowerCase()),
            }
        })()
    }
    return checkerPromise
}

export function misspellingsIn(text: string, checker: SpellChecker): WordSpan[] {
    return misspelledSpans(text, (word) => checker.correct(word))
}

const SKIP_PARENT = "[data-spell-layer]"

export function collectMisspelledRanges(root: HTMLElement, checker: SpellChecker): Range[] {
    const ranges: Range[] = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
        const parent = node.parentElement
        if (!parent || parent.closest(SKIP_PARENT) || parent.closest("a")) continue
        const text = node.textContent ?? ""
        if (!text) continue
        for (const span of misspellingsIn(text, checker)) {
            const range = document.createRange()
            range.setStart(node, span.start)
            range.setEnd(node, span.end)
            ranges.push(range)
        }
    }
    return ranges
}

export type SpellMarkBox = { top: number, left: number, width: number }

export function measureSpellMarks(root: HTMLElement, checker: SpellChecker): SpellMarkBox[] {
    const rootRect = root.getBoundingClientRect()
    const boxes: SpellMarkBox[] = []
    for (const range of collectMisspelledRanges(root, checker)) {
        const rects = Array.from(range.getClientRects())
        for (const rect of rects) {
            if (rect.width < 2 || rect.height < 2) continue
            boxes.push({
                top: rect.bottom - rootRect.top - 2,
                left: rect.left - rootRect.left,
                width: rect.width,
            })
        }
    }
    return boxes
}
