import React from "react";
import {WorkEntry} from "../types";

const Experience = ({content}: { content: WorkEntry }) => (
    <div className="experience">
        <div className="spaced-line">
            <div className="company">{content.company}</div>
            <div className="duration">{content.duration}</div>
        </div>
        <div className="position">{content.position}</div>
        {content.actions.map((action, i) =>
            <div className="action" key={i}><div className="bullet">•</div>{action}</div>
        )}
    </div>
)

export default Experience;