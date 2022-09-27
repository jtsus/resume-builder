import React from "react";
import {WorkEntry} from "../types";

const Experience = ({content}: { content: WorkEntry }) => (
    <div className="experience">
        <div className="company">{content.company}</div>
        <div className="spaced-line">
            <div className="position">{content.position}</div>
            <div className="duration">{content.duration}</div>
        </div>
        {content.actions.map((action, i) => <div className="action" key={i}>{action}</div>)}
    </div>
)

export default Experience;