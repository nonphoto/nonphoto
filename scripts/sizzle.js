import once from './once'

class SizzleClip {
    constructor(video, canvasResolution) {
        this.video = video
        this.canPlay = false
        this.resolution = [0, 0]
        this.cloneCount = 1

        const [canvasWidth, canvasHeight] = canvasResolution

        once(this.video, 'canplay').then(() => {
            const scale = canvasHeight / video.videoHeight
            const width = video.videoWidth * scale

            this.resolution = [width, canvasHeight]
            this.cloneCount = Math.ceil(canvasWidth / width)

            this.video.play()
            this.canPlay = true
        })
    }

    draw(context) {
        if (!this.canPlay) return

        const [w, h] = this.resolution

        for (let i = 0; i < this.cloneCount; i++) {
            context.drawImage(this.video, i * w, 0, w, h)
        }
    }
}

export default class SizzleCanvas {
    constructor(canvas, videos) {
        this.canvas = canvas
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight

        this.clips = videos.map((video) => {
            return new SizzleClip(video, [canvas.width, canvas.height])
        })

        this.clipIndex = 0
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    next() {

    }

    draw(context) {
        this.currentClip.draw(context)
    }
}
