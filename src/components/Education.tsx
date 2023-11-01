import React from "react";
import {SchoolEntry} from "../types";

const Education = ({content}: { content: SchoolEntry }) => (
    <div className="education">
        <div className="spaced-line">
            <div className="header">{content.school}</div>
            <div className="location">{content.duration}</div>
        </div>
        <div className="spaced-line">
            <em className="subheader">{content.degree}</em>
            {content.grade && <em className="duration">{content.grade}</em>}
        </div>
        {content.achievements?.map((action, i) =>
            <div className="achievement" key={i}><div className="bullet" />{action}</div>
        )}
    </div>
)

export default Education;
