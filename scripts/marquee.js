import wrap from './wrap'

export default class Marquee {
    constructor(container, text) {
        this.container = container
        this.chars = text.replace(/\s/g, '').split('')
    }

    get virtualWidth() {
        return this.chars.length * this.charWidth
    }

    clear() {
        while(this.container.firstChild) {
            this.container.removeChild(this.container.firstChild)
        }
    }

    inject() {
        const testChar = document.createElement('span')
        testChar.innerText = '?'
        this.container.appendChild(testChar)
        this.charWidth = Math.max(testChar.clientWidth)
        this.container.removeChild(testChar)

        this.spanCount = this.chars.length + Math.ceil(this.container.clientWidth / this.charWidth) + 1

        const fragment = document.createDocumentFragment()
        for (let i = 0; i < this.spanCount; i++) {
            const char = this.chars[i % this.chars.length]
            const child = document.createElement('div')
            child.style.minWidth = `${this.charWidth}px`
            child.innerText = char
            fragment.appendChild(child)
        }

        this.container.appendChild(fragment)
    }

    update(globalOffset) {
        const offset = Math.floor(wrap(globalOffset, this.virtualWidth) - this.virtualWidth)
        this.container.style.transform = `translate3d(${offset}px, 0, 0)`
    }
}
