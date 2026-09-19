import {VersionStore} from "./versionStore";

const GIST_FILE = "resume-versions.json"
const GITHUB_API = "https://api.github.com/gists"

function headers(token: string): HeadersInit {
    return {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
}

async function readError(response: Response): Promise<string> {
    try {
        const body = await response.json()
        if (body && typeof body.message === "string") return body.message
    } catch {
        // ignore parse failures
    }
    return `GitHub Gist request failed (${response.status})`
}

export function parseGistStore(payload: unknown): VersionStore {
    if (!payload || typeof payload !== "object") {
        throw new Error("Gist did not contain resume versions")
    }
    const files = (payload as {files?: Record<string, {content?: string}>}).files
    const file = files?.[GIST_FILE] ?? Object.values(files ?? {})[0]
    if (!file?.content) {
        throw new Error("Gist is missing resume-versions.json")
    }
    const parsed = JSON.parse(file.content)
    if (!parsed?.activeId || !Array.isArray(parsed.versions) || parsed.versions.length === 0) {
        throw new Error("Gist JSON is not a version store")
    }
    return parsed as VersionStore
}

export async function pushGist(token: string, gistId: string, store: VersionStore): Promise<string> {
    if (!token.trim()) {
        throw new Error("A GitHub token with the gist scope is required")
    }
    const body = {
        description: "Resume Builder versions",
        public: false,
        files: {
            [GIST_FILE]: {
                content: JSON.stringify(store, null, 2)
            }
        }
    }
    const updating = Boolean(gistId.trim())
    const response = await fetch(updating ? `${GITHUB_API}/${gistId.trim()}` : GITHUB_API, {
        method: updating ? "PATCH" : "POST",
        headers: headers(token.trim()),
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(await readError(response))
    }
    const created = await response.json()
    if (!created?.id) {
        throw new Error("GitHub did not return a gist id")
    }
    return created.id as string
}

export async function pullGist(token: string, gistId: string): Promise<VersionStore> {
    if (!token.trim() || !gistId.trim()) {
        throw new Error("GitHub token and gist id are required to pull")
    }
    const response = await fetch(`${GITHUB_API}/${gistId.trim()}`, {
        headers: headers(token.trim())
    })
    if (!response.ok) {
        throw new Error(await readError(response))
    }
    return parseGistStore(await response.json())
}
