import React from "react";
import { SkillsEntry } from "../types";
import Skill from "./Skill";

interface Props {
    content: { entries: SkillsEntry[] }
}

const Skills = ({ content }: Props) => {
    console.log(content);
    return (
        <div className="skill-entry-holder">
            {content.entries?.map((entry) =>
                <div className="skill-entry">
                    <strong className="skill-label">{entry.label}:</strong>
                    <div className="skill-entries">
                        {entry.entries.map((skill, i) => <span className="skill-name">{skill}{i < entry.entries.length - 1 ? ", " : ""}</span>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Skills;