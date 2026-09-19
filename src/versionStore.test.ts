import {
    ACTIVE_SNAPSHOT_KEY,
    addVersion,
    createStore,
    deleteVersion,
    loadStore,
    persistStore,
    renameVersion,
    replaceStore,
    switchVersion,
    updateActiveData,
    VERSIONS_KEY,
} from "./versionStore";
import {ResumeData} from "./types";
import {parseGistStore} from "./gistSync";

const sample: ResumeData = {
    theme: "Simple",
    name: "Ada Lovelace",
    info: [{type: "email", content: "ada@example.com"}],
}

function memoryStorage(initial: Record<string, string> = {}): Storage {
    const map = new Map<string, string>(Object.entries(initial))
    return {
        get length() { return map.size },
        clear: () => map.clear(),
        getItem: (key: string) => map.get(key) ?? null,
        key: (index: number) => Array.from(map.keys())[index] ?? null,
        removeItem: (key: string) => { map.delete(key) },
        setItem: (key: string, value: string) => { map.set(key, value) },
    }
}

test("migrates a single legacy resume_data snapshot into a version store", () => {
    const storage = memoryStorage({
        [ACTIVE_SNAPSHOT_KEY]: JSON.stringify(sample),
    })
    const store = loadStore({...sample, name: "Fallback"}, storage)
    expect(store.versions).toHaveLength(1)
    expect(store.versions[0].data.name).toBe("Ada Lovelace")
    expect(store.activeId).toBe(store.versions[0].id)
})

test("saves, switches, and deletes versions without dropping the last copy", () => {
    let store = createStore(sample, "Main")
    store = addVersion(store, "Frontend", {...sample, name: "Frontend Ada"})
    expect(store.versions).toHaveLength(2)
    expect(store.versions.find(v => v.id === store.activeId)?.name).toBe("Frontend")

    store = switchVersion(store, store.versions[0].id)
    expect(store.versions.find(v => v.id === store.activeId)?.name).toBe("Main")

    store = updateActiveData(store, {...sample, title: "Mathematician"})
    expect(store.versions[0].data.title).toBe("Mathematician")

    store = renameVersion(store, store.versions[1].id, "  SWE  ")
    expect(store.versions[1].name).toBe("SWE")

    const afterDelete = deleteVersion(store, store.versions[1].id)
    expect(afterDelete.versions).toHaveLength(1)
    expect(deleteVersion(afterDelete, afterDelete.versions[0].id).versions).toHaveLength(1)
})

test("persistStore writes both the collection and the active snapshot", () => {
    const storage = memoryStorage()
    const store = addVersion(createStore(sample, "Main"), "Copy", {...sample, name: "Copy"})
    persistStore(store, storage)
    const saved = JSON.parse(storage.getItem(VERSIONS_KEY) as string)
    expect(saved.versions).toHaveLength(2)
    expect(JSON.parse(storage.getItem(ACTIVE_SNAPSHOT_KEY) as string).name).toBe("Copy")
})

test("replaceStore rejects invalid imports", () => {
    expect(() => replaceStore({activeId: "x", versions: []} as any)).toThrow(/Invalid/)
})

test("parseGistStore reads resume-versions.json from a gist payload", () => {
    const store = createStore(sample, "Cloud")
    const parsed = parseGistStore({
        files: {
            "resume-versions.json": {content: JSON.stringify(store)}
        }
    })
    expect(parsed.versions[0].name).toBe("Cloud")
})
