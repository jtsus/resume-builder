import React, {useRef, useState} from "react";
import {SkillsEntry} from "../types";
import Editable from "./Editable";

interface Props {
    content: { entries: SkillsEntry[] }
    onChange: (content: { entries: SkillsEntry[] }) => void
}

const Skills = ({content, onChange}: Props) => {
    return (
        <div className="skill-entry-holder">
            {content.entries?.map((entry, entryIndex) =>
                <SkillLine
                    key={entryIndex}
                    entry={entry}
                    onChange={(next) => {
                        const entries = [...content.entries]
                        entries[entryIndex] = next
                        onChange({entries})
                    }}
                />
            )}
        </div>
    )
}

const SkillLine = ({entry, onChange}: { entry: SkillsEntry, onChange: (entry: SkillsEntry) => void }) => {
    const keySeed = useRef(0)
    const [keys, setKeys] = useState(() => entry.entries.map(() => keySeed.current++))
    const [focusKey, setFocusKey] = useState<number | undefined>(undefined)

    const setSkill = (index: number, value: string) => {
        const entries = [...entry.entries]
        entries[index] = value
        onChange({...entry, entries})
    }

    const addSkill = (index: number) => {
        const entries = [...entry.entries]
        entries.splice(index + 1, 0, "")
        const newKey = keySeed.current++
        const nextKeys = [...keys]
        nextKeys.splice(index + 1, 0, newKey)
        setKeys(nextKeys)
        setFocusKey(newKey)
        onChange({...entry, entries})
    }

    const removeSkill = (index: number) => {
        const entries = entry.entries.filter((_, j) => j !== index)
        const nextKeys = keys.filter((_, j) => j !== index)
        setKeys(nextKeys)
        setFocusKey(nextKeys[Math.max(0, index - 1)])
        onChange({...entry, entries})
    }

    return (
        <div className="skill-entry">
            <strong className="skill-label">
                <Editable
                    tag="span"
                    value={entry.label}
                    onChange={(label) => onChange({...entry, label})}
                    onEnter={() => {
                        if (entry.entries.length === 0) addSkill(-1)
                    }}
                />
                :
            </strong>
            <div className="skill-entries">
                {entry.entries.map((skill, i) =>
                    <span className="skill-name" key={keys[i] ?? `skill-${i}`}>
                        <Editable
                            tag="span"
                            value={skill}
                            autoFocus={focusKey === keys[i]}
                            onChange={(value) => setSkill(i, value)}
                            onEnter={() => addSkill(i)}
                            onDeleteEmpty={() => removeSkill(i)}
                        />
                        {i < entry.entries.length - 1 ? ", " : ""}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Skills
