import React from "react";
import Info from "./components/Info";
import {ResumeData, ProjectEntry, SchoolEntry, WorkEntry, SkillsEntry, Section} from "./types";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Project from "./components/Project";
import Skills from "./components/Skills";
import Editable from "./components/Editable";
import "./components/Editable.css";

const Resume = ({data, onChange}: { data: ResumeData, onChange: (data: ResumeData) => void }) => {
    require(`./themes/${data.theme}.css`);

    const patch = (partial: Partial<ResumeData>) => onChange({...data, ...partial})

    const replaceEntry = <T,>(sectionIndex: number, entryIndex: number, entry: T) => {
        const sections = [...data.sections!]
        const section = sections[sectionIndex]
        const entries = [...section.entries] as Section["entries"]
        entries[entryIndex] = entry as Section["entries"][number]
        sections[sectionIndex] = {...section, entries}
        patch({sections})
    }

    return <div id="resume" className="resume" lang="en" spellCheck>
        <div className="spaced-line">
            <header>
                <Editable className="name" value={data.name} onChange={(name) => patch({name})}/>
                {data.title &&
                    <Editable className="title" value={data.title} onChange={(title) => patch({title})}/>}
            </header>
            {data.website &&
                <Editable tag="a" target="_blank" href={data.website} value={data.website}
                          onChange={(website) => patch({website})}/>}
        </div>
        {data.info && data.info.length > 0 &&
            <div className="info-line">{data.info.map((info, i) =>
                <Info key={i} entry={info} onChange={(entry) => {
                    const next = [...data.info]
                    next[i] = entry
                    patch({info: next})
                }}/>)}
            </div>
        }
        {data.sections && (
            <div>
                {data.sections.map((section, sectionIndex) =>
                    <div key={sectionIndex} className="section">
                        <Editable className="section-header" value={section.title} onChange={(title) => {
                            const sections = [...data.sections!]
                            sections[sectionIndex] = {...section, title}
                            patch({sections})
                        }}/>
                        {section.type === 'skill' &&
                            <Skills
                                content={section as { entries: SkillsEntry[] }}
                                onChange={(content) => {
                                    const sections = [...data.sections!]
                                    sections[sectionIndex] = {...section, entries: content.entries}
                                    patch({sections})
                                }}
                            />
                        }
                        {section.type === 'education' &&
                            <>
                                {section.entries.map((info, i) =>
                                    <Education key={i} content={info as SchoolEntry}
                                               onChange={(entry) => replaceEntry(sectionIndex, i, entry)}/>)}
                            </>
                        }
                        {section.type === 'experience' &&
                            <>
                                {section.entries.map((info, i) =>
                                    <Experience key={i} content={info as WorkEntry}
                                                onChange={(entry) => replaceEntry(sectionIndex, i, entry)}/>)}
                            </>
                        }
                        {section.type === 'project' &&
                            <>
                                {section.entries.map((info, i) =>
                                    <Project key={i} content={info as ProjectEntry}
                                             onChange={(entry) => replaceEntry(sectionIndex, i, entry)}/>)}
                            </>
                        }
                    </div>
                )}
            </div>
        )}
    </div>
}

export default Resume
