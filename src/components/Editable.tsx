import React, {useEffect, useRef} from "react";

export type EditableTag = "div" | "span" | "em" | "a" | "strong";

type Props = {
    value: string
    onChange: (value: string) => void
    tag?: EditableTag
    className?: string
    href?: string
    target?: string
    onEnter?: () => void
    onDeleteEmpty?: () => void
    autoFocus?: boolean
    testId?: string
}

export function plainText(el: HTMLElement) {
    return (el.textContent ?? "").replace(/\u00a0/g, " ")
}

const Editable = ({
    value,
    onChange,
    tag = "div",
    className,
    href,
    target,
    onEnter,
    onDeleteEmpty,
    autoFocus,
    testId,
}: Props) => {
    const ref = useRef<HTMLElement>(null)
    const focused = useRef(false)
    const initial = useRef(value)
    const Tag = tag

    useEffect(() => {
        const el = ref.current
        if (!el || focused.current) return
        if (plainText(el) !== value) {
            el.textContent = value
        }
    }, [value])

    useEffect(() => {
        if (!autoFocus || !ref.current) return
        const el = ref.current
        el.focus()
        const range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(true)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
    }, [autoFocus])

    const emit = () => {
        if (!ref.current) return
        const next = plainText(ref.current)
        if (next !== value) onChange(next)
    }

    return (
        <Tag
            ref={ref as any}
            className={className}
            href={tag === "a" ? href : undefined}
            target={tag === "a" ? target : undefined}
            contentEditable
            suppressContentEditableWarning
            spellCheck
            lang="en"
            data-testid={testId}
            onFocus={() => {
                focused.current = true
            }}
            onBlur={() => {
                focused.current = false
                emit()
            }}
            onInput={emit}
            onClick={(e: React.MouseEvent) => {
                if (tag === "a") e.preventDefault()
            }}
            onPaste={(e: React.ClipboardEvent) => {
                e.preventDefault()
                const text = e.clipboardData.getData("text/plain").replace(/\r?\n/g, " ")
                document.execCommand("insertText", false, text)
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                    e.preventDefault()
                    emit()
                    onEnter?.()
                    return
                }
                if ((e.key === "Backspace" || e.key === "Delete") && onDeleteEmpty) {
                    const text = ref.current ? plainText(ref.current) : value
                    if (text.length === 0) {
                        e.preventDefault()
                        onDeleteEmpty()
                    }
                }
            }}
        >
            {initial.current}
        </Tag>
    )
}

export default Editable
