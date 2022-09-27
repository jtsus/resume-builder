import React from "react";
import Info from "./components/Info";
import {PortfolioData, SchoolEntry, WorkEntry} from "./types";
import Skill from "./components/Skill";
import Experience from "./components/Experience";
import Education from "./components/Education";

const Portfolio = ({data}: {data: PortfolioData}) => {
    return <div className="portfolio">
        <link rel="stylesheet" type="text/css" href={`./themes/${data.theme}.css`} />
        <div className="spaced-line">
            <header>
                <div className="name">{data.name}</div>
                <div className="title">{data.title}</div>
            </header>
            {data.website && <a href={data.website}>{data.website}</a>}
        </div>
        {data.info && data.info.length > 0 &&
            <div className="info-line">{data.info.map((info, i) => <Info key={i} entry={info} />)}</div>
        }
        {data.sections && (
            <div>
                {data.sections.map((section, i) =>
                        <div className="section">
                            <div className="section-header">{section.title}</div>
                            {section.type === 'skill' &&
                                <div className="skill-holder">
                                    {section.entries.map((info, i) => <Skill key={i} content={info as string}/>)}
                                </div>
                            }
                            {section.type === 'education' &&
                                <div className="education-holder">
                                    {section.entries.map((info, i) => <Education key={i} content={info as SchoolEntry}/>)}
                                </div>
                            }
                            {section.type === 'experience' &&
                                <div className="experience">
                                    {section.entries.map((info, i) => <Experience key={i} content={info as WorkEntry}/>)}
                                </div>
                            }
                        </div>
                )}
            </div>
        )}
    </div>
}

export default Portfolio;