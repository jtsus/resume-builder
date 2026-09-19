import React from "react";
import {ProjectEntry} from "../types";
import Editable from "./Editable";
import BulletList from "./BulletList";

const Project = ({content, onChange}: { content: ProjectEntry, onChange: (content: ProjectEntry) => void }) => {
    const addFirstBullet = () => {
        if (content.actions.length === 0) {
            onChange({...content, actions: [""]})
        }
    }

    return (
        <div className="project">
            <div className="spaced-line">
                <Editable className="subheader" value={content.name} onEnter={addFirstBullet}
                          onChange={(name) => onChange({...content, name})}/>
                {content.link &&
                    <Editable tag="a" className="duration" href={content.link} value={content.link}
                              onChange={(link) => onChange({...content, link})}/>}
            </div>
            {content.description &&
                <Editable className="description" value={content.description} onEnter={addFirstBullet}
                          onChange={(description) => onChange({...content, description})}/>}
            <BulletList
                items={content.actions}
                itemClassName="action"
                onChange={(actions) => onChange({...content, actions})}
            />
        </div>
    )
}

export default Project
