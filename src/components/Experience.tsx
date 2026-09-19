import React from "react";
import {WorkEntry} from "../types";
import Editable from "./Editable";
import BulletList from "./BulletList";

const Experience = ({content, onChange}: { content: WorkEntry, onChange: (content: WorkEntry) => void }) => {
    const addFirstBullet = () => {
        if (content.actions.length === 0) {
            onChange({...content, actions: [""]})
        }
    }

    return (
        <div className="experience">
            <div className="spaced-line">
                {content.link
                    ? <Editable tag="a" href={content.link} target="_blank" className="header" value={content.company}
                                onChange={(company) => onChange({...content, company})}/>
                    : <Editable className="header" value={content.company}
                                onChange={(company) => onChange({...content, company})}/>}
                {content.location
                    ? <Editable className="location" value={content.location}
                                onChange={(location) => onChange({...content, location})}/>
                    : <Editable className="duration" value={content.duration}
                                onChange={(duration) => onChange({...content, duration})}/>}
            </div>
            <div className="spaced-line">
                <Editable tag="em" className="subheader" value={content.position}
                          onEnter={addFirstBullet}
                          onChange={(position) => onChange({...content, position})}/>
                {content.location && <Editable tag="em" className="duration" value={content.duration}
                                               onChange={(duration) => onChange({...content, duration})}/>}
            </div>
            {content.description &&
                <Editable className="description" value={content.description}
                          onEnter={addFirstBullet}
                          onChange={(description) => onChange({...content, description})}/>}
            <BulletList
                items={content.actions}
                itemClassName="action"
                onChange={(actions) => onChange({...content, actions})}
            />
        </div>
    )
}

export default Experience
