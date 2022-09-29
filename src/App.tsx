import React, {useState} from 'react';
import './App.css'
import Editor from "./components/Editor";
import Resume from "./Resume";
import {PortfolioData} from "./types";
// @ts-ignore
import { jsPDF } from "jspdf";
import ErrorBoundary from "./components/ErrorBoundary";
import { AiFillGithub } from 'react-icons/ai'

export let themes = ["Classic", "Simple"]

let initial: PortfolioData = {
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
                        "Supervised, managed and led the team of 8 peers in the development of a robust upgrade for a client’s existing software application, resulting in 35% incremental revenue in 9 months.",
                        "Mentored and solved complex technological issues for a variety of assigned projects, achieving over 97% customer satisfaction rate.",
                        "Created and led a team of 20+ peers to launch over 10 e-commerce sites for a variety of assigned projects, integrating Stripe, PayPal, authorize.net and other payment APIs."
                    ]
                },
                {
                    "position": "Lead Software Engineer",
                    "company": "Resume Worded",
                    "duration": "Jan 2015 – May 2018",
                    "actions": [
                        "Led the application development team to successfully launch the application on time with 6+ constraints, while ensuring adherence to the highest level of quality standards and meeting customer requirements.",
                        "Determined areas of improvements by regularly monitoring existing business systems, boosting business efficiency by at least 10 to 25% every year through automation of repetitive tasks.",
                        "Documented all supported systems and applications to streamline existing business procedures, effectively training new team members and reducing on-boarding time by 34%"
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
                        "Worked with senior technology solutions team members to assist with development of over 12+ software solutions in a wide variety of platforms including web, desktop and mobile."
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
                    "description": "JSON based resume builder made using React",
                    "link": "http://www.justins.io/",
                    "actions": [
                        "Created the application using Typescript and React with functional components and levereged PrismJS to create the JSON editor.",
                        "Implemented a custom HTML to PDF processor to optimize for ATS using jsPDF.",
                        "Made a GitHub automation to build and upload the application over SSH using Rsync to increase productivity."
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

let local = window.localStorage.getItem("portfolio-data")
if (local) {
    initial = JSON.parse(local)
}

function exportToPDF() {
    let element = document.getElementById('resume')
    if (!element) return
    let pdf = new jsPDF({
        unit: 'pt'
    })
    let scale = 0.5166
    let nodes: Array<Node> = [element]
    let range = document.createRange()
    range.selectNode(element)
    let resumeRect = range.getBoundingClientRect();
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        for (let i = 0; i < node.childNodes.length; i++) {
            nodes.push(node.childNodes[i])
        }
        if (node.nodeName === "#text") {
            // @ts-ignore
            let text = node.textContent
            let parent = node.parentElement
            if (parent && text) {
                let style = window.getComputedStyle(parent, null)
                pdf.setTextColor(style.getPropertyValue("color"))
                //pdf.setFont(style.getPropertyValue("font-family"), style.getPropertyValue("font-style"))
                let size = parseFloat(style.getPropertyValue("font-size").replace("px", ""))
                pdf.setFontSize(size * scale)
                let range = document.createRange()
                range.selectNode(node)
                let pos = range.getBoundingClientRect();

                // @ts-ignore
                if (parent.origin) {
                    pdf.link(
                        (pos.left - resumeRect.left) * scale,
                        (pos.top - resumeRect.top) * scale,
                        (pos.width) * scale,
                        (pos.height) * scale,
                        {
                            // @ts-ignore
                            url: parent.origin
                        }
                    )
                }
                pdf.text(
                    text,
                    (pos.left - resumeRect.left) * scale,
                    (pos.top - resumeRect.top) * scale,
                    {
                        baseline: 'top',
                        //renderingMode: 'invisible'
                        maxWidth: (pos.width + 10) * scale
                    }
                )

            }
        } else if (node instanceof Element) {
            let style = window.getComputedStyle(node, null)
            let color = style.getPropertyValue("background-color")
            let pos = node.getBoundingClientRect()
            if (color !== "rgba(0, 0, 0, 0)") {
                pdf.setFillColor(color)
                pdf.setDrawColor(color)
                pdf.rect(
                    (pos.left - resumeRect.left) * scale,
                    (pos.top - resumeRect.top) * scale,
                    pos.width * scale,
                    pos.height * scale,
                    'F'
                )
            }
            let border = style.getPropertyValue("border-top")
            let args = [...border.split(' ', 2)]
            args.push(border.substring(border.indexOf(' ', border.indexOf(args[1])) + 1))
            if (args[1] !== 'none') {
                pdf.setFillColor(args[2])
                pdf.setDrawColor(args[2])
                pdf.line(
                    (pos.left - resumeRect.left) * scale,
                    (pos.top - resumeRect.top) * scale,
                    (pos.right - resumeRect.left) * scale,
                    (pos.top - resumeRect.top) * scale,
                    'FD'
                )
            }
            border = style.getPropertyValue("border-bottom")
            args = [...border.split(' ', 2)]
            args.push(border.substring(border.indexOf(' ', border.indexOf(args[1])) + 1))
            if (args[1] !== 'none') {
                pdf.setFillColor(args[2])
                pdf.setDrawColor(args[2])
                pdf.line(
                    (pos.left - resumeRect.left) * scale,
                    (pos.bottom - resumeRect.top) * scale,
                    (pos.right - resumeRect.left) * scale,
                    (pos.bottom - resumeRect.top) * scale,
                    'FD'
                )
            }
        }
    }
    console.log(pdf)
    pdf.save('resume.pdf')
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
            window.localStorage.setItem("portfolio-data", JSON.stringify(newData))
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
