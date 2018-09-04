export default class Marquee {
    constructor(container, text) {
        this.container = container
        this.chars = text.replace(/\s/g, '').split('')

        const testChar = document.createElement('span')
        testChar.innerText = '?'
        container.appendChild(testChar)
        this.charWidth = testChar.clientWidth
        container.removeChild(testChar)

        this.spanCount = Math.ceil(container.clientWidth / this.charWidth) * 2

        const fragment = document.createDocumentFragment()
        for (let i = 0; i < this.spanCount; i++) {
            const char = this.chars[i % this.chars.length]
            const child = document.createElement('span')
            child.innerText = char
            fragment.appendChild(child)
        }

        container.appendChild(fragment)
    }

    get virtualWidth() {
        return this.chars.length * this.charWidth
    }

    update(globalOffset) {
        const offset = Math.floor(globalOffset % this.virtualWidth)
        this.container.style.transform = `translate3d(${offset}px, 0, 0)`
    }
}
