import wrap from './wrap'
import once from './once'
import shuffle from 'lodash.shuffle'

class SizzleClip  {
    constructor(src) {
        this.src = src
        this.loaded = false
        this.resolution = [0, 0]

        this.video = document.createElement('video')
        this.video.muted = true
        this.video.loop = true
        this.video.playsinline = true
    }

    load() {
        const promise = once(this.video, 'canplay').then(() => {
            this.loaded = true
        })

        this.video.src = this.src
        this.video.load()

        return promise
    }

    fit(canvasResolution) {
        if (!this.loaded) return

        const [canvasWidth, canvasHeight] = canvasResolution
        const scale = canvasHeight / this.video.videoHeight
        const width = this.video.videoWidth * scale

        this.resolution = [width, canvasHeight]
        this.cloneCount = Math.ceil(canvasWidth / width) + 1
    }

    start() {
        this.video.currentTime = 0
        this.video.play().then(() => {
            console.log(`resolved ${this.src}`)
        }, () => {
            console.log(`rejected ${this.src}`)
        })
    }

    draw(context, offset) {
        const [w, h] = this.resolution
        const x = wrap(offset, w) - w

        if (!this.cloneCount) return

        for (let i = 0; i < this.cloneCount; i++) {
            const dx = x + (i * w)
            const vw = this.video.videoWidth
            const vh = this.video.videoHeight
            context.drawImage(this.video, 0, 0, vw, vh, dx, 0, w + 1, h + 1)
        }
    }
}

export default class SizzleCanvas {
    constructor(canvas, sources) {
        this.canvas = canvas
        this.clipIndex = 0
        this.loaded = false
        this.clips = shuffle(sources).map((src) => {
            return new SizzleClip(src)
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

    load() {
        return Promise.all(this.clips.map((clip) => {
            return clip.load()
        })).then(() => {
            this.loaded = true
        })
    }

    start() {
        this.currentClip.start()
    }

    next() {
        this.clipIndex = (this.clipIndex + 1) % this.clips.length
        this.currentClip.start()
    }

    draw(context, offset) {
        this.currentClip.draw(context, offset)
    }
}
