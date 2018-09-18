import once from './once'
import wrap from './wrap'
import shuffle from 'lodash.shuffle'
import EventEmitter from 'events'

class SizzleClip extends EventEmitter {
    constructor(video) {
        super()

        this.video = video
        this.canStart = false
        this.resolution = [0, 0]
        this.cloneCount = 1

        once(this.video, 'canplaythrough').then(() => {
            this.canStart = true
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
        this.clips = []
        this.clipIndex = 0
        this.canStart = false

        shuffle(videos).forEach((video) => {
            const clip = new SizzleClip(video, this.resolution)

            clip.once('canstart', () => {
                clip.fit(this.resolution)
                this.clips.push(clip)

                if (this.clips.length <= 1) {
                    this.canStart = true
                    this.emit('canstart')
                }
            })
        })

        this.fit()
    }

    get resolution() {
        return [this.canvas.width, this.canvas.height]
    }

    get currentClip() {
        return this.clips[this.clipIndex]
    }

    fit() {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight

        this.clips.forEach((clip) => {
            clip.fit(this.resolution)
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
