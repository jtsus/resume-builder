import {jsPDF} from "jspdf";

export function exportToPDF() {
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