import React, {useRef, useState} from "react";
import Editable from "./Editable";

const BulletList = ({
    items,
    onChange,
    itemClassName,
    testIdPrefix,
}: {
    items: string[]
    onChange: (items: string[]) => void
    itemClassName: string
    testIdPrefix?: string
}) => {
    const keySeed = useRef(0)
    const [keys, setKeys] = useState(() => items.map(() => keySeed.current++))
    const [focusKey, setFocusKey] = useState<number | undefined>(() =>
        items.length === 1 && items[0] === "" ? keys[0] : undefined
    )

    return (
        <>
            {items.map((item, i) => (
                <div className={itemClassName} key={keys[i] ?? `fallback-${i}`}>
                    <div className="bullet" contentEditable={false}/>
                    <Editable
                        tag="span"
                        value={item}
                        autoFocus={focusKey === keys[i]}
                        testId={testIdPrefix ? `${testIdPrefix}-${i}` : undefined}
                        onChange={(value) => {
                            const next = [...items]
                            next[i] = value
                            onChange(next)
                        }}
                        onEnter={() => {
                            const next = [...items]
                            next.splice(i + 1, 0, "")
                            const newKey = keySeed.current++
                            const nextKeys = [...keys]
                            nextKeys.splice(i + 1, 0, newKey)
                            setKeys(nextKeys)
                            setFocusKey(newKey)
                            onChange(next)
                        }}
                        onDeleteEmpty={() => {
                            const next = items.filter((_, j) => j !== i)
                            const nextKeys = keys.filter((_, j) => j !== i)
                            setKeys(nextKeys)
                            setFocusKey(nextKeys[Math.max(0, i - 1)])
                            onChange(next)
                        }}
                    />
                </div>
            ))}
        </>
    )
}

export default BulletList
