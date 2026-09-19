import React from "react";
import {SchoolEntry} from "../types";
import Editable from "./Editable";
import BulletList from "./BulletList";

const Education = ({content, onChange}: { content: SchoolEntry, onChange: (content: SchoolEntry) => void }) => {
    const addFirstAchievement = () => {
        if (!content.achievements || content.achievements.length === 0) {
            onChange({...content, achievements: [""]})
        }
    }

    return (
        <div className="education">
            <div className="spaced-line">
                <Editable className="header" value={content.school}
                          onEnter={addFirstAchievement}
                          onChange={(school) => onChange({...content, school})}/>
                <Editable className="location" value={content.duration}
                          onEnter={addFirstAchievement}
                          onChange={(duration) => onChange({...content, duration})}/>
            </div>
            <div className="spaced-line">
                <Editable tag="em" className="subheader" value={content.degree}
                          onEnter={addFirstAchievement}
                          onChange={(degree) => onChange({...content, degree})}/>
                {content.grade && <Editable tag="em" className="duration" value={content.grade}
                                            onChange={(grade) => onChange({...content, grade})}/>}
            </div>
            {content.achievements &&
                <BulletList
                    items={content.achievements}
                    itemClassName="action"
                    onChange={(achievements) => onChange({
                        ...content,
                        achievements: achievements.length ? achievements : undefined
                    })}
                />}
        </div>
    )
}

export default Education
