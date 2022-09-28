import React from "react";
import {ProjectEntry} from "../types";

const Project = ({content}: { content: ProjectEntry }) => (
    <div className="project">
        <div className="spaced-line">
            <div className="company">{content.name}</div>
            <a className="duration" href={content.link}>{content.link}</a>
        </div>
        <div className="position">{content.description}</div>
        {content.actions.map((action, i) => <div className="action" key={i}><div className="bullet">•</div>{action}</div>)}
    </div>
)

export default Project;