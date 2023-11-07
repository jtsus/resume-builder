import React from "react";
import {WorkEntry} from "../types";

const Experience = ({content}: { content: WorkEntry }) => (
    <div className="experience">
        <div className="spaced-line">
            {content.link ? <a href={content.link} target={"_blank"} className="header">{content.company}</a> : <div className="header">{content.company}</div>}
            {content.location ? <div className="location">{content.location}</div> : <div className="duration">{content.duration}</div>}
        </div>
        <div className="spaced-line">
            <em className="subheader">{content.position}</em>
            {content.location && <em className="duration">{content.duration}</em>}
        </div>
        {content.description && <div className="description">{content.description}</div>}
        {content.actions.map((action, i) =>
            <div className="action" key={i}><div className="bullet" />{action}</div>
        )}
    </div>
)

export default Experience;
