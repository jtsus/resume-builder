import React from "react";
import Info from "./components/Info";
import {ResumeData, ProjectEntry, SchoolEntry, WorkEntry} from "./types";
import Skill from "./components/Skill";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Project from "./components/Project";

const Resume = ({data}: {data: ResumeData}) => {
    console.log(data.title)
    return <div id="resume" className="resume">
        <link rel="stylesheet" type="text/css" href={`./themes/${data.theme}.css`} />
        <div className="spaced-line">
            <header>
                <div className="name">{data.name}</div>
                {data.title && <em className="title">{data.title}</em>}
            </header>
            {data.website && <a target={"_blank"} href={data.website}>{data.website}</a>}
        </div>
        {data.info && data.info.length > 0 &&
            <div className="info-line">{data.info.map((info, i) => <Info key={i} entry={info} />)}</div>
        }
        {data.sections && (
            <div>
                {data.sections.map((section, i) =>
                        <div key={i} className="section">
                            <div className="section-header">{section.title}</div>
                            {section.type === 'skill' &&
                                <div className="skill-holder">
                                    {section.entries.map((info, i) => <Skill key={i} content={info as string}/>)}
                                </div>
                            }
                            {section.type === 'education' &&
                                <>
                                    {section.entries.map((info, i) => <Education key={i} content={info as SchoolEntry}/>)}
                                </>
                            }
                            {section.type === 'experience' &&
                                <>
                                    {section.entries.map((info, i) => <Experience key={i} content={info as WorkEntry}/>)}
                                </>
                            }
                            {section.type === 'project' &&
                                <>
                                    {section.entries.map((info, i) => <Project key={i} content={info as ProjectEntry}/>)}
                                </>
                            }
                        </div>
                )}
            </div>
        )}
    </div>
}

export default Resume;
