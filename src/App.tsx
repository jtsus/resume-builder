import React, {useState} from 'react';
import './App.css'
import Editor from "./components/Editor";
import Resume from "./Resume";
import {ResumeData} from "./types";
import ErrorBoundary from "./components/ErrorBoundary";
import { AiFillGithub } from 'react-icons/ai'
import { exportToPDF } from "./pdfExport";

export let themes = ["Classic", "Simple"]

let initial: ResumeData = {
    "theme": "Classic",
    "name": "John Doe",
    "title": "Software Engineer",
    "info": [
        {
            "type": "email",
            "content": "--"
        },
        {
            "type": "phone",
            "content": "--"
        },
        {
            "type": "location",
            "content": "--"
        },
        {
            "type": "website",
            "content": "https://github.com/--"
        }
    ],
    "sections": [
        {
            "title": "Education",
            "type": "education",
            "entries": [
                {
                    "degree": "Computer Engineering",
                    "school": "University of California, Los Angeles",
                    "duration": "Sep 2020 – Jun 2024"
                }
            ]
        },
        {
            "title": "Work Experience",
            "type": "experience",
            "entries": [
                {
                    "position": "Software Developer",
                    "company": "Google",
                    "location": "Palo Alto",
                    "duration": "Mar 2021 – Present",
                    "actions": [
                        "Led the application development team to launch while ensuring adherence to the highest level of quality standards.",
                        "Architected the software design patterns used to ensure the creation of robust code through Services, Singletons and PubSub.",
                        "Solved complex technological issues across the organization using my experience with vector math and algorithms."
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
                    "description": "JSON based resume builder",
                    "link": "http://www.justins.io/",
                    "actions": [
                        "Created the application using Typescript and React and leveraged PrismJS to create the JSON editor.",
                        "Developed a custom HTML to PDF processor to optimize for ATS using JSPDF without exporting the page to JPG.",
                        "Implemented a GitHub automation to build and upload the application over SSH using Rsync to increase productivity."
                    ]
                }
            ]
        },
        {
            "title": "Skills",
            "type": "skill",
            "entries": [
                "Java",
                "C#",
                "C",
                "C++",
                "JavaScript",
                "Python",
                "MongoDB",
                "MySQL",
                "React",
                "React Native",
                "Unity",
                "CI/CD",
                "Kubernetes",
                "Docker",
                "NodeJS"
            ]
        }
    ]
}

let local = window.localStorage.getItem("resume_data")
if (local) {
    initial = JSON.parse(local)
}

function App() {
    const [data, setData] = useState(initial)
    return (
    <div className="app">
        <div className="action-bar">
            <button onClick={exportToPDF}>Export</button>
            <a className="icon-button" href="https://github.com/JustinSamaKun/resume-builder">GitHub <AiFillGithub /></a>
        </div>
        <Editor data={data} setData={(newData: any) => {
            window.localStorage.setItem("resume_data", JSON.stringify(newData))
            setData(newData)
        }}/>
        <div className="resume-holder">
            <ErrorBoundary>
                <Resume data={data}/>
            </ErrorBoundary>
        </div>
    </div>
  );
}

export default App;
