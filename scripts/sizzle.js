import once from './once'
import shuffle from 'lodash.shuffle'

const scrollSpeed = 0.5
const viscosity = 0.05
const mouseInfluence = 0.2

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
        const x = offset % this.resolution[0] - w

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
        this.offset = 0
        this.targetOffset = 0
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    handleMouseMove(velocity) {
        this.targetOffset += velocity[0] * mouseInfluence
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
        this.targetOffset += scrollSpeed
        this.offset += (this.targetOffset - this.offset) * viscosity
        this.currentClip.draw(context, this.offset)
    }
}
