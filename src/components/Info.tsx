import React from "react";
import {InfoEntry} from "../types";
import Editable from "./Editable";

const Info = ({entry, onChange}: { entry: InfoEntry, onChange: (entry: InfoEntry) => void }) => {
    if (entry.type === 'website') {
        const href = (!entry.content.startsWith('http') ? 'https://' : '') + entry.content
        return <Editable
            tag="a"
            className="info"
            href={href}
            value={entry.content}
            onChange={(content) => onChange({...entry, content})}
        />
    }
    return <Editable
        className="info"
        value={entry.content}
        onChange={(content) => onChange({...entry, content})}
    />
}

export default Info
