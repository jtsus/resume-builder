import React, {useState} from 'react';
import './App.css'
import Editor from "./components/Editor";
import Resume from "./Resume";
import {ResumeData} from "./types";
import ErrorBoundary from "./components/ErrorBoundary";
import { AiFillGithub } from 'react-icons/ai'
import { exportToPDF } from "./pdfExport";
import VersionBar from "./components/VersionBar";
import {pullGist, pushGist} from "./gistSync";
import {
    addVersion,
    deleteVersion,
    getActive,
    GistConfig,
    loadGistConfig,
    loadStore,
    persistGistConfig,
    persistStore,
    renameVersion,
    replaceStore,
    switchVersion,
    updateActiveData,
    VersionStore,
} from "./versionStore";
export let themes = ["Classic", "Simple"]

let initial: ResumeData = {
    "theme": "Simple",
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
                {
                    "label": "Languages",
                    "entries": [
                        "Java", 
                        "C#",
                        "C",
                        "C++",
                        "JavaScript",
                    ]
                },
                {
                    "label": "Databases",
                    "entries": [
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
    ]
}

const startingStore = loadStore(initial)

function applyStore(next: VersionStore, setStore: (store: VersionStore) => void, setData: (data: ResumeData) => void) {
    persistStore(next)
    setStore(next)
    setData(getActive(next).data)
}

function App() {
    const [store, setStore] = useState(startingStore)
    const [data, setData] = useState(getActive(startingStore).data)
    const [gist, setGist] = useState(loadGistConfig)
    const [status, setStatus] = useState("")

    const commit = (next: VersionStore) => applyStore(next, setStore, setData)

    const updateGist = (next: GistConfig) => {
        persistGistConfig(next)
        setGist(next)
    }

    return (
    <div className="app">
        <VersionBar
            store={store}
            gist={gist}
            status={status}
            onSwitch={(id) => commit(switchVersion(store, id))}
            onSaveAs={() => {
                const name = window.prompt("Name for this resume version", `${getActive(store).name} copy`)
                if (!name) return
                commit(addVersion(store, name, data))
            }}
            onRename={() => {
                const name = window.prompt("Rename version", getActive(store).name)
                if (!name) return
                commit(renameVersion(store, store.activeId, name))
            }}
            onDelete={() => {
                if (!window.confirm(`Delete version “${getActive(store).name}”?`)) return
                commit(deleteVersion(store, store.activeId))
            }}
            onExport={() => {
                const blob = new Blob([JSON.stringify(store, null, 2)], {type: "application/json"})
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = "resume-versions.json"
                link.click()
                URL.revokeObjectURL(url)
            }}
            onImport={(file) => {
                file.text().then(text => {
                    commit(replaceStore(JSON.parse(text)))
                    setStatus("Imported versions from file")
                }).catch(() => setStatus("Could not import that versions file"))
            }}
            onGistChange={updateGist}
            onPush={async () => {
                try {
                    const gistId = await pushGist(gist.token, gist.gistId, store)
                    updateGist({...gist, gistId})
                    setStatus(gist.gistId ? "Pushed versions to GitHub Gist" : `Created gist ${gistId}`)
                } catch (error) {
                    setStatus(error instanceof Error ? error.message : "Push failed")
                }
            }}
            onPull={async () => {
                try {
                    commit(replaceStore(await pullGist(gist.token, gist.gistId)))
                    setStatus("Pulled versions from GitHub Gist")
                } catch (error) {
                    setStatus(error instanceof Error ? error.message : "Pull failed")
                }
            }}
        />
        <div className="action-bar">
            <button onClick={() => exportToPDF(`${data.name.replace(' ', '_')}_resume.pdf`)}>Export</button>
            <a className="icon-button" href="https://github.com/JustinSamaKun/resume-builder">GitHub <AiFillGithub /></a>
        </div>
        <Editor key={store.activeId} data={data} setData={(newData: any) => {
            const next = updateActiveData(store, newData)
            persistStore(next)
            setStore(next)
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
