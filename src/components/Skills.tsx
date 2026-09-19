import React from "react";
import {SkillsEntry} from "../types";
import Editable from "./Editable";

interface Props {
    content: { entries: SkillsEntry[] }
    onChange: (content: { entries: SkillsEntry[] }) => void
}

const parseSkills = (text: string, keepTrailingEmpty: boolean) => {
    const parts = text.split(",").map(part => part.trim())
    return parts.filter((part, i) => part.length > 0 || (keepTrailingEmpty && i === parts.length - 1))
}

const Skills = ({content, onChange}: Props) => {
    return (
        <div className="skill-entry-holder">
            {content.entries?.map((entry, entryIndex) =>
                <div className="skill-entry" key={entryIndex}>
                    <strong className="skill-label">
                        <Editable
                            tag="span"
                            value={entry.label}
                            onChange={(label) => {
                                const entries = [...content.entries]
                                entries[entryIndex] = {...entry, label}
                                onChange({entries})
                            }}
                            onEnter={() => {
                                const entries = [...content.entries]
                                entries[entryIndex] = {...entry, entries: [...entry.entries.filter(Boolean), ""]}
                                onChange({entries})
                            }}
                        />
                        :
                    </strong>
                    <div className="skill-entries">
                        <Editable
                            tag="span"
                            className="skill-name"
                            value={entry.entries.join(", ")}
                            onChange={(text) => {
                                const entries = [...content.entries]
                                entries[entryIndex] = {
                                    ...entry,
                                    entries: parseSkills(text, true)
                                }
                                onChange({entries})
                            }}
                            onEnter={() => {
                                const entries = [...content.entries]
                                entries[entryIndex] = {
                                    ...entry,
                                    entries: [...entry.entries.filter(Boolean), ""]
                                }
                                onChange({entries})
                            }}
                            onDeleteEmpty={() => {
                                const entries = [...content.entries]
                                entries[entryIndex] = {...entry, entries: []}
                                onChange({entries})
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Skills
