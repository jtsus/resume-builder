import {jsPDF} from "jspdf";

export function exportToPDF(name: string) {
    let element = document.getElementById('resume')
    if (!element) return
    let pdf = new jsPDF({
        unit: 'pt',
        orientation: 'p',
        format: 'letter'
    })
    let scale = 0.487
    let nodes: Array<Node> = [element]
    let range = document.createRange()
    range.selectNode(element)
    let resumeRect = range.getBoundingClientRect();
    let textNodes = []
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        for (let i = 0; i < node.childNodes.length; i++) {
            nodes.push(node.childNodes[i])
        }
        if (node.nodeName === "#text") {
            textNodes.push(node)
        } else if (node instanceof Element) {
            let style = window.getComputedStyle(node, null)
            let color = style.getPropertyValue("background-color")
            let pos = node.getBoundingClientRect()
            if (color !== "rgba(0, 0, 0, 0)") {
                pdf.setFillColor(color)
                pdf.setDrawColor(color)
                if (style.getPropertyValue('border-radius') === '100%') {
                    pdf.circle(
                        (pos.left - resumeRect.left + pos.width/2) * scale,
                        (pos.top - resumeRect.top + pos.width/2) * scale,
                        (pos.width/2) * scale,
                        'F'
                    )
                } else {
                    pdf.rect(
                        (pos.left - resumeRect.left) * scale,
                        (pos.top - resumeRect.top) * scale,
                        pos.width * scale,
                        pos.height * scale,
                        'F'
                    )
                }
            }
            let border = style.getPropertyValue("border-top")
            try {
                let args = [...border.split(' ', 2)]
                args.push(border.substring(border.indexOf(' ', border.indexOf(args[1])) + 1))
                if (args[1] !== 'none') {
                    pdf.setFillColor(args[2])
                    pdf.setDrawColor(args[2])
                    const size = parseFloat(args[0].replaceAll(/[^0-9.]/g, ''))
                    pdf.setLineWidth(size / 2)
                    pdf.line(
                        (pos.left - resumeRect.left) * scale,
                        (pos.top - resumeRect.top) * scale,
                        (pos.right - resumeRect.left) * scale,
                        (pos.top - resumeRect.top) * scale,
                        'FD'
                    )
                }
            } catch (e) {
                console.error('border-top:' + border, e)
            }
            border = style.getPropertyValue("border-bottom")
            try {
                let args = [...border.split(' ', 2)]
                args.push(border.substring(border.indexOf(' ', border.indexOf(args[1])) + 1))
                if (args[1] !== 'none') {
                    pdf.setFillColor(args[2])
                    pdf.setDrawColor(args[2])
                    const size = parseFloat(args[0].replaceAll(/[^0-9.]/g, ''))
                    pdf.setLineWidth(size / 2)
                    pdf.line(
                        (pos.left - resumeRect.left) * scale,
                        (pos.bottom - resumeRect.top) * scale,
                        (pos.right - resumeRect.left) * scale,
                        (pos.bottom - resumeRect.top) * scale,
                        'FD'
                    )
                }
            } catch (e) {
                console.error('border-bottom:' + border, e)
            }
            border = style.getPropertyValue("border-left")
            try {
                let args = [...border.split(' ', 2)]
                args.push(border.substring(border.indexOf(' ', border.indexOf(args[1])) + 1))
                if (args[1] !== 'none') {
                    pdf.setFillColor(args[2])
                    pdf.setDrawColor(args[2])
                    const size = parseFloat(args[0].replaceAll(/[^0-9.]/g, ''))
                    pdf.setLineWidth(size / 2)
                    pdf.line(
                        (pos.left - resumeRect.left) * scale,
                        (pos.top - resumeRect.top) * scale,
                        (pos.left - resumeRect.left) * scale,
                        (pos.bottom - resumeRect.top) * scale,
                        'FD'
                    )
                }
            } catch (e) {
                console.error('border-bottom:' + border, e)
            }
        }
    }
    // Sort text elements left to right then top to bottom for better parsing
    textNodes.sort((left, right) => {
        let range = document.createRange()
        range.selectNode(left)
        let posLeft = range.getBoundingClientRect();
        range = document.createRange()
        range.selectNode(right)
        let posRight = range.getBoundingClientRect();
        return posLeft.left - posRight.left
    })
    textNodes.sort((left, right) => {
        let range = document.createRange()
        range.selectNode(left)
        let posLeft = range.getBoundingClientRect();
        range = document.createRange()
        range.selectNode(right)
        let posRight = range.getBoundingClientRect();
        return posLeft.top - posRight.top
    })
    for (let node of textNodes) {
        let text = node.textContent
        let parent = node.parentElement
        if (parent && text) {
            text = text.trim()
            if (text.length === 0) continue
            let style = window.getComputedStyle(parent, null)
            pdf.setTextColor(style.getPropertyValue("color"))
            //pdf.setFont(style.getPropertyValue("font-family"), style.getPropertyValue("font-style"))
            let size = parseFloat(style.getPropertyValue("font-size").replace("px", ""))
            pdf.setFontSize(size * scale)
            const bold = parseInt(style.getPropertyValue("font-weight")) > 500
            const italic = parent.nodeName === 'EM'
            console.log(parent.nodeName)
            const font = pdf.getFont()
            if (italic) pdf.setFont(font.fontName, 'italic')
            if (bold) pdf.setFont(font.fontName, font.fontStyle, 'bold')
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
                        url: parent.href
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
            if (italic) pdf.setFont(font.fontName, font.fontStyle)
            if (bold) pdf.setFont(font.fontName,  font.fontStyle, 'normal')
        }
    }
    pdf.save(name)
}

function drawBorder(pdf: jsPDF, border: string, pos: DOMRect, resumeRect: DOMRect, scale: number) {
    let args = [...border.split(' ', 2)]
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
