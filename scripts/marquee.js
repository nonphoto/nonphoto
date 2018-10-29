import wrap from './wrap'

export default class Marquee {
    constructor(container, text) {
        this.container = container
        this.cloneTemplate = document.createElement('div')
        this.cloneTemplate.innerText = text.replace(/\W/g, '') + '•'
        this.container.appendChild(this.cloneTemplate)
    }

    inject() {
        const documentFragment = document.createDocumentFragment()

        this.cloneWidth = this.cloneTemplate.clientWidth
        const cloneCount = Math.ceil(this.container.clientWidth / this.cloneWidth) + 1
        const additionalCloneCount = Math.max(cloneCount - this.container.children.length, 0)

        for (let i = 0; i < additionalCloneCount; i++) {
            const clone = this.cloneTemplate.cloneNode(true)
            documentFragment.appendChild(clone)
        }

        this.container.appendChild(documentFragment)
    }

    update(globalOffset) {
        const offset = Math.floor(wrap(globalOffset, this.cloneWidth) - this.cloneWidth)
        this.container.style.transform = `translate3d(${offset}px, 0, 0)`
    }
}
