import React, {useEffect, useState} from "react"
import {loadSpellChecker, measureSpellMarks, SpellMarkBox} from "../spellcheck/engine"
import "./SpellMarks.css"

const SpellMarks = ({resumeId = "resume", revision}: { resumeId?: string, revision?: unknown }) => {
    const [marks, setMarks] = useState<SpellMarkBox[]>([])

    useEffect(() => {
        let cancelled = false
        let frame = 0

        const scan = async () => {
            const root = document.getElementById(resumeId)
            if (!root || cancelled) return
            try {
                const checker = await loadSpellChecker()
                if (cancelled) return
                setMarks(measureSpellMarks(root, checker))
            } catch (err) {
                console.error("Resume spellcheck failed to load", err)
            }
        }

        const schedule = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                void scan()
            })
        }

        void scan()
        const root = document.getElementById(resumeId)
        root?.addEventListener("input", schedule)
        root?.addEventListener("focusin", schedule)
        window.addEventListener("resize", schedule)

        return () => {
            cancelled = true
            cancelAnimationFrame(frame)
            root?.removeEventListener("input", schedule)
            root?.removeEventListener("focusin", schedule)
            window.removeEventListener("resize", schedule)
        }
    }, [resumeId, revision])

    return (
        <div data-spell-layer="" aria-hidden="true">
            {marks.map((mark, i) =>
                <div
                    key={`${mark.top}-${mark.left}-${mark.width}-${i}`}
                    className="spell-mark"
                    data-spell-mark=""
                    style={{top: mark.top, left: mark.left, width: mark.width}}
                />)}
        </div>
    )
}

export default SpellMarks
