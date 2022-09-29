import React from "react";
import {SchoolEntry} from "../types";

const Education = ({content}: { content: SchoolEntry }) => (
    <div className="education">
        <div className="spaced-line">
            <div className="degree">{content.degree}</div>
            <div className="duration">{content.duration}</div>
        </div>
        <div className="school">{content.school}</div>
        {content.achievements?.map((action, i) =>
            <div className="achievement" key={i}><div className="bullet" />{action}</div>
        )}
    </div>
)

export default Education;