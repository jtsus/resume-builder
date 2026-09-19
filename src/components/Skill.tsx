import React from "react";
import Editable from "./Editable";

const Skill = ({content, onChange, onEnter, onDeleteEmpty}: {
    content: string
    onChange: (content: string) => void
    onEnter?: () => void
    onDeleteEmpty?: () => void
}) =>
    <div className="skill">
        <div className="bullet" contentEditable={false}/>
        <Editable tag="span" value={content} onChange={onChange} onEnter={onEnter} onDeleteEmpty={onDeleteEmpty}/>
    </div>

export default Skill
