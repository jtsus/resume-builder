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
        },
        {
            "title": "Projects",
            "type": "project",
            "entries": [
                {
                    "name": "Resume Builder",
                    "description": "A json based resume builder made using React",
                    "link": "http://www.justins.io/",
                    "actions": [
                        "Placed some blocks"
                    ]
                }
            ]
        }
    ]
}

let local = window.localStorage.getItem("portfolio-data")
if (local) {
    initial = JSON.parse(local)
}

function App() {
    const [data, setData] = useState(initial)
    return (
    <div className="app">
        <Editor data={data} setData={(newData: any) => {
            window.localStorage.setItem("portfolio-data", JSON.stringify(newData))
            setData(newData)
        }}/>
        <Portfolio data={data}/>
    </div>
  );
}

export default App;
