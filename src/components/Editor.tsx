import React, {useState} from "react";

import IDE from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import {ResumeData} from "../types";
import './Editor.css'
import parse from "../validate";

const Editor = ({data, setData}: {data: ResumeData, setData: any}) => {
    const [input, setInput] = useState(JSON.stringify(data, null, 2))
    return <div className="editor">
        <link href="./prism.css" rel="stylesheet" />
        <script src="./prism.js"/>
        <IDE
            // @ts-ignore
            value={input}
            onValueChange={(code: any) => {
                setInput(code)
                let parsed = parse(code)
                if (parsed) {
                    setData(parsed)
                }
            }}
            highlight={(code: any) => {
                console.log(code)
                return highlight(code, languages.json)
            }}
            padding={10}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
            }}
        />
    </div>;
}

export default Editor;