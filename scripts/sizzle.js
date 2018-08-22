import once from './once'
import shuffle from 'lodash.shuffle'

const scrollSpeed = 0.02

class SizzleClip {
    constructor(video, canvasResolution) {
        this.video = video
        this.canPlay = false
        this.resolution = [0, 0]
        this.cloneCount = 1

        once(this.video, 'canplaythrough').then(() => {
            this.canPlay = true
            this.fit(canvasResolution)
        })
    }

    fit(canvasResolution) {
        if (!this.canPlay) return

        const [canvasWidth, canvasHeight] = canvasResolution
        const scale = canvasHeight / this.video.videoHeight
        const width = this.video.videoWidth * scale

        this.resolution = [width, canvasHeight]
        this.cloneCount = Math.ceil(canvasWidth / width) + 1
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
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight

        this.clips = shuffle(videos.map((video) => {
            return new SizzleClip(video, [this.canvas.width, this.canvas.height])
        }))

        this.clipIndex = 0
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    fit() {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight

        this.clips.forEach((clip) => {
            clip.fit([this.canvas.width, this.canvas.height])
        })
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
