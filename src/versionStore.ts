import {ResumeData} from "./types";

export const VERSIONS_KEY = "resume_versions"
export const ACTIVE_SNAPSHOT_KEY = "resume_data"
export const GIST_CONFIG_KEY = "resume_gist_config"

export interface ResumeVersion {
    id: string
    name: string
    updatedAt: number
    data: ResumeData
}

export interface VersionStore {
    activeId: string
    versions: ResumeVersion[]
}

export interface GistConfig {
    token: string
    gistId: string
}

export function createVersionId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function isStore(value: unknown): value is VersionStore {
    if (!value || typeof value !== "object") return false
    const store = value as VersionStore
    return typeof store.activeId === "string"
        && Array.isArray(store.versions)
        && store.versions.length > 0
        && store.versions.every(version =>
            version
            && typeof version.id === "string"
            && typeof version.name === "string"
            && typeof version.updatedAt === "number"
            && version.data
            && typeof version.data === "object")
        && store.versions.some(version => version.id === store.activeId)
}

function parseJson(raw: string | null): unknown {
    if (!raw) return undefined
    try {
        return JSON.parse(raw)
    } catch {
        return undefined
    }
}

export function createStore(data: ResumeData, name = "Main"): VersionStore {
    const id = createVersionId()
    return {
        activeId: id,
        versions: [{id, name, updatedAt: Date.now(), data}]
    }
}

export function loadStore(fallback: ResumeData, storage: Storage = window.localStorage): VersionStore {
    const stored = parseJson(storage.getItem(VERSIONS_KEY))
    if (isStore(stored)) {
        return stored
    }

    const legacy = parseJson(storage.getItem(ACTIVE_SNAPSHOT_KEY))
    const data = legacy && typeof legacy === "object" ? legacy as ResumeData : fallback
    return createStore(data)
}

export function persistStore(store: VersionStore, storage: Storage = window.localStorage): void {
    storage.setItem(VERSIONS_KEY, JSON.stringify(store))
    const active = getActive(store)
    storage.setItem(ACTIVE_SNAPSHOT_KEY, JSON.stringify(active.data))
}

export function getActive(store: VersionStore): ResumeVersion {
    return store.versions.find(version => version.id === store.activeId) ?? store.versions[0]
}

export function updateActiveData(store: VersionStore, data: ResumeData): VersionStore {
    return {
        ...store,
        versions: store.versions.map(version =>
            version.id === store.activeId
                ? {...version, data, updatedAt: Date.now()}
                : version)
    }
}

export function switchVersion(store: VersionStore, id: string): VersionStore {
    if (!store.versions.some(version => version.id === id)) return store
    return {...store, activeId: id}
}

export function addVersion(store: VersionStore, name: string, data: ResumeData): VersionStore {
    const version: ResumeVersion = {
        id: createVersionId(),
        name: name.trim() || "Untitled",
        updatedAt: Date.now(),
        data
    }
    return {
        activeId: version.id,
        versions: [...store.versions, version]
    }
}

export function renameVersion(store: VersionStore, id: string, name: string): VersionStore {
    const nextName = name.trim()
    if (!nextName) return store
    return {
        ...store,
        versions: store.versions.map(version =>
            version.id === id ? {...version, name: nextName, updatedAt: Date.now()} : version)
    }
}

export function deleteVersion(store: VersionStore, id: string): VersionStore {
    if (store.versions.length <= 1) return store
    const versions = store.versions.filter(version => version.id !== id)
    const activeId = store.activeId === id ? versions[0].id : store.activeId
    return {activeId, versions}
}

export function replaceStore(next: VersionStore): VersionStore {
    if (!isStore(next)) {
        throw new Error("Invalid resume versions file")
    }
    return next
}

export function loadGistConfig(storage: Storage = window.localStorage): GistConfig {
    const stored = parseJson(storage.getItem(GIST_CONFIG_KEY))
    if (stored && typeof stored === "object") {
        const config = stored as Partial<GistConfig>
        return {
            token: typeof config.token === "string" ? config.token : "",
            gistId: typeof config.gistId === "string" ? config.gistId : ""
        }
    }
    return {token: "", gistId: ""}
}

export function persistGistConfig(config: GistConfig, storage: Storage = window.localStorage): void {
    storage.setItem(GIST_CONFIG_KEY, JSON.stringify(config))
}
