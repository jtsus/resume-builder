import React from "react";
import {ProjectEntry} from "../types";

const Project = ({content}: { content: ProjectEntry }) => (
    <div className="project">
        <div className="company">{content.name}</div>
        <div className="spaced-line">
            <div className="position">{content.description}</div>
            <a className="duration" href={content.link}>{content.link}</a>
        </div>
        {content.actions.map((action, i) => <div className="action" key={i}>{action}</div>)}
    </div>
)

export default Project;