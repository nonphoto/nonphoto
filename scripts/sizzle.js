export default class SizzleCanvas {
    constructor(canvas, videos) {
        this.canvas = canvas
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight

        this.clips = videos.map((element) => {
            const scale = this.canvas.height / element.videoHeight
            const width = element.videoWidth * scale
            const cloneCount = Math.ceil(this.canvas.width / width)

            return {element, scale, width, cloneCount}
        })

        this.clipIndex = 0

        this.context = canvas.getContext('2d')
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    draw() {
        const {element, width, cloneCount} = this.currentClip

        for (let i = 0; i < cloneCount; i++) {
            this.context.drawImage(element, i * width, 0, width, this.canvas.height)
        }
    }
}
