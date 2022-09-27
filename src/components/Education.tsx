import React from "react";
import {SchoolEntry} from "../types";

const Education = ({content}: { content: SchoolEntry }) => (
    <div className="education">
        <div className="degree">{content.degree}</div>
        <div className="spaced-line">
            <div className="school">{content.school}</div>
            <div className="duration">{content.duration}</div>
        </div>
        {content.achievements.map((action, i) => <div className="achievement" key={i}>{action}</div>)}
    </div>
)

export default Education;