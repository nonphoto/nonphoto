import once from './once'
import wrap from './wrap'
import shuffle from 'lodash.shuffle'
import EventEmitter from 'events'

class SizzleClip extends EventEmitter {
    constructor(video, canvasResolution) {
        super()

        this.video = video
        this.canStart = false
        this.resolution = [0, 0]
        this.cloneCount = 1

        once(this.video, 'canplaythrough').then(() => {
            this.canStart = true
            this.fit(canvasResolution)
            this.emit('canstart')
        })
    }

    fit(canvasResolution) {
        if (!this.canStart) return

        const [canvasWidth, canvasHeight] = canvasResolution
        const scale = canvasHeight / this.video.videoHeight
        const width = this.video.videoWidth * scale

        this.resolution = [width, canvasHeight]
        this.cloneCount = Math.ceil(canvasWidth / width) + 1
    }

    start() {
        if (!this.canStart) return

        this.video.currentTime = 0
        this.video.play()
    }

    stop() {
        this.video.pause()
    }

    draw(context, offset) {
        if (!this.canStart) return

        const [w, h] = this.resolution
        const x = wrap(offset, w) - w

        for (let i = 0; i < this.cloneCount; i++) {
            context.drawImage(this.video, x + (i * w), 0, w + 1, h)
        }
    }
}

export default class SizzleCanvas extends EventEmitter {
    constructor(canvas, videos) {
        super()

        this.canvas = canvas

        this.clips = shuffle(videos.map((video) => {
            return new SizzleClip(video, [this.canvas.width, this.canvas.height])
        }))

        this.clipIndex = 0

        this.currentClip.once('canstart', () => {
            this.emit('canstart')
        })
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

    start() {
        this.currentClip.start()
    }

    next() {
        this.currentClip.stop()
        this.clipIndex = (this.clipIndex + 1) % this.clips.length
        this.currentClip.start()
    }

    draw(context, offset) {
        this.currentClip.draw(context, offset)
    }
}
