import React, {useEffect, useLayoutEffect, useRef} from "react";

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

function isEnter(e: {key: string, keyCode?: number}) {
    return e.key === "Enter" || e.key === "NumpadEnter" || e.keyCode === 13
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
    const valueRef = useRef(value)
    const onChangeRef = useRef(onChange)
    const onEnterRef = useRef(onEnter)
    const onDeleteEmptyRef = useRef(onDeleteEmpty)
    const Tag = tag

    valueRef.current = value
    onChangeRef.current = onChange
    onEnterRef.current = onEnter
    onDeleteEmptyRef.current = onDeleteEmpty

    useEffect(() => {
        const el = ref.current
        if (!el || focused.current) return
        if (plainText(el) !== value) {
            el.textContent = value
        }
    }, [value])

    useLayoutEffect(() => {
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
        if (next !== valueRef.current) onChangeRef.current(next)
    }

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (isEnter(e)) {
                e.preventDefault()
                e.stopPropagation()
                emit()
                onEnterRef.current?.()
                return
            }
            if ((e.key === "Backspace" || e.key === "Delete") && onDeleteEmptyRef.current) {
                const text = plainText(el)
                if (text.length === 0) {
                    e.preventDefault()
                    e.stopPropagation()
                    onDeleteEmptyRef.current()
                }
            }
        }
        el.addEventListener("keydown", onKeyDown)
        return () => el.removeEventListener("keydown", onKeyDown)
    }, [])

    return (
        <Tag
            ref={ref as any}
            className={className}
            href={tag === "a" ? href : undefined}
            target={tag === "a" ? target : undefined}
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            lang="en"
            data-testid={testId}
            onFocus={() => {
                focused.current = true
            }}
            onBlur={() => {
                focused.current = false
                emit()
                if (onDeleteEmptyRef.current && ref.current && plainText(ref.current).length === 0) {
                    onDeleteEmptyRef.current()
                }
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
        >
            {initial.current}
        </Tag>
    )
}

export default Editable
