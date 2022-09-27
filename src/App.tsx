import React, {useState} from 'react';
import './App.css'
import Portfolio from "./Portfolio";
import Editor from "./Editor";
import {PortfolioData} from "./types";

export let themes = ["Classic", "Simple"]

let initial: PortfolioData = {
    theme: themes[0],
    name: "Justin Schreiber",
    title: "Software Engineer",
    info: [
        {
            type: "email",
            content: "notmyemail@gmail.com"
        },
        {
            type: "phone",
            content: "(323) 507-5555"
        },
        {
            type: "location",
            content: "San Jose, CA"
        }
    ],
    sections: [
        {
            title: "Skills",
            type: "skill",
            entries: [
                "Java", "C#", "C",  "C++", "JavaScript", "Python", "OOP", "React", "Unity", "MongoDB"
            ]
        },
        {
            title: "Education",
            type: "education",
            entries: [
                {
                    degree: "Computer Engineering",
                    school: "University of California, Santa Cruz",
                    duration: "Expected 12/2023",
                    achievements: [
                        "GPA: 3.6"
                    ]
                }
            ]
        },
        {
            title: "Work Experience",
            type: 'experience',
            entries: [
                {
                    position: "Software Developer",
                    company: "Tubnet Operations, LLC",
                    duration: "03/2022 - Present",
                    actions: [
                        "Placed some blocks"
                    ]
                }
            ]
        }
    ]
}

function App() {
    const [data, setData] = useState(initial)
    return (
    <div className="app">
        <Editor data={data} setData={setData}/>
        <Portfolio data={data}/>
    </div>
  );
}

export default App;
