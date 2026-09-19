import React, {ChangeEvent, useRef} from "react";
import {GistConfig, VersionStore} from "../versionStore";
import "./VersionBar.css";

interface VersionBarProps {
    store: VersionStore
    gist: GistConfig
    status: string
    onSwitch: (id: string) => void
    onSaveAs: () => void
    onRename: () => void
    onDelete: () => void
    onExport: () => void
    onImport: (file: File) => void
    onGistChange: (next: GistConfig) => void
    onPush: () => void
    onPull: () => void
}

const VersionBar = ({
    store,
    gist,
    status,
    onSwitch,
    onSaveAs,
    onRename,
    onDelete,
    onExport,
    onImport,
    onGistChange,
    onPush,
    onPull,
}: VersionBarProps) => {
    const fileInput = useRef<HTMLInputElement>(null)

    const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) onImport(file)
        event.target.value = ""
    }

    return (
        <div className="version-bar">
            <div className="version-row">
                <label className="version-label">
                    Version
                    <select
                        value={store.activeId}
                        onChange={event => onSwitch(event.target.value)}
                        aria-label="Resume version"
                    >
                        {store.versions.map(version => (
                            <option key={version.id} value={version.id}>{version.name}</option>
                        ))}
                    </select>
                </label>
                <button type="button" onClick={onSaveAs}>Save as</button>
                <button type="button" onClick={onRename}>Rename</button>
                <button type="button" onClick={onDelete} disabled={store.versions.length <= 1}>Delete</button>
                <button type="button" onClick={onExport}>Download versions</button>
                <button type="button" onClick={() => fileInput.current?.click()}>Import versions</button>
                <input
                    ref={fileInput}
                    type="file"
                    accept="application/json,.json"
                    hidden
                    onChange={chooseFile}
                />
            </div>
            <div className="version-row">
                <label className="version-label">
                    Gist token
                    <input
                        type="password"
                        autoComplete="off"
                        placeholder="github gist scope"
                        value={gist.token}
                        onChange={event => onGistChange({...gist, token: event.target.value})}
                    />
                </label>
                <label className="version-label">
                    Gist id
                    <input
                        type="text"
                        placeholder="created on first push"
                        value={gist.gistId}
                        onChange={event => onGistChange({...gist, gistId: event.target.value})}
                    />
                </label>
                <button type="button" onClick={onPush}>Push gist</button>
                <button type="button" onClick={onPull} disabled={!gist.gistId}>Pull gist</button>
            </div>
            {status ? <p className="version-status" role="status">{status}</p> : null}
        </div>
    )
}

export default VersionBar
