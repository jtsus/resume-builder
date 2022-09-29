import {ResumeData} from "./types";

export default function parse(json: string) {
    try {
        let parsed = JSON.parse(json) as ResumeData;
        if (parsed.sections) {
            for (let i = 0; i < parsed.sections.length; i++){
                let section = parsed.sections[i];
                if (section.entries.length === 0) {
                    parsed.sections.splice(i--, 1)
                }
            }
            if (parsed.sections.length === 0) parsed.sections = undefined
        }
        return parsed
    } catch (e) {
        return undefined;
    }
}

//function applyRestrictions(data: any, restrictions: any) {
//    for (let key in restrictions) {
//        let restriction = restrictions[key]
//        if (Array.isArray(restriction)) {
//            let options = restriction as Array<any>
//            if (!data.hasOwnProperty(key)) {
//                data[key] = options[0]
//            } else if (!(data[key] in options)) {
//                let valid = options.find(option => option instanceof String && option.startsWith(data[key]))
//                if (!valid) return false
//                data[key] = valid
//            }
//        } else {
//            if (!data.hasOwnProperty(key)) {
//                data[key] = {}
//            }
//            if (!applyRestrictions(data[key], restriction)) return false
//        }
//    }
//    return true
//}
