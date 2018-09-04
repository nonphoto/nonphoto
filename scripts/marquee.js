export default class Marquee {
    constructor(element, text) {
        const characters = text.split('')
        const fragment = document.createDocumentFragment()

        for (let c of characters) {
            const child = document.createElement('span')
            child.innerText = c
            fragment.appendChild(child)
        }

        element.appendChild(fragment)
    }
}
