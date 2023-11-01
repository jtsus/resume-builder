import React from "react";
import {InfoEntry} from "../types";


const Info = ({entry}: { entry: InfoEntry }) => {
    if (entry.type === 'website') {
        return <a className="info" href={(!entry.content.startsWith('http') ? 'https://' : '') + entry.content}>{entry.content}</a>
    }
    //if (entry.type === 'email') {
    //    return <a className="info" href={`mailto:${entry.content}`}>{entry.content}</a>
    //}
    return <div className="info">{entry.content}</div>
}

export default Info;
