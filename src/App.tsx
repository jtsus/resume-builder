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
    "name": "Justin Schreiber",
    "title": "Software Engineer",
    "info": [
        {
            "type": "email",
            "content": "justintschreiber@gmail.com"
        },
        {
            "type": "phone",
            "content": "(323) 507-5115"
        },
        {
            "type": "location",
            "content": "Santa Cruz, CA"
        },
        {
            "type": "website",
            "content": "http://www.justins.io/"
        }
    ],
    "sections": [
        {
            "title": "Education",
            "type": "education",
            "entries": [
                {
                    "degree": "Computer Engineering",
                    "school": "University of California, Santa Cruz",
                    "duration": "Jun 2020 – Dec 2023"
                }
            ]
        },
        {
            "title": "Work Experience",
            "type": "experience",
            "entries": [
                {
                    "position": "Senior Software Engineer",
                    "company": "Growthsi",
                    "duration": "Jun 2018 – Present",
                    "actions": [
                        "Supervised and managed the team of 8 peers in the development of a robust upgrade for a client’s existing software application, resulting in 35% incremental revenue in 9 months.",
                        "Mentored and solved complex technological issues for a variety of assigned projects, achieving over 97% customer satisfaction rate.",
                        "Created a team of 20+ peers to launch over 10 e-commerce sites for a variety of assigned projects, integrating Stripe, PayPal, Authorize.net and other payment APIs."
                    ]
                },
                {
                    "position": "Lead Software Engineer",
                    "company": "Resume Worded",
                    "duration": "Jan 2015 – May 2018",
                    "actions": [
                        "Led the application development team to successfully launch the application on time with 6+ constraints, while ensuring adherence to the highest level of quality standards and meeting customer requirements.",
                        "Determined areas of improvements by regularly monitoring existing business systems, boosting business efficiency by at least 10 to 25% every year through automation of repetitive tasks.",
                        "Documented all supported systems and applications to streamline existing business procedures, effectively training new team members and reducing on-boarding time by 34%."
                    ]
                },
                {
                    "position": "Software Engineer",
                    "company": "Tubnet Operations, LLC",
                    "duration": "May 2010 – Dec 2014",
                    "actions": [
                        "Participated in sales presentations due to ability to translate user needs into usable software solutions, assisting the sales team in closing 3 deals generating $200K+ in revenue.",
                        "Provided designing and programming support in enhancement of web applications accessed by over 3 million users worldwide.",
                        "Awarded ‘Employee of the Year’ twice in a row, due to earning highest customer satisfaction rate for all software solutions delivered.",
                        "Promoted within 18 months due to strong performance and organizational impact (one year ahead of schedule)."
                    ]
                },
                {
                    "position": "Junior Software Engineer",
                    "company": "Ikara Software, LTD",
                    "duration": "May 2010 – Dec 2014",
                    "actions": [
                        "Participated in coding activities, maintaining integrity of program logic and coding and developing and updating existing systems to increase task success rate by 15%.",
                        "Worked with senior technology solutions team members to assist with development of over 12+ software solutions in web, desktop and mobile platforms."
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
                        "Implemented a custom HTML to PDF processor to optimize for ATS using JSPDF without exporting the page to JPG.",
                        "Developed a GitHub automation to build and upload the application over SSH using Rsync to increase productivity."
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
                "OOP",
                "React",
                "Unity",
                "MongoDB"
            ]
        }
    ]
}

let local = window.localStorage.getItem("resume-data")
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
            window.localStorage.setItem("resume-data", JSON.stringify(newData))
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
