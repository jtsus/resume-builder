
export interface InfoEntry {
    type: 'email' | 'phone' | 'location'
    content: string
}

export interface SchoolEntry {
    school: string
    degree: string
    duration: string
    achievements: string[]
}

export interface WorkEntry {
    company: string
    position: string
    duration: string
    actions: string[]
}

export interface Section {
    title: string
    type: 'skill' | 'education' | 'experience'
    entries: string[] | SchoolEntry[] | WorkEntry[]
}

export interface PortfolioData {
    theme: string
    name: string
    title: string
    website?: string
    info: InfoEntry[]
    sections?: Section[]
}