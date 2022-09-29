
export interface InfoEntry {
    type: 'email' | 'phone' | 'location' | 'website'
    content: string
}

export interface SchoolEntry {
    school: string
    degree: string
    duration: string
    achievements?: string[]
}

export interface WorkEntry {
    company: string
    position: string
    duration: string
    actions: string[]
}

export interface ProjectEntry {
    name: string
    description: string
    link: string
    actions: string[]
}

export interface Section {
    title: string
    type: 'skill' | 'education' | 'experience' | 'project'
    entries: string[] | SchoolEntry[] | WorkEntry[] | ProjectEntry[]
}

export interface ResumeData {
    theme: string
    name: string
    title: string
    website?: string
    info: InfoEntry[]
    sections?: Section[]
}