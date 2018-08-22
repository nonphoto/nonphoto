import once from './once'
import shuffle from 'lodash.shuffle'

const scrollSpeed = 0.02

class SizzleClip {
    constructor(video, canvasResolution) {
        this.video = video
        this.canPlay = false
        this.resolution = [0, 0]
        this.cloneCount = 1

        const [canvasWidth, canvasHeight] = canvasResolution

        once(this.video, 'canplaythrough').then(() => {
            const scale = canvasHeight / video.videoHeight
            const width = video.videoWidth * scale

            this.resolution = [width, canvasHeight]
            this.cloneCount = Math.ceil(canvasWidth / width) + 1
            this.canPlay = true
        })
    }

    start() {
        if (!this.canPlay) return

        this.video.currentTime = 0
        this.video.play()
    }

    stop() {
        this.video.pause()
    }

    draw(context, offset) {
        if (!this.canPlay) return

        const [w, h] = this.resolution
        const x = offset % this.resolution[0]

        for (let i = 0; i < this.cloneCount; i++) {
            context.drawImage(this.video, x + (i * w), 0, w, h)
        }
    }
}

export default class SizzleCanvas {
    constructor(canvas, videos) {
        this.canvas = canvas
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight

        this.clips = shuffle(videos.map((video) => {
            return new SizzleClip(video, [canvas.width, canvas.height])
        }))

        this.clipIndex = 0
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    next() {
        this.currentClip.stop()
        this.clipIndex = (this.clipIndex + 1) % this.clips.length
        this.currentClip.start()
    }

    draw(context) {
        const offset = (performance.now() * scrollSpeed) % this.canvas.width
        this.currentClip.draw(context, -offset)
    }
}
